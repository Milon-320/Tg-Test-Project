module.exports = {
  config: {
    name: "kick",
    aliases: ["kickout"],
    author: "Community",
    version: "3.1-FIXED",
    cooldown: 5,
    role: 1,
    description: "Kick a user (Reply/UID/Mention)",
    category: "admin",
    usePrefix: true
  },

  BADOL: async ({ event, api, message, args, chatId }) => {
    try {
      const chatType = event.chat.type;
      if (chatType !== "group" && chatType !== "supergroup") {
        return message.reply("⚠️ গ্রুপে ইউজ করুন!");
      }

      let targetUserId = null;
      let targetUserName = "User";

      // 1️⃣ REPLY থেকে (BEST WAY - 100% কাজ করবে)
      if (event.reply_to_message?.from) {
        targetUserId = event.reply_to_message.from.id;
        targetUserName = event.reply_to_message.from.first_name;
      }

      // 2️⃣ TEXT_MENTION থেকে (Clickable Mention - নীল নামে মেনশন)
      else if (event.entities) {
        const textMention = event.entities.find(e => e.type === "text_mention" && e.user);
        if (textMention) {
          targetUserId = textMention.user.id;
          targetUserName = textMention.user.first_name;
        }
      }

      // 3️⃣ ARGS থেকে - UID / @username
      if (!targetUserId && args[0]) {
        let raw = args[0].trim();

        // @ বাদ দাও
        if (raw.startsWith('@')) raw = raw.slice(1);

        // যদি নাম্বার UID হয়
        if (/^\d+$/.test(raw)) {
          targetUserId = Number(raw);
          targetUserName = `User ${raw}`;
          try {
            const m = await api.getChatMember(chatId, targetUserId);
            targetUserName = m.user.first_name;
          } catch {}
        } else {
          // Username দিয়ে DB তে খোঁজো (Global Database integration)
          try {
            const allUsers = typeof global.db?.getAllUsers === 'function' ? await global.db.getAllUsers() : [];
            const found = allUsers.find(u => 
              (u.username && u.username.toLowerCase() === raw.toLowerCase()) || 
              (u.name && u.name.toLowerCase() === raw.toLowerCase())
            );
            if (found) {
              targetUserId = Number(found.uid || found.userId || found.id);
              targetUserName = found.name || found.firstName || raw;
            } else {
              // Fallback to Telegram getChat API if not in DB
              try {
                const chatInfo = await api.getChat('@' + raw);
                if (chatInfo?.id) {
                  targetUserId = Number(chatInfo.id);
                  targetUserName = chatInfo.first_name || chatInfo.title || raw;
                }
              } catch {}
            }
          } catch {}

          if (!targetUserId) {
            return message.reply(
              `❌ @${raw} এর ID পাওয়া যায়নি!\n\n` +
              `✅ সঠিক উপায়:\n` +
              `1️⃣ তার মেসেজে Reply দিয়ে /kick লিখো (100% কাজ করবে)\n` +
              `2️⃣ তার UID দিয়ে /kick 123456789\n` +
              `3️⃣ ইউজারটি পূর্বে চ্যাট বা মেসেজ করে থাকলে @username ও কাজ করবে।`
            );
          }
        }
      }

      if (!targetUserId) {
        return message.reply(
          `⚠️ কাকে কিক করবে?\n\n` +
          `1️⃣ Reply: /kick (রিপ্লাই দিয়ে)\n` +
          `2️⃣ UID: /kick 123456789\n` +
          `3️⃣ Clickable Mention দিয়ে`
        );
      }

      // নিজেকে / বট / গ্লোবাল এডমিন কিক না
      if (global.config?.adminUID && global.config.adminUID.includes(String(targetUserId))) return message.reply("⚠️ Bot Admin কে কিক করা যাবে না!");
      if (targetUserId === event.from.id) return message.reply("⚠️ নিজেকে কিক করা যাবে না!");
      if (targetUserId === (await api.getMe()).id) return message.reply("⚠️ আমাকে কিক করা যাবে না!");

      // Bot permission check
      const botMember = await api.getChatMember(chatId, (await api.getMe()).id);
      if (botMember.status !== "administrator" && botMember.status !== "creator") return message.reply("⚠️ আমাকে Admin বানাও!");
      if (!botMember.can_restrict_members) return message.reply("⚠️ আমার Ban Users পারমিশন নাই!");

      // Target admin check
      try {
        const targetMember = await api.getChatMember(chatId, targetUserId);
        if (["administrator", "creator"].includes(targetMember.status)) {
          return message.reply("⚠️ গ্রুপ এডমিনকে কিক করা যাবে না!");
        }
        if (targetMember.user?.first_name) {
          targetUserName = targetMember.user.first_name;
        }
      } catch {}

      // Kick = Ban + Unban (5 sec)
      const untilDate = Math.floor(Date.now() / 1000) + 5;
      await api.banChatMember(chatId, targetUserId, { until_date: untilDate });
      // ২ সেকেন্ড পর আনব্যান যাতে আবার জয়েন করতে পারে
      setTimeout(async () => {
        try { await api.unbanChatMember(chatId, targetUserId); } catch {}
      }, 6000);

      await message.reply(
        `✅ Kicked ${targetUserName}!\n` +
        `🆔 ID: \`${targetUserId}\`\n` +
        `👮 By: ${event.from.first_name}`,
        { parse_mode: "Markdown" }
      );

    } catch (error) {
      console.error("Kick error:", error);
      await message.reply(`❌ Kick হয়নি: ${error.message}`);
    }
  }
};
