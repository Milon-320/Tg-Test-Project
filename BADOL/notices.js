const fs = require('fs');
const path = require('path');
const { read: gRead, write: gWrite, writeNow: gWriteNow } = require('../database/dataFile');

function getConfig() {
  const cfg = global.config;
  if (!cfg) return { adminUID: [], onlyAdmin: false, prefix: '/' };
  return {
    adminUID: cfg.ownerInfo?.botAdmins || cfg.adminUID || [],
    prefix: cfg.botInfo?.prefix || cfg.prefix || '/',
    botName: cfg.botInfo?.name || cfg.botName || 'ESB-BOT',
    ownerName: "ESB BOT",
    ownerId: cfg.ownerInfo?.mainOwner?.id || MAIN_OWNER_ID,
    botUsername: cfg.botInfo?.username || "esbbot",
    bannedUsers: cfg.banSystem?.bannedUsers || [],
    bannedGroups: cfg.banSystem?.bannedGroups || []
  };
}

function getButtons(cfg) {
  return {
    inline_keyboard: [
      [{ text: `🤖 ${cfg.botName}`, url: `https://t.me/${cfg.botUsername.replace('@', '')}` }]
    ]
  };
}

function safeName(str, len = 20) {
  try {
    if (!str) return "Unknown";
    str = String(str).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
    if (!str) return "Unknown";
    const arr = Array.from(str);
    if (arr.length > len) return arr.slice(0, len).join("") + "…";
    return arr.join("");
  } catch {
    return "Group";
  }
}

function isBotAdminCheck(userId) {
  const cfg = getConfig();
  return cfg.adminUID.map(String).includes(String(userId)) || DUAL_OWNER_IDS.includes(String(userId));
}

function getApprovedGroups() {
  try {
    return gRead("approvedGroups.json", []) || [];
  } catch {
    return [];
  }
}

function getAdminOnlyState() {
  try {
    const data = gRead("adminonly.json", { enabled: false }) || {};
    if (typeof data.enabled === 'boolean') return data.enabled;
  } catch {}
  const st = global.config?.settings || {};
  if (st.adminOnlyMode!== undefined) return st.adminOnlyMode === true;
  if (st.onlyAdmin!== undefined) return st.onlyAdmin === true;
  return false;
}

function getGroupApprovalEnabled() {
  const st = global.config?.settings || {};
  if (st.groupApprovalEnabled!== undefined) return st.groupApprovalEnabled!== false;
  if (st.groupApproval && typeof st.groupApproval.enabled!== 'undefined') return st.groupApproval.enabled!== false;
  return true;
}

function getDMApprovalEnabled() {
  const st = global.config?.settings || {};
  if (st.dmApprovalEnabled!== undefined) return st.dmApprovalEnabled === true;
  if (st.dmApproval && typeof st.dmApproval.enabled!== 'undefined') return st.dmApproval.enabled === true;
  return false;
}

function getAdminListFromCache(chatId) {
  try {
    const map = global.badol?.threadAdmins;
    if (!map) return null;
    const keys = [String(chatId), chatId, Number(chatId)];
    for (const key of keys) {
      if (key == null || Number.isNaN(key)) continue;
      if (!map.has(key)) continue;
      const cached = map.get(key);
      if (cached?.admins && Array.isArray(cached.admins)) return cached.admins.map(String);
      if (Array.isArray(cached)) return cached.map(String);
    }
  } catch {}
  return null;
}

function setAdminCache(chatId, adminIds) {
  try {
    if (!global.badol) global.badol = {};
    if (!global.badol.threadAdmins) global.badol.threadAdmins = new Map();
    const entry = { admins: adminIds.map(String), timestamp: Date.now() };
    global.badol.threadAdmins.set(String(chatId), entry);
    global.badol.threadAdmins.set(chatId, entry);
    const num = Number(chatId);
    if (!Number.isNaN(num)) global.badol.threadAdmins.set(num, entry);
  } catch {}
}

module.exports = {
  async checkBan({ api, chatId, userId, text, prefix, event }) {
    if (!global.db && getConfig().bannedUsers.length === 0) return { blocked: false };
    if (!userId) return { blocked: false };
    try {
      const cfg = getConfig();
      const uid = String(userId);
      const raw = String(text || "").trim().toLowerCase();
      let _cmd = raw.split(' ')[0] || "";
      if (_cmd.startsWith(prefix)) _cmd = _cmd.slice(prefix.length);
      if (_cmd.startsWith('/')) _cmd = _cmd.slice(1);
      if (_cmd.includes('@')) _cmd = _cmd.split('@')[0];
      if (["request", "req", "appeal"].includes(_cmd)) return { blocked: false };
      if (cfg.bannedUsers.includes(uid)) {
        let reason = 'Violation';
        try {
          if (global.config?.banSystem?.bannedUsersReason?.[uid]) reason = global.config.banSystem.bannedUsersReason[uid];
        } catch {}
        reason = reason.length > 20? reason.slice(0, 20) + '..' : reason;
        const msg = `╭━❮ 𝐄𝐒𝐁-𝐁𝐎𝐓 ❯━╮\n├═━═━═━═━═━═━═━═━═━═\n├‣ ⛔ 𝗕𝗔𝗡𝗡𝗘𝗗 𝗨𝗦𝗘𝗥\n├‣ 📝 𝗥𝗲𝗮𝘀𝗼𝗻: ${reason}\n├‣ 🚫 𝗦𝘁𝗮𝘁𝘂𝘀: Blocked\n├═━═━═━═━═━═\n├‣ 💡 𝗦𝗼𝗹𝘂𝘁𝗶𝗼𝗻:\n├‣ 📩 You can request Unban!\n├‣\n├‣ 📌 Type:\n├‣ ${prefix}request Your Reason\n├‣\n├‣ 📝 Example:\n├‣ ${prefix}request Sorry bro 🙏\n╰━═━═━═━═━═━═━═━═━╯`;
        await api.sendMessage(chatId, msg, { reply_to_message_id: event.message_id, reply_markup: getButtons(cfg) }).catch(() => {});
        return { blocked: true, silent: false };
      }
      if (global.db) {
        const isBanned = await global.db.isUserBanned(String(userId));
        if (!isBanned) return { blocked: false };
        if (!text.startsWith(prefix) &&!text.startsWith('/')) return { blocked: true, silent: true };
        let reason = 'Violation';
        try {
          const info = await global.db.getBanInfo?.(String(userId)) || {};
          if (info.reason) reason = info.reason;
        } catch {}
        reason = reason.length > 20? reason.slice(0, 20) + '..' : reason;
        const msg = `╭━❮ 𝐄𝐒𝐁-𝐁𝐎𝐓 ❯━╮\n├═━═━═━═━═━═\n├‣ ⛔ 𝗕𝗔𝗡𝗡𝗘𝗗 𝗨𝗦𝗘𝗥\n├‣ 📝 𝗥𝗲𝗮𝘀𝗼𝗻: ${reason}\n├‣ 🚫 𝗦𝘁𝗮𝘁𝘂𝘀: Blocked\n├═━═━═━═━═━═\n├‣ 💡 𝗨𝗻𝗯𝗮𝗻 𝗢𝗽𝘁𝗶𝗼𝗻:\n├‣ 📩 Request Available!\n├‣\n├‣ 📌 Type:\n├‣ ${prefix}request Your Reason\n╰━═━═━═━═━═━═━═━═━╯`;
        await api.sendMessage(chatId, msg, { reply_to_message_id: event.message_id, reply_markup: getButtons(cfg) }).catch(() => {});
        return { blocked: true, silent: false };
      }
      return { blocked: false };
    } catch {
      return { blocked: false };
    }
  },

  async checkPermission({ command, userId, chatId, ctx }) {
    const cfg = getConfig();
    const uid = String(userId);
    const role = Number(command?.config?.role || 0);
    const isOwner = DUAL_OWNER_IDS.includes(uid);
    const isBotAdmin = cfg.adminUID.map(String).includes(uid) || isOwner;

    const st = global.config?.settings || {};
    const onlyAdminEnabled = st.onlyAdmin === true || st.adminOnlyMode === true || getAdminOnlyState();
    if (onlyAdminEnabled &&!isBotAdmin) {
      if (getAdminOnlyState() && (st.adminOnlyMode === true || getAdminOnlyState())) {
        return { blocked: true, silent: true, msg: null };
      }
      return {
        blocked: true,
        msg: `╭━❮ 𝐄𝐒𝐁-𝐁𝐎𝐓 ❯━╮\n├═━═━═━═━═━═\n├‣ 🔒 𝗔𝗗𝗠𝗜𝗡 𝗢𝗡𝗟𝗬 𝗠𝗢𝗗𝗘\n├‣ ⚠️ Admin Lock Active\n╰━═━═━═━═━═━═━═━═━╯`,
        keyboard: getButtons(cfg)
      };
    }

    if (role <= 0) return { blocked: false };

    if (role >= 2) {
      if (!isBotAdmin) {
        return {
          blocked: true,
          msg: `╭━❮ 𝐄𝐒𝐁-𝐁𝐎𝐓 ❯━╮\n├═━═━═━═━═━═━═━═━═━═\n├‣ 👑 𝗢𝗪𝗡𝗘𝗥 / 𝗕𝗢𝗧 𝗔𝗗𝗠𝗜𝗡\n├‣ 🔐 Only Bot Admin Access\n╰━═━═━═━═━═━═━═━═━╯`,
          keyboard: getButtons(cfg)
        };
      }
      return { blocked: false };
    }

    if (isBotAdmin) return { blocked: false };

    const cidStr = chatId!= null? String(chatId) : "";
    if (!cidStr.startsWith("-")) {
      return {
        blocked: true,
        msg: `╭━❮ 𝐄𝐒𝐁-𝐁𝐎𝐓 ❯━╮\n├═━═━═━═━═━═━═━═━═━═\n├‣ 🔰 𝗚𝗥𝗢𝗨𝗣 𝗔𝗗𝗠𝗜𝗡 𝗢𝗡𝗟𝗬\n├‣ 🛡️ Need Admin Power\n╰━═━═━═━═━╯`,
        keyboard: getButtons(cfg)
      };
    }

    const cachedAdmins = getAdminListFromCache(chatId);
    if (cachedAdmins && cachedAdmins.includes(uid)) return { blocked: false };

    try {
      const telegram = ctx?.telegram || global.bot;
      if (telegram?.getChatMember) {
        const member = await telegram.getChatMember(chatId, userId);
        const ok = member && ["creator", "administrator"].includes(member.status);
        if (ok) {
          const list = cachedAdmins? Array.from(new Set([...cachedAdmins, uid])) : [uid];
          setAdminCache(chatId, list);
          return { blocked: false };
        }
      } else if (telegram?.getChatAdministrators) {
        const admins = await telegram.getChatAdministrators(chatId);
        const ids = (admins || []).map(a => String(a.user.id));
        setAdminCache(chatId, ids);
        if (ids.includes(uid)) return { blocked: false };
      }
    } catch (e) {
      console.log("role1 permission check error:", e.message);
    }

    return {
      blocked: true,
      msg: `╭━❮ 𝐄𝐒𝐁-𝐁𝐎𝐓 ❯━╮\n├═━═━═━═━═━═━═━═━═━═\n├‣ 🔰 𝗚𝗥𝗢𝗨𝗣 𝗔𝗗𝗠𝗜𝗡 𝗢𝗡𝗟𝗬\n├‣ 🛡️ Need Admin Power\n╰━═━═━═━═━╯`,
      keyboard: getButtons(cfg)
    };
  },

  checkCooldown({ command, userId }) {
    const st = global.config?.settings || {};
    const cooldownEnabled = st.cooldownEnabled!== false && st.cooldown?.enabled!== false;
    if (!cooldownEnabled) return { blocked: false };
    const cfg = getConfig();
    const key = `${userId}_${command.config.name}`;
    const now = Date.now();
    const amount = (command.config.cooldown || 0) * 1000;
    if (global.badol.cooldowns.has(key)) {
      const exp = global.badol.cooldowns.get(key);
      if (now < exp) {
        const left = ((exp - now) / 1000).toFixed(1);
        return {
          blocked: true,
          msg: `╭━❮ 𝐄𝐒𝐁-𝐁𝐎𝐓 ❯━╮\n├═━═━═━═━═━═━═━═━═━═\n├‣ ⏳ 𝗖𝗢𝗟𝗗𝗢𝗪𝗡: ${left}s\n├‣ 💤 Slow Down!\n╰━═━═━═━═━═━═━═━╯`,
          keyboard: getButtons(cfg)
        };
      }
    }
    global.badol.cooldowns.set(key, now + amount);
    setTimeout(() => global.badol.cooldowns.delete(key), amount);
    return { blocked: false };
  },

  checkAdminOnly(userId) {
    const enabled = getAdminOnlyState();
    if (!enabled) return { blocked: false };
    if (!isBotAdminCheck(userId)) return { blocked: true, silent: true, msg: null };
    return { blocked: false };
  },

  checkMaintenance(userId) {
    const st = global.config?.settings || {};
    const enabled = st.maintenanceEnabled === true || st.maintenance?.enabled === true;
    if (!enabled) return { blocked: false };
    if (!isBotAdminCheck(userId)) {
      return { blocked: true, silent: true, msg: null, keyboard: getButtons(getConfig()) };
    }
    return { blocked: false };
  },

  checkGroupApproval(chatId, commandName, chatTitle) {
    const enabled = getGroupApprovalEnabled();
    if (!enabled) return { blocked: false };
    const isGroup = String(chatId).startsWith("-");
    if (!isGroup) return { blocked: false };
    const approvedList = getApprovedGroups();
    const isApproved = approvedList.includes(String(chatId));
    const allowCmds = ["approve", "setting", "group", "gclist", "gcapprove", "gapprove"];
    if (!isApproved &&!allowCmds.includes(commandName)) {
      const displayName = safeName(chatTitle || "This Group", 20);
      const cfg = getConfig();
      const box = `╭━❮ 𝐄𝐒𝐁-𝐁𝐎𝐓 ❯━╮\n├═━═━═━═━═━═━═━═━═━═\n├‣ ❌ 𝗡𝗢𝗧 𝗔𝗣𝗥𝗢𝗩𝗘𝗗\n├‣ 📛 𝗚𝗿𝗼𝘂𝗽: ${displayName}\n├‣ 🆔 𝗜𝗗: ${String(chatId).slice(-8)}\n├═━═━═━═━═━═━═━═━═━═\n├‣ ⚠️ Approval Needed!\n╰━═━═━═━═━═━═━═━╯`;
      return { blocked: true, silent: false, msg: box, keyboard: getButtons(cfg) };
    }
    return { blocked: false };
  },

  checkDMApproval(userId, chatType, commandName) {
    const enabled = getDMApprovalEnabled();
    if (!enabled) return { blocked: false };
    if (chatType!== 'private') return { blocked: false };
    const allowCmds = ["request", "req", "appeal", "start"];
    if (!isBotAdminCheck(userId) &&!allowCmds.includes(commandName)) {
      return { blocked: true, silent: true, msg: null };
    }
    return { blocked: false };
  },

  getNotFoundNotice(commandName, prefix) {
    const cfg = getConfig();
    return {
      msg: `╭━❮ 𝐄𝐒𝐁-𝐁𝐎𝐓 ❯━╮\n├═━═━═━═━═━═\n├‣ ❌ 𝗖𝗠𝗗 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗\n├‣ 🔍 "${commandName.slice(0, 12)}"\n├═━═━═━═━═━═━═━═━═━═\n├‣ 💡 𝗧𝗿𝘆: ${prefix}help\n╰━═━═━═━═━═━═━═━╯`,
      keyboard: getButtons(cfg)
    };
  },

  isBanSystemEnabled() {
    const st = global.config?.settings || {};
    return st.banSystemEnabled!== false && st.banSystem?.enabled!== false;
  },

  getAdminOnlyState,
  getGroupApprovalEnabled,
  getDMApprovalEnabled
};
