// Path: Scripts/CMDS/cmds/alldown.js
const { alldown } = require('nayan-media-downloaders');
const axios = require('axios');

module.exports = {
  config: {
    name: "autodl",
    aliases: ["autoMediaDownloader", "alldown", "dl", "down"],
    author: "Community",
    version: "3.3 RENDER FIXED",
    description: "Auto social media downloader for all platforms",
    category: "downloader",
    usePrefix: false,
    cooldown: 3,
    role: 0
  },

  BADOL: async function ({ event, api, args, message }) {
    const text = args.join(" ").trim();
    if (!text) return;
    return this.onChat({ bot: api, msg: event, chatId: event.chat.id, api });
  },

  onChat: async function ({ bot, msg, chatId, api }) {
    try {
      const text = msg.text || msg.caption || "";
      if (!text || !text.includes("http")) return;
      if (msg.from?.is_bot) return;

      const supported = [
        "facebook.com", "fb.watch", "fb.me", "fb.share",
        "instagram.com", "instagr.am", "reel",
        "tiktok.com",
        "youtube.com", "youtu.be",
        "pinterest.com", "pin.it",
        "twitter.com", "x.com"
      ];

      const lowerText = text.toLowerCase();
      if (!supported.some(d => lowerText.includes(d))) return;

      const tg = bot || api;

      const waitMsg = await tg.sendMessage(chatId, "⏳ `Downloading...`", {
        reply_to_message_id: msg.message_id,
        parse_mode: "Markdown"
      }).catch(() => {});

      try {
        const urlMatch = text.match(/https?:\/\/[^\s]+/);
        let videoLink = urlMatch ? urlMatch[0] : text.trim();
        videoLink = videoLink.replace(/[.,;!?]$/, "");

        const res = await alldown(videoLink);
        const videoUrl = res?.data?.high || res?.data?.low || res?.data?.video || res?.data?.url || res?.result;
        const title = res?.data?.title || res?.title || "No Title Found";

        if (!videoUrl) throw new Error("No URL Found");

        // ===== SHORT BOX DESIGN =====
        const cleanTitle = String(title).slice(0, 40).replace(/[<>]/g, '');
        const caption =
`╭───⦿ 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗗 ⦿───╮
│
├─🎬 𝗧𝗶𝘁𝗹𝗲: ${cleanTitle}
│
├─🤖 𝗕𝗢𝗧: MCS HELP BOT
├─👑 𝗗𝗘𝗩: MCS TEAM
│
╰─────────────────⦿`;

        const replyMarkup = {
          inline_keyboard: [
            [
              { text: '👑 TEAM', url: 'https://t.me/ESB_TEAM' },
              { text: '💸 TEAM', url: 'https://t.me/SB_PREMIUM_ZONE' }
            ],
            [
              { text: '📥 Direct Download Link', url: videoUrl }
            ]
          ]
        };

        // রেন্ডার সার্ভারের জন্য টেলিগ্রামে সরাসরি ভিডিও লিংক বা ছোট বাফার পাঠানো নিরাপদ
        try {
          await tg.sendVideo(chatId, videoUrl, {
            caption: caption,
            parse_mode: "Markdown",
            reply_to_message_id: msg.message_id,
            reply_markup: replyMarkup
          });
        } catch (errVideo) {
          // যদি sendVideo ডাইরেক্ট লিংকে কাজ না করে, তবে axios দিয়ে বাফার ফেচ করে ট্রাই করবে (টাইমআউট সহ)
          const videoResponse = await axios.get(videoUrl, {
            responseType: "arraybuffer",
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          await tg.sendVideo(chatId, { source: Buffer.from(videoResponse.data) }, {
            caption: caption,
            parse_mode: "Markdown",
            reply_to_message_id: msg.message_id,
            reply_markup: replyMarkup
          });
        }

        if (waitMsg) await tg.deleteMessage(chatId, waitMsg.message_id).catch(() => {});
      } catch (e) {
        console.error("AutoDown Error:", e.message);
        if (waitMsg) {
          await tg.editMessageText("❌ Failed to download! Link might be private, too large, or unsupported.", {
            chat_id: chatId,
            message_id: waitMsg.message_id
          }).catch(() => {});
        }
      }
    } catch (err) {
      // সাইলেন্ট আউটার ক্যাচ
    }
  }
};
