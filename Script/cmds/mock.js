module.exports = {
  config: { name: "mock", aliases: ["mocktext"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "mOcK tExT sTyLe", category: "fun", guide: "{prefix}mock [text]" },
  BADOL: async function ({ message, args }) {
    const text = args.join(" ").trim();
    if (!text) return message.reply("Usage: /mock [text]");
    let out = "";
    for (let i = 0; i < text.length; i++) out += i % 2 === 0 ? text[i].toLowerCase() : text[i].toUpperCase();
    await message.reply(out);
  }
};
