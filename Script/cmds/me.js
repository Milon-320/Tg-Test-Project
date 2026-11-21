module.exports = {
  config: { name: "me", aliases: ["whoami"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 3, description: "Show your Telegram info", category: "info", guide: "{prefix}me" },
  BADOL: async function ({ message, event, userId }) {
    const u = event.from || {};
    const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "Unknown";
    const uname = u.username ? "@" + u.username : "N/A";
    await message.reply("Your profile\nName: " + name + "\nUsername: " + uname + "\nID: " + userId + "\nLanguage: " + (u.language_code || "N/A"));
  }
};
