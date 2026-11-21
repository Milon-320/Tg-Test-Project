module.exports = {
  config: { name: "binary", aliases: ["bin"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Convert text to binary", category: "utility", guide: "{prefix}binary [text]" },
  BADOL: async function ({ message, args }) {
    const text = args.join(" ").trim();
    if (!text) return message.reply("Usage: /binary [text]");
    if (text.length > 200) return message.reply("Text is too long (max 200 characters).");
    const out = text.split("").map(c => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ");
    await message.reply(out);
  }
};
