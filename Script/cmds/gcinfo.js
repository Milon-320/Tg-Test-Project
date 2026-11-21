const fs = require("fs");
const path = require("path");
const os = require("os");
const axios = require("axios");

module.exports = {
  config: {
    name: "gcinfo",
    aliases: ["groupinfo", "ginfo"],
    author: "Community",
    version: "8.4-PFP-FAST",
    cooldown: 5,
    role: 0,
    description: "Group info with profile photo + buttons (Optimized)",
    category: "utility",
    usePrefix: true
  },

  BADOL: async function ({ event, api, args, message, chatId, userId, ctx }) {
    if (!message.isGroup) return message.reply("❌ This command can only be used in groups.");
    try {
      try {
        await api.sendChatAction(chatId, "typing");
      } catch {}

      // একসঙ্গে প্যারাレルলি সব ডাটা ফেচ করা (স্পিড বাড়ানোর জন্য)
      const [chat, adminList, membersCount, thread] = await Promise.all([
        api.getChat(chatId),
        api.getChatAdministrators(chatId),
        api.getChatMembersCount(chatId),
        message.db.getThread(chatId)
      ]);

      const admins = adminList.filter((a) => !a.user.is_bot);
      const botAdmins = adminList.filter((a) => a.user.is_bot);
      const owners = adminList.filter((a) => a.status === "creator");
      const botIsAdmin = !!adminList.find((a) => a.user.id === ctx.botInfo?.id);

      let infoText = `📊 Group Information\n\n`;
      infoText += `📂 Name: ${chat.title}\n`;
      infoText += `🆔 Chat ID: ${chatId}\n`;
      infoText += `📝 Type: ${chat.type}\n`;
      infoText += `👥 Total Members: ${membersCount}\n`;
      infoText += `👨‍💼 Admins: ${admins.length}\n`;
      infoText += `🤖 Bot Admins: ${botAdmins.length}\n`;
      if (chat.username) infoText += `🔗 Username: @${chat.username}\n`;
      if (chat.description)
        infoText += `\n📄 Description:\n${chat.description.substring(0, 180)}${chat.description.length > 180 ? "..." : ""}\n`;
      infoText += `\n⚙️ Bot Settings:\n`;
      infoText += `🔐 Approval: ${thread.approvalMode ? "✅" : "❌"}\n`;
      infoText += `🤖 Auto-Approve: ${thread.autoApprove ? "✅" : "❌"}\n`;
      infoText += `🚪 Anti-Out: ${thread.antiOut ? "✅" : "❌"}\n`;
      infoText += `📍 Prefix: ${thread.customPrefix || global.config.prefix}\n`;
      infoText += `📨 Msgs: ${thread.totalMessages || 0}\n`;
      infoText += `🤖 Bot Admin: ${botIsAdmin ? "✅" : "❌"}\n`;
      if (owners.length > 0) {
        infoText += `\n👑 Owner:\n`;
        owners.forEach((o) => {
          infoText += ` • ${o.user.first_name}${o.user.username ? ` (@${o.user.username})` : ""}\n`;
        });
      }

      const keyboard = message.Markup.inlineKeyboard([
        [
          message.Markup.button.callback("👥 Show Admins", `show_admins_${chatId}`),
          message.Markup.button.callback("📊 Stats", `show_stats_${chatId}`),
        ],
        [message.Markup.button.callback("🔄 Refresh", `gcinfo_refresh_${chatId}`)],
      ]);

      let sentMsg = null;

      // 1) Fast path: send by Telegram file_id (no download)
      if (chat.photo?.big_file_id) {
        try {
          sentMsg = await api.sendPhoto(chatId, chat.photo.big_file_id, {
            caption: infoText,
            reply_markup: keyboard.reply_markup,
          });
        } catch (e) {
          console.log("gcinfo file_id photo fail:", e.message);
        }
      }

      // 2) Fallback: যদি ফটো ফাইল আইডি কাজ না করে শুধু তখনই টেক্সট মেসেজ পাঠাবে (ডাউনলোড প্রসেস স্কিপ করে স্পিড ফাস্ট করা হয়েছে)
      if (!sentMsg) {
        sentMsg = await api.sendMessage(chatId, infoText, {
          reply_markup: keyboard.reply_markup,
        });
      }

      try {
        const msgId = sentMsg?.message_id || sentMsg?.messageId || sentMsg?.message?.message_id;
        if (msgId) global.badol.onCallback.set(msgId, { commandName: "gcinfo", chatId });
        global.badol.onCallback.set(`show_admins_${chatId}`, { commandName: "gcinfo", chatId });
        global.badol.onCallback.set(`show_stats_${chatId}`, { commandName: "gcinfo", chatId });
        global.badol.onCallback.set(`gcinfo_refresh_${chatId}`, { commandName: "gcinfo", chatId });
        setTimeout(() => {
          try {
            global.badol.onCallback.delete(`show_admins_${chatId}`);
            global.badol.onCallback.delete(`show_stats_${chatId}`);
            global.badol.onCallback.delete(`gcinfo_refresh_${chatId}`);
            if (msgId) global.badol.onCallback.delete(msgId);
          } catch {}
        }, 300000);
      } catch {}

      return;
    } catch (err) {
      return message.reply(`❌ Error: ${err.message}`);
    }
  },

  onCallback: async function ({ event, api, message, ctx }) {
    await ctx.answerCbQuery().catch(() => {});

    const data = event.data;
    const m = data.match(/_(-?\d+)$/);
    if (!m) return;
    const chatId = m[1];
    const msg = ctx.callbackQuery.message;
    const chatIdNum = msg.chat.id;
    const msgId = msg.message_id;

    async function edit(newText, kb) {
      try {
        if (msg.photo || msg.caption !== undefined) {
          await ctx.telegram.editMessageCaption(chatIdNum, msgId, undefined, newText, {
            reply_markup: kb.reply_markup,
          });
        } else {
          await ctx.telegram.editMessageText(chatIdNum, msgId, undefined, newText, {
            reply_markup: kb.reply_markup,
          });
        }
      } catch (e) {
        try {
          await ctx.telegram.sendMessage(chatIdNum, newText, { reply_markup: kb.reply_markup });
        } catch {}
      }
    }

    if (data.startsWith("show_admins_")) {
      try {
        const adminList = await api.getChatAdministrators(chatId);
        const admins = adminList.filter((a) => !a.user.is_bot);
        let t = `👥 Admins (${admins.length})\n\n`;
        admins.forEach((a, i) => {
          t += `${i + 1}. ${a.user.first_name}${a.user.username ? ` (@${a.user.username})` : ""} — ${a.status}\n`;
        });
        const kb = message.Markup.inlineKeyboard([
          [message.Markup.button.callback("« Back", `gcinfo_refresh_${chatId}`)],
        ]);
        await edit(t, kb);
      } catch (e) {
        console.log("show_admins error:", e.message);
      }
    }

    if (data.startsWith("show_stats_")) {
      try {
        const thread = await message.db.getThread(chatId);
        const msgs = thread.userMessages || {};
        const sorted = Object.entries(msgs)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10);
        let t = `📊 Stats\n\n📨 Total: ${thread.totalMessages || 0}\n👥 Active: ${Object.keys(msgs).length}\n\n🏆 Top 10:\n`;
        for (let i = 0; i < sorted.length; i++) {
          const [uid, c] = sorted[i];
          try {
            const u = await message.db.getUser(uid);
            t += `${i + 1}. ${u.name || u.firstName || "Unknown"}: ${c} msgs\n`;
          } catch {
            t += `${i +1}. ${uid}: ${c} msgs\n`;
          }
        }
        const kb = message.Markup.inlineKeyboard([
          [message.Markup.button.callback("« Back", `gcinfo_refresh_${chatId}`)],
        ]);
        await edit(t, kb);
      } catch (e) {
        console.log("show_stats error:", e.message);
      }
    }

    if (data.startsWith("gcinfo_refresh_")) {
      try {
        const [chat, adminList, membersCount, thread] = await Promise.all([
          api.getChat(chatId),
          api.getChatAdministrators(chatId),
          api.getChatMembersCount(chatId),
          message.db.getThread(chatId)
        ]);

        const admins = adminList.filter((a) => !a.user.is_bot);
        const botAdmins = adminList.filter((a) => a.user.is_bot);
        const owners = adminList.filter((a) => a.status === "creator");
        const botIsAdmin = !!adminList.find((a) => a.user.id === ctx.botInfo?.id);

        let infoText = `📊 Group Information\n\n📂 Name: ${chat.title}\n🆔 Chat ID: ${chatId}\n📝 Type: ${chat.type}\n👥 Total Members: ${membersCount}\n👨‍💼 Admins: ${admins.length}\n🤖 Bot Admins: ${botAdmins.length}\n`;
        if (chat.username) infoText += `🔗 Username: @${chat.username}\n`;
        if (chat.description)
          infoText += `\n📄 Description:\n${chat.description.substring(0, 180)}${chat.description.length > 180 ? "..." : ""}\n`;
        infoText += `\n⚙️ Bot Settings:\n🔐 Approval: ${thread.approvalMode ? "✅" : "❌"}\n🤖 Auto-Approve: ${thread.autoApprove ? "✅" : "❌"}\n🚪 Anti-Out: ${thread.antiOut ? "✅" : "❌"}\n📍 Prefix: ${thread.customPrefix || global.config.prefix}\n📨 Msgs: ${thread.totalMessages || 0}\n🤖 Bot Admin: ${botIsAdmin ? "✅" : "❌"}\n`;
        if (owners.length > 0) {
          infoText += `\n👑 Owner:\n`;
          owners.forEach((o) => {
            infoText += ` • ${o.user.first_name}${o.user.username ? ` (@${o.user.username})` : ""}\n`;
          });
        }

        const kb = message.Markup.inlineKeyboard([
          [
            message.Markup.button.callback("👥 Show Admins", `show_admins_${chatId}`),
            message.Markup.button.callback("📊 Stats", `show_stats_${chatId}`),
          ],
          [message.Markup.button.callback("🔄 Refresh", `gcinfo_refresh_${chatId}`)],
        ]);
        await edit(infoText, kb);
      } catch (e) {
        console.log("refresh error:", e.message);
      }
    }
  },
};
