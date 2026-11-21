module.exports = {
  config: { name: "echo", aliases: ["saytext", "repeat"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Repeat your message", category: "utility", guide: "{prefix}echo [text]" },
  BADOL: async function ({ message, args }) {
    const text = args.join(" ").trim();
    if (!text) return message.reply("Usage: /echo [text]");
    await message.reply(text);
  }
};
