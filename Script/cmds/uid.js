module.exports = {
  config: {
    name: "uid",
    aliases: [],
    author: "MOHAMMAD BADOL",
    version: "2.0",
    cooldown: 3,
    role: 0,
    description: "Get Telegram user ID (self, reply, or mention)",
    category: "utility",
    usePrefix: true
  },

  BADOL: async ({ event, message, args, api }) => {
    try {
      let targetUser = null;
      let userId = null;

      // 🔹 1. If reply to a message
      if (event.reply_to_message && event.reply_to_message.from) {
        targetUser = event.reply_to_message.from;
        userId = targetUser.id;
      }
      // 🔹 2. If username/mention is provided (e.g., /uid @HASAN)
      else if (args && args.length > 0) {
        let query = args[0].replace("@", "").toLowerCase();
        
        // Fetch users from your bot's global database
        const users = typeof global.db?.getAllUsers === 'function' ? await global.db.getAllUsers() : [];
        const foundUser = users.find(u => 
          (u.username && u.username.toLowerCase() === query) || 
          (u.name && u.name.toLowerCase() === query)
        );

        if (foundUser) {
          userId = foundUser.uid || foundUser.id;
          targetUser = {
            first_name: foundUser.name || foundUser.first_name || "User",
            id: userId
          };
        } else {
          return await message.reply(`❌ Sorry, @${query} was not found in database.`);
        }
      }
      // 🔹 3. Otherwise, show own UID
      else {
        targetUser = event.from;
        userId = targetUser.id;
      }

      // 🧩 Build mention
      const mentionText = `[${targetUser.first_name || "User"}](tg://user?id=${userId})`;

      // 💬 Send message with UID
      await message.reply(
        `👤 ${mentionText}\n🆔 \`${userId}\``,
        { parse_mode: "Markdown" }
      );

    } catch (error) {
      console.error("Error in uid command:", error);
      await message.reply(`❌ Error: ${error.message}`);
    }
  }
};
