// ✅ RESTART V8.9 - FINAL - LOGIN BOX SYSTEM
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "restart",
    aliases: ["reboot", "r"],
    author: "MOHAMMAD BADOL",
    version: "8.9-FINAL",
    cooldown: 10,
    role: 2,
    description: "Restart Bot - V8.9",
    category: "admin",
    usePrefix: true
  },

  BADOL: async function ({ event, api, message, ctx }) {
    try {
      const tmpDir = path.join(__dirname, '..', '..', 'tmp');
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
      
      const sec = Math.floor(process.uptime());
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const prev = `${h}h ${m}m`;
      
      const restartFile = path.join(tmpDir, 'restart.txt');
      // ✅ Format: chatId|timestamp|prevUptime - For login.js BOX system
      fs.writeFileSync(restartFile, `${event.chat.id}|${Date.now()}|${prev}`);
      
      const fullName = event.from.first_name + (event.from.last_name? ' ' + event.from.last_name : '');
      
      const sentMsg = await message.reply(
`┏━━━━[ 𝗥𝗘𝗕𝗢𝗧𝗜𝗡𝗚 ]━━━━━┓
┃ 🔄 𝗥𝗘𝗦𝗧𝗔𝗥𝗧 𝗜𝗡𝗜𝗧𝗜𝗔𝗧𝗘𝗗
┣━━━━━━━━━━━━━━━━━━━━━
┃ 👑 By: ${fullName}
┃ ⏱️ Prev Uptime: ${prev}
┃ ⚙️ Status: Shutting down...
┗━━━━━━━━━━━━━━━━━━━━━━`
      );

      setTimeout(async () => {
        try {
          const msgId = sentMsg?.message_id;
          if (msgId) {
            if (ctx?.telegram) await ctx.telegram.deleteMessage(event.chat.id, msgId).catch(()=>{});
            else if (api?.telegram) await api.telegram.deleteMessage(event.chat.id, msgId).catch(()=>{});
            else if (api?.deleteMessage) await api.deleteMessage(event.chat.id, msgId).catch(()=>{});
          }
        } catch {}
      }, 1500);
      
      setTimeout(() => process.exit(2), 2000);
      
    } catch (err) {
      message.reply(`❌ Restart Error: ${err.message}`);
    }
  }
};