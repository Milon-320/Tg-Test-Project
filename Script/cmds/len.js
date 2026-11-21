module.exports = {
  config: { name: "len", aliases: ["length", "strlen"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Count characters and words", category: "utility", guide: "{prefix}len [text]" },
  BADOL: async function ({ message, args }) {
    const text = args.join(" ");
    if (!text) return message.reply("Usage: /len [text]");
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    await message.reply("Characters: " + text.length + "\nWords: " + words);
  }
};
