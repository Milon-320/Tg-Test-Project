const QUOTES = [
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Code is like humor. When you have to explain it, it is bad. — Cory House",
  "First, solve the problem. Then, write the code. — John Johnson",
  "Experience is the name everyone gives to their mistakes. — Oscar Wilde",
  "Simplicity is the soul of efficiency. — Austin Freeman",
  "Make it work, make it right, make it fast. — Kent Beck",
  "Talk is cheap. Show me the code. — Linus Torvalds",
  "In the middle of difficulty lies opportunity. — Albert Einstein"
];
module.exports = {
  config: { name: "quote", aliases: ["quotes"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 3, description: "Random inspirational quote", category: "fun", guide: "{prefix}quote" },
  BADOL: async function ({ message }) {
    await message.reply(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }
};
