/**
 * Dual storage: ALWAYS local JSON in /data
 * Optional GitHub sync when config.githubSync.enable + token
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const CACHE = new Map();
const SHA = new Map();
let GH = null;
let lastPush = 0;
let pushPending = false;
let initPromise = null;
let pushIntervalSec = 120;

const LOCAL_DIR = path.join(__dirname, '..', 'data');

const RUNTIME_FILES = [
  'users.json', 'threads.json', 'approvals.json', 'bans.json',
  'approvedGroups.json', 'adminonly.json', 'antibot.json', 'muted_users.json',
  'antigali_db.json', 'polls.json', 'mbc_settings.json', 'userLanguages.json',
  'auto.json', 'postsave.json', 'prefixmode.json', 'setmenu.json',
  'lockedCommands.json', 'groupCommands.json', 'credits.json', 'paidCommands.json',
  'referrals.json', 'firstClaim.json', 'invites.json', 'nametracker.json',
  'namewatch.json', 'used_hadis.json'
];

function ensureLocalDir() {
  try { if (!fs.existsSync(LOCAL_DIR)) fs.mkdirSync(LOCAL_DIR, { recursive: true }); } catch {}
}
function localPath(name) { ensureLocalDir(); return path.join(LOCAL_DIR, name); }

function readLocal(fileName, def) {
  try {
    const p = localPath(fileName);
    if (!fs.existsSync(p)) return def;
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch { return def; }
}

function writeLocal(fileName, obj) {
  try {
    ensureLocalDir();
    fs.writeFileSync(localPath(fileName), JSON.stringify(obj, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('[GStore] local write', fileName, e.message);
    return false;
  }
}

function loadConfig() {
  try {
    let cfg = (global.config && global.config.githubSync) || {};
    if (!cfg.enable) {
      try {
        const raw = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));
        cfg = raw.githubSync || {};
      } catch {}
    }
    if (cfg.enable && cfg.token && cfg.owner && cfg.repo) {
      GH = {
        token: cfg.token, owner: cfg.owner, repo: cfg.repo,
        branch: cfg.branch || 'main',
        folder: (cfg.folder || 'bot-data').replace(/^\/|\/$/g, '')
      };
      pushIntervalSec = Math.max(30, Number(cfg.pushIntervalSec) || 120);
    } else GH = null;
  } catch { GH = null; }
}

function api() {
  if (!GH) return null;
  return axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Authorization: `Bearer ${GH.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'ESB-BOT'
    },
    timeout: 25000
  });
}

function repoPath(name) { return GH.folder ? `${GH.folder}/${name}` : name; }

async function githubGet(fileName) {
  const a = api();
  if (!a) return null;
  try {
    const res = await a.get(`/repos/${GH.owner}/${GH.repo}/contents/${repoPath(fileName)}`, { params: { ref: GH.branch } });
    SHA.set(fileName, res.data.sha);
    return JSON.parse(Buffer.from(res.data.content, 'base64').toString('utf8'));
  } catch (e) {
    if (e.response?.status === 404) { SHA.set(fileName, null); return null; }
    console.error(`[GStore] GET ${fileName}:`, e.response?.data?.message || e.message);
    return null;
  }
}

async function githubPut(fileName, obj) {
  const a = api();
  if (!a) return false;
  try {
    const body = {
      message: `esb-data: ${fileName} (${new Date().toISOString()})`,
      content: Buffer.from(JSON.stringify(obj, null, 2), 'utf8').toString('base64'),
      branch: GH.branch
    };
    if (SHA.get(fileName)) body.sha = SHA.get(fileName);
    const res = await a.put(`/repos/${GH.owner}/${GH.repo}/contents/${repoPath(fileName)}`, body);
    if (res.data?.content?.sha) SHA.set(fileName, res.data.content.sha);
    return true;
  } catch (e) {
    if (e.response?.status === 409 || e.response?.status === 422) {
      try {
        await githubGet(fileName);
        const body = {
          message: `esb-data: ${fileName} (${new Date().toISOString()})`,
          content: Buffer.from(JSON.stringify(obj, null, 2), 'utf8').toString('base64'),
          branch: GH.branch
        };
        if (SHA.get(fileName)) body.sha = SHA.get(fileName);
        const res = await a.put(`/repos/${GH.owner}/${GH.repo}/contents/${repoPath(fileName)}`, body);
        if (res.data?.content?.sha) SHA.set(fileName, res.data.content.sha);
        return true;
      } catch (e2) {
        console.error(`[GStore] PUT ${fileName}:`, e2.response?.data?.message || e2.message);
        return false;
      }
    }
    console.error(`[GStore] PUT ${fileName}:`, e.response?.data?.message || e.message);
    return false;
  }
}

function defaultFor(fileName) {
  if (['approvedGroups.json', 'bans.json', 'lockedCommands.json', 'paidCommands.json'].includes(fileName)) return [];
  if (fileName === 'adminonly.json') return { enabled: false };
  return {};
}

async function ready() {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    loadConfig();
    ensureLocalDir();
    for (const f of RUNTIME_FILES) {
      const local = readLocal(f, null);
      if (local !== null && local !== undefined) CACHE.set(f, local);
      else if (!CACHE.has(f)) CACHE.set(f, defaultFor(f));
    }
    if (GH) {
      for (const f of RUNTIME_FILES) {
        const data = await githubGet(f);
        if (data !== null && data !== undefined) {
          CACHE.set(f, data);
          writeLocal(f, data);
        }
      }
      console.log('[GStore] Dual mode: local data/ + GitHub sync ON');
      setInterval(() => { if (pushPending) pushAll().catch(() => {}); }, pushIntervalSec * 1000);
      const flush = () => {
        try {
          for (const [fileName, data] of CACHE.entries()) writeLocal(fileName, data);
          pushAll();
        } catch {}
      };
      process.on('SIGINT', flush);
      process.on('SIGTERM', flush);
      process.on('beforeExit', flush);
    } else {
      console.log('[GStore] Local mode: saving under data/ (GitHub sync OFF)');
    }
  })();
  return initPromise;
}

function get(fileName, defaultValue) {
  if (!CACHE.has(fileName)) {
    const local = readLocal(fileName, undefined);
    if (local !== undefined && local !== null) CACHE.set(fileName, local);
    else CACHE.set(fileName, defaultValue !== undefined ? defaultValue : defaultFor(fileName));
  }
  return CACHE.get(fileName);
}

function set(fileName, value) {
  CACHE.set(fileName, value);
  writeLocal(fileName, value);
}

function save(fileName, opts) {
  const data = CACHE.has(fileName) ? CACHE.get(fileName) : defaultFor(fileName);
  writeLocal(fileName, data);
  pushPending = true;
  if (!GH) return;
  const immediate = opts && opts.immediate;
  const now = Date.now();
  if (immediate || now - lastPush >= pushIntervalSec * 1000) {
    if (immediate) lastPush = 0;
    pushAll().catch(() => {});
  }
}

async function pushAll() {
  for (const [fileName, data] of CACHE.entries()) writeLocal(fileName, data);
  if (!GH) return;
  const now = Date.now();
  if (now - lastPush < 5000) { pushPending = true; return; }
  lastPush = now;
  pushPending = false;
  for (const [fileName, data] of CACHE.entries()) {
    if (!RUNTIME_FILES.includes(fileName) && !String(fileName).endsWith('.json')) continue;
    await githubPut(fileName, data);
  }
  console.log('[GStore] Synced data to GitHub + local data/');
}

function enabled() {
  if (!GH) loadConfig();
  return !!GH;
}

module.exports = { ready, get, set, save, pushAll, enabled, RUNTIME_FILES, LOCAL_DIR };
