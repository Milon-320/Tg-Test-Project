module.exports = {
  config: { name: "password", aliases: ["passgen", "genpass"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 3, description: "Generate a random password", category: "utility", guide: "{prefix}password [length]" },
  BADOL: async function ({ message, args }) {
    let len = parseInt(args[0], 10);
    if (!len || len < 6) len = 12;
    if (len > 64) len = 64;
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let out = "";
    for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
    await message.reply("Generated password (" + len + "):\n`" + out + "`");
  }
};
