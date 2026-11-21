
module.exports = {
  config: {
    name: "start",
    aliases: ["s"],
    version: "2.1.0",
    author: "Community",
    role: 0,
    cooldown: 2,
    description: "Bot welcome",
    category: "system",
    usePrefix: false
  },
  BADOL: async function ({ event, api, chatId, message }) {
    try {
      const isGroup = event.chat?.type === "group" || event.chat?.type === "supergroup";
      const botInfo = await api.getMe().catch(() => null);
      const uname = botInfo?.username || global.botUsername || "esbbot";
      const text = isGroup
        ? `🛡️ <b>ESB BOT</b>\n\nGroup protection & tools ready.\nType /help for commands.`
        : `🛡️ <b>ESB BOT</b>\n\nWelcome! Add me to your group for moderation tools.\nType /help for all commands.`;
      const reply_markup = isGroup ? undefined : {
        inline_keyboard: [[{ text: "➕ Add to Group", url: `https://t.me/${uname}?startgroup=true` }]]
      };
      await api.sendMessage(chatId, text, { parse_mode: "HTML", reply_markup });
    } catch (e) {
      try { await message.reply("ESB BOT is online! Type /help"); } catch {}
    }
  }
};
