module.exports = {
  config: { name: "love", aliases: ["lovecalc", "ship"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 3, description: "Fun love percentage calculator", category: "fun", guide: "{prefix}love name1 | name2" },
  BADOL: async function ({ message, args }) {
    const raw = args.join(" ").trim();
    if (!raw) return message.reply("Usage: /love name1 | name2");
    let a, b;
    if (raw.includes("|")) {
      const p = raw.split("|").map(s => s.trim());
      a = p[0]; b = p[1];
    } else {
      const p = raw.split(/\s+/);
      if (p.length < 2) return message.reply("Usage: /love name1 | name2");
      a = p[0]; b = p.slice(1).join(" ");
    }
    if (!a || !b) return message.reply("Usage: /love name1 | name2");
    const seed = (a + b).toLowerCase().split("").reduce((s, c) => s + c.charCodeAt(0), 0);
    await message.reply("Love meter\n" + a + " + " + b + "\n" + (seed % 101) + "%");
  }
};
