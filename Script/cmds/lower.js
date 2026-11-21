module.exports = {
  config: { name: "lower", aliases: ["tolower", "lowercase"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Convert text to lowercase", category: "utility", guide: "{prefix}lower [text]" },
  BADOL: async function ({ message, args }) {
    const text = args.join(" ").trim();
    if (!text) return message.reply("Usage: /lower [text]");
    await message.reply(text.toLowerCase());
  }
};
