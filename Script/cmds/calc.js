module.exports = {
  config: { name: "calc", aliases: ["calculate", "math"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Simple calculator", category: "utility", guide: "{prefix}calc 2+2*3" },
  BADOL: async function ({ message, args }) {
    const expr = args.join("").replace(/\s+/g, "");
    if (!expr) return message.reply("Usage: /calc 2+2*3");
    if (!/^[0-9+\-*/().%]+$/.test(expr)) return message.reply("Only numbers and + - * / ( ) % are allowed.");
    try {
      const result = Function('"use strict"; return (' + expr + ");")();
      if (typeof result !== "number" || !isFinite(result)) return message.reply("Invalid calculation.");
      await message.reply("Result: " + result);
    } catch {
      await message.reply("Could not calculate that expression.");
    }
  }
};
