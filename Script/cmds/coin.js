module.exports = {
  config: { name: "coin", aliases: ["flip", "coinflip"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Flip a coin", category: "fun", guide: "{prefix}coin" },
  BADOL: async function ({ message }) {
    await message.reply("Coin flip: " + (Math.random() < 0.5 ? "Heads" : "Tails"));
  }
};
