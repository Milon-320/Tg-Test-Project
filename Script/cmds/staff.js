module.exports = {
  config: { name: "staff", aliases: ["admins", "adminlist"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 5, description: "List group administrators", category: "info", guide: "{prefix}staff" },
  BADOL: async function ({ message, api, chatId, event }) {
    if (!event.chat || (event.chat.type !== "group" && event.chat.type !== "supergroup")) {
      return message.reply("This command only works in groups.");
    }
    try {
      const admins = await api.getChatAdministrators(chatId);
      if (!admins || !admins.length) return message.reply("No administrators found.");
      const lines = admins.slice(0, 30).map((a, i) => {
        const u = a.user || {};
        const name = [u.first_name, u.last_name].filter(Boolean).join(" ") || "User";
        const uname = u.username ? "@" + u.username : String(u.id);
        const rank = a.status === "creator" ? "Creator" : "Admin";
        return (i + 1) + ". " + name + " (" + uname + ") — " + rank;
      });
      await message.reply("Group staff (" + admins.length + ")\n\n" + lines.join("\n"));
    } catch (e) {
      await message.reply("Failed to fetch admins. Make sure the bot is in the group.");
    }
  }
};
