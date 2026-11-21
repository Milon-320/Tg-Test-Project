module.exports = {
  config: { name: "rate", aliases: ["ratesomething"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Rate something out of 10", category: "fun", guide: "{prefix}rate [text]" },
  BADOL: async function ({ message, args }) {
    const text = args.join(" ").trim() || "this";
    const seed = text.toLowerCase().split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    await message.reply('I rate "' + text + '" : ' + ((seed % 10) + 1) + "/10");
  }
};
