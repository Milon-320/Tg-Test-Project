module.exports = {
  config: { name: "chatid", aliases: ["cid"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Show current chat ID", category: "info", guide: "{prefix}chatid" },
  BADOL: async function ({ message, chatId, event }) {
    const type = event.chat?.type || "unknown";
    const title = event.chat?.title || event.chat?.first_name || "Private";
    await message.reply("Chat: " + title + "\nType: " + type + "\nID: " + chatId);
  }
};
