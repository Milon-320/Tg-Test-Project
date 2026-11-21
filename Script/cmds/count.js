module.exports = {
  config: { name: "count", aliases: ["wordcount"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Count lines, words and characters", category: "utility", guide: "{prefix}count [text]" },
  BADOL: async function ({ message, args }) {
    const text = args.join(" ");
    if (!text) return message.reply("Usage: /count [text]");
    const lines = text.split(/\n/).length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    await message.reply("Lines: " + lines + "\nWords: " + words + "\nCharacters: " + text.length);
  }
};
