// ✅ ESB-BOT - RULES - FINAL ENGLISH + BANGLA RULES

module.exports = {
  config: {
    name: "rules",
    version: "4.4-ENGLISH-INFO",
    author: "MOHAMMAD BADOL",
    cooldown: 5,
    role: 0,
    prefix: true,
    aliases: ["rulse", "rule", "niyom"],
    description: "Bot Rules - Auto System",
    category: "info",
    usage: "/rules"
  },

  BADOL: async function({ api, chatId, message, userId, event, ctx }) {
    const chat = event?.chat || message?.chat || ctx?.chat;
    const from = event?.from || message?.from || ctx?.from;

    const botName = global.config.botInfo?.name || "ESB-BOT";
    const prefix = global.config.prefix || "/";
    const version = global.config.botInfo?.version || "4.0 Premium";
    const ownerMain = global.config.ownerInfo?.main || "ESB-TEAM";
    const ownerId = global.config.adminUID?.[0] || "6954597258";

    const GROUP_NAME = "ESB PUBLIC GROUP";
    const GROUP_LINK = "https://t.me/ESB_TEAM_1";
    const CHANNEL_NAME = "ESB-TEAM";
    const CHANNEL_LINK = "https://t.me/ESB_TEAM";

    const chatTitle = chat?.title || "Private Chat";
    const fullName = ((from?.first_name||"")+" "+(from?.last_name||"")).trim() || "User";
    const userID = from?.id || userId;
    const bdDate = new Date().toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka' });
    const bdTime = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: true });
    const year = new Date().getFullYear();

    const rulesMessage = `
╔════════════════════════╗
     🛡️ ${botName} RULES 🛡️
╚════════════════════════╝

👋 Hello, ${fullName}!
👤 Name: ${fullName}
🆔 ID: ${userID}
✨ Chat: ${chatTitle}
📅 ${bdDate} | ⏰ ${bdTime}

━━━━━━━━━━━━━━━━━━━━━━
📜 GENERAL RULES
━━━━━━━━━━━━━━━━━━━━━━
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ ❶ No Spamming
┃ ➥ কমান্ড দিয়ে ফ্লাডিং
┃ করবেন না, 5s বিরতি দিন।
┃
┃ ❷ No Bad Words
┃ ➥ গালিগালাজ বা অশালীন
┃ ভাষা সম্পূর্ণ নিষিদ্ধ।
┃
┃ ❸ Anti-Link
┃ ➥ অনুমতি ছাড়া লিংক
┃ শেয়ার করা যাবে না।
┃
┃ ❹ Respect Everyone
┃ ➥ এডমিন ও মেম্বারদের
┃ সম্মান করুন।
┃
┃ ❺ No 18+ Content
┃ ➥ অশ্লীল ছবি/ভিডিও
┃ শেয়ার করা নিষিদ্ধ।
┗━━━━━━━━━━━━━━━━━━━━━━┛

━━━━━━━━━━━━━━━━━━━━━━
⚙️ BOT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━
🔹 Name: ${botName}
🔹 Prefix: [ ${prefix} ]
🔹 Command: ${prefix}help
🔹 Credit: ${ownerMain}
🔹 Version: ${version}

━━━━━━━━━━━━━━━━━━━━━━
⚠️ PUNISHMENT SYSTEM
━━━━━━━━━━━━━━━━━━━━━━
⚠️ 1st Time - Warning
🔇 2nd Time - Mute
🚫 3rd Time - Permanent Ban

"Keep the environment clean"
━━━━━━━━━━━━━━━━━━━━━━
© ${year} ${botName} | ${CHANNEL_NAME}`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: "👨‍💻 Owner", url: `tg://user?id=${ownerId}` },
          { text: "📜 Help Menu", callback_data: "bb_help" }
        ],
        [
          { text: `👥 ${GROUP_NAME}`, url: GROUP_LINK },
          { text: `📢 ${CHANNEL_NAME}`, url: CHANNEL_LINK }
        ]
      ]
    };

    return await api.sendMessage(chatId, rulesMessage, {
      reply_to_message_id: message?.message_id,
      reply_markup: keyboard
    });
  }
};