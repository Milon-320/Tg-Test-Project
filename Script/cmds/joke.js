const JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "There are only 10 kinds of people: those who understand binary and those who do not.",
  "A SQL query walks into a bar, walks up to two tables and asks: Can I join you?",
  "Why did the developer go broke? Because he used up all his cache.",
  "I would tell you a UDP joke, but you might not get it.",
  "How many programmers does it take to change a light bulb? None, that is a hardware problem.",
  "Why do Java developers wear glasses? Because they cannot C#.",
  "Debugging: Being the detective in a crime movie where you are also the murderer."
];
module.exports = {
  config: { name: "joke", aliases: ["jokes"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 3, description: "Random programming joke", category: "fun", guide: "{prefix}joke" },
  BADOL: async function ({ message }) {
    await message.reply(JOKES[Math.floor(Math.random() * JOKES.length)]);
  }
};
