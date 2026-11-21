/**
 * JSON Database — RAM + GitHub ONLY (no permanent local disk)
 * Uses githubStore for users / threads / approvals / bans
 */
const store = require('./githubStore');

class JsonDatabase {
  constructor() {
    this.users = new Map();
    this.threads = new Map();
    this.approvals = new Map();
    this.bans = new Map();
    this.saveTimeout = null;
    this._ready = false;
    this.init();
  }

  async init() {
    try {
      await store.ready();
      this._hydrateFromStore();
      this._ready = true;
      setInterval(() => this.forceSave(), 60000);
    } catch (e) {
      console.error('[JsonDB] init error:', e.message);
      this._ready = true;
    }
  }

  _hydrateFromStore() {
    try {
      const users = store.get('users.json', {}) || {};
      this.users = new Map(Object.entries(users));
    } catch {}
    try {
      const threads = store.get('threads.json', {}) || {};
      this.threads = new Map(Object.entries(threads));
    } catch {}
    try {
      const approvals = store.get('approvals.json', {}) || {};
      this.approvals = new Map(Object.entries(approvals));
    } catch {}
    try {
      const bans = store.get('bans.json', {}) || {};
      this.bans = new Map(Object.entries(bans));
    } catch {}
  }

  save() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.forceSave(), 3000);
  }

  forceSave() {
    try {
      store.set('users.json', Object.fromEntries(this.users));
      store.set('threads.json', Object.fromEntries(this.threads));
      store.set('approvals.json', Object.fromEntries(this.approvals));
      store.set('bans.json', Object.fromEntries(this.bans));
      store.save('users.json');
    } catch (e) {
      console.error('[JsonDB] Save Error:', e.message);
    }
  }

  // ================= USERS =================
  async getUser(userId) {
    userId = String(userId);
    if (!this.users.has(userId)) {
      this.users.set(userId, {
        name: '',
        username: '',
        totalMsg: 0
      });
      this.save();
    }
    return this.users.get(userId);
  }

  async updateUser(userId, data) {
    userId = String(userId);
    const user = await this.getUser(userId);
    if (data.firstName) user.name = data.firstName + (data.lastName ? ' ' + data.lastName : '');
    if (data.name && !data.firstName) user.name = data.name;
    if (data.username) user.username = data.username;
    if (typeof data.totalMsg === 'number') user.totalMsg = data.totalMsg;
    
    this.users.set(userId, user);
    this.save();
    return user;
  }

  // ================= THREADS / GROUPS =================
  async getThread(threadId) {
    threadId = String(threadId);
    if (!this.threads.has(threadId)) {
      this.threads.set(threadId, {
        name: ''
      });
      this.save();
    }
    return this.threads.get(threadId);
  }

  async updateThread(threadId, data) {
    threadId = String(threadId);
    const thread = await this.getThread(threadId);
    if (data.name) thread.name = data.name;
    if (data.title) thread.name = data.title;
    
    this.threads.set(threadId, thread);
    this.save();
    return thread;
  }

  // ================= MESSAGE COUNT =================
  async incrementMessageCount(userId, threadId) {
    userId = String(userId);
    threadId = String(threadId);

    const user = await this.getUser(userId);
    await this.getThread(threadId);

    user.totalMsg = (user.totalMsg || 0) + 1;
    
    this.users.set(userId, user);
    this.save();

    return { userCount: user.totalMsg };
  }

  // ================= COMPATIBILITY =================
  async incrementUserExp(userId) { return await this.getUser(userId); }
  async getUserMessageCount(userId) { const u = await this.getUser(userId); return u.totalMsg || 0; }
  async getThreadMessageStats() { return { totalMessages: 0, userMessages: {} }; }
  async getAllUsers() { return Array.from(this.users.entries()).map(([id, data]) => ({ uid: id, ...data })); }
  async getAllThreads() { return Array.from(this.threads.entries()).map(([id, data]) => ({ id: id, ...data })); }

  // Approval / Ban
  async addApproval(type, data) {
    const id = `${type}_${Date.now()}`;
    this.approvals.set(id, { id, type, ...data, createdAt: Date.now() });
    this.save();
    return id;
  }
  async getApproval(id) { return this.approvals.get(id); }
  async removeApproval(id) { this.approvals.delete(id); this.save(); }
  async getAllApprovals(type = null) {
    const all = Array.from(this.approvals.values());
    return type ? all.filter(a => a.type === type) : all;
  }
  async banUser(userId, reason = '', bannedBy = '') {
    this.bans.set(String(userId), { userId: String(userId), reason, bannedBy, bannedAt: Date.now() });
    this.save();
  }
  async unbanUser(userId) { this.bans.delete(String(userId)); this.save(); }
  async isUserBanned(userId) { return this.bans.has(String(userId)); }
  async getAllBans() { return Array.from(this.bans.values()); }
  async addUnbanRequest(userId, reason = '', chatId = null) {
    const id = `unban_${Date.now()}`;
    this.approvals.set(id, { id, type: 'unban', userId: String(userId), reason, chatId: chatId ? String(chatId) : null, createdAt: Date.now() });
    this.save();
    return id;
  }
  async getUnbanRequests() { return Array.from(this.approvals.values()).filter(a => a.type === 'unban'); }
  async addWarning() { return 1; }
  async getWarnings() { return []; }
  async clearWarnings() {}
}

module.exports = JsonDatabase;
