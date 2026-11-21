module.exports = {
  config: { name: "hex", aliases: ["tohex"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Convert text to hex", category: "utility", guide: "{prefix}hex [text]" },
  BADOL: async function ({ message, args }) {
    const text = args.join(" ").trim();
    if (!text) return message.reply("Usage: /hex [text]");
    if (text.length > 300) return message.reply("Text is too long (max 300 characters).");
    await message.reply(Buffer.from(text, "utf8").toString("hex"));
  }
};
