module.exports = {
  config: { name: "random", aliases: ["rand", "rnd"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Random number", category: "fun", guide: "{prefix}random [min] [max]" },
  BADOL: async function ({ message, args }) {
    let min = parseInt(args[0], 10);
    let max = parseInt(args[1], 10);
    if (isNaN(min)) min = 1;
    if (isNaN(max)) max = 100;
    if (min > max) { const t = min; min = max; max = t; }
    const n = Math.floor(Math.random() * (max - min + 1)) + min;
    await message.reply("Random (" + min + "-" + max + "): " + n);
  }
};
