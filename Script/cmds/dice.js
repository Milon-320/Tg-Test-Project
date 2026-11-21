module.exports = {
  config: { name: "dice", aliases: ["roll"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Roll a dice", category: "fun", guide: "{prefix}dice [sides]" },
  BADOL: async function ({ message, args }) {
    let sides = parseInt(args[0], 10);
    if (!sides || sides < 2) sides = 6;
    if (sides > 1000) sides = 1000;
    const result = Math.floor(Math.random() * sides) + 1;
    await message.reply("Dice (1-" + sides + "): " + result);
  }
};
