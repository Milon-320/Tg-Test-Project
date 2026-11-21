module.exports = {
  config: { name: "upper", aliases: ["toupper", "uppercase"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Convert text to UPPERCASE", category: "utility", guide: "{prefix}upper [text]" },
  BADOL: async function ({ message, args }) {
    const text = args.join(" ").trim();
    if (!text) return message.reply("Usage: /upper [text]");
    await message.reply(text.toUpperCase());
  }
};
