/** Runtime JSON — always local data/, optional GitHub sync */
const store = require('./githubStore');
store.ready().catch(() => {});

function read(name, def) {
  let d = def;
  if (d === undefined) {
    if (['approvedGroups.json', 'bans.json', 'lockedCommands.json', 'paidCommands.json'].includes(name)) d = [];
    else if (name === 'adminonly.json') d = { enabled: false };
    else d = {};
  }
  try { return store.get(name, d); } catch { return d; }
}
function write(name, data, opts) {
  store.set(name, data);
  store.save(name, opts || {});
}
function writeNow(name, data) { return write(name, data, { immediate: true }); }
module.exports = { read, write, writeNow, store };
