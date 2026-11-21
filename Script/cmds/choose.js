module.exports = {
  config: { name: "choose", aliases: ["pick", "select"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Pick one option randomly", category: "fun", guide: "{prefix}choose a | b | c" },
  BADOL: async function ({ message, args }) {
    const raw = args.join(" ").trim();
    if (!raw) return message.reply("Usage: /choose option1 | option2 | option3");
    const parts = raw.split("|").map(s => s.trim()).filter(Boolean);
    if (parts.length < 2) return message.reply("Please provide at least 2 options separated by |");
    await message.reply("I choose: " + parts[Math.floor(Math.random() * parts.length)]);
  }
};
