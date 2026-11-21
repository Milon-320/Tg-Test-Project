module.exports = {
  config: { name: "reverse", aliases: ["rev"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Reverse text", category: "utility", guide: "{prefix}reverse [text]" },
  BADOL: async function ({ message, args }) {
    const text = args.join(" ").trim();
    if (!text) return message.reply("Usage: /reverse [text]");
    await message.reply(text.split("").reverse().join(""));
  }
};
