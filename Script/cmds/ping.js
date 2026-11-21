const os = require('os');

module.exports = {
  config: {
    name: "ping",
    aliases: ["pong", "speed"],
    author: "Community",
    version: "3.2 REAL COUNT",
    cooldown: 5,
    role: 0,
    description: "Check bot response time and system information",
    category: "system",
    usePrefix: true
  },

  BADOL: async function ({ event, api, message, chatId, ctx }) {
    const chatIdLocal = chatId || event.chat.id;
    const apiStartTime = Date.now();

    const loadingStates = [
      '[█▒▒▒▒▒▒▒▒▒] 10%',
      '[███▒▒▒▒▒▒▒] 30%',
      '[█████▒▒▒▒▒] 50%',
      '[███████▒▒▒] 75%',
      '[██████████] 100%'
    ];

    let sentMsg;
    try {
      sentMsg = await message.reply(loadingStates[0]);
    } catch {
      sentMsg = await api.sendMessage(chatIdLocal, loadingStates[0]);
    }

    const apiPing = Date.now() - apiStartTime;
    const msgId = sentMsg.message_id;

    async function editMsg(text) {
      try {
        if (ctx) {
          await ctx.telegram.editMessageText(chatIdLocal, msgId, null, text);
        } else {
          await api.editMessageText(text, {
            chat_id: chatIdLocal,
            message_id: msgId
          });
        }
      } catch (e) {
        console.log("Edit Error:", e.message);
      }
    }

    for (let i = 1; i < loadingStates.length; i++) {
      await sleep(250);
      await editMsg(loadingStates[i]);
    }

    const uptime = process.uptime();

    const totalMemNum = os.totalmem() / 1024 / 1024 / 1024;
    const freeMemNum = os.freemem() / 1024 / 1024 / 1024;
    const usedMemNum = totalMemNum - freeMemNum;
    const memUsage = ((usedMemNum / totalMemNum) * 100).toFixed(1);

    const cpuUsage = process.cpuUsage();
    const cpuPercent = ((cpuUsage.user + cpuUsage.system) / 1000000).toFixed(2);

    let formattedUptime = "N/A";
    try {
      formattedUptime = global.utils.formatUptime(uptime);
    } catch {
      let s = Math.floor(uptime);
      let h = Math.floor(s / 3600);
      let m = Math.floor((s % 3600) / 60);
      s = s % 60;
      formattedUptime = `${h}h ${m}m ${s}s`;
    }

    let totalUsers = 0;
    let totalGCs = 0;
    try {
      const allUsers = await global.db.getAllUsers();
      const allThreads = await global.db.getAllThreads();
      totalUsers = allUsers.length;
      totalGCs = allThreads.filter(t => t.type === 'group' || t.type === 'supergroup').length;
    } catch {}

    // ✅ 100% REAL COMMAND COUNT - Alias বাদ
    let realCmdCount = 0;
    let loadedWithAlias = 0;
    try {
      if (global.badol?.commands) {
        loadedWithAlias = global.badol.commands.size;
        // Map দিয়ে Unique Name Filter
        const unique = new Map();
        for (const cmd of global.badol.commands.values()) {
          if (cmd?.config?.name) {
            unique.set(cmd.config.name.toLowerCase(), cmd);
          }
        }
        realCmdCount = unique.size;
      }
    } catch {
      realCmdCount = global.badol?.commands?.size || 0;
    }

    const responseText = `🏓 Pong! ${apiPing}ms\n\n` +
      `📊 System Information:\n` +
      `━━━━━━━━━━━━━━\n` +
      `⏱️ API Ping: ${apiPing}ms\n` +
      `🕐 Uptime: ${formattedUptime}\n` +
      `💾 Memory: ${usedMemNum.toFixed(2)}GB / ${totalMemNum.toFixed(2)}GB (${memUsage}%)\n` +
      `⚙️ CPU: ${cpuPercent}s\n` +
      `🖥️ Platform: ${os.platform()} ${os.arch()}\n` +
      `📦 Node: ${process.version}\n` +
      `━━━━━━━━━━━━━━\n` +
      `📈 Bot Stats:\n` +
      `👤 Commands: ${realCmdCount} (Real)\n` +
      `📦 Loaded: ${loadedWithAlias} (with Alias)\n` +
      `🎭 Events: ${global.badol?.events?.size || 0}\n` +
      `👥 Users: ${totalUsers}\n` +
      `💬 Groups: ${totalGCs}\n` +
      `━━━━━━━━━━━━━━\n` +
      `👤 User: ${event.from.first_name}\n` +
      `📍 Chat: ${event.chat.title || 'Private'}`;

    await editMsg(responseText);
  }
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}