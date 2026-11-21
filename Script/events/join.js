const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { createCanvas, loadImage } = require("canvas");

const BG_URL = "https://drive.google.com/uc?export=download&id=1vQ8YcgfR0Hi1ov5e8Eh56qU5-eQz3RWN";
const BOT_WELCOME_PHOTO = "https://drive.google.com/uc?export=download&id=1V4_WqqA85nR3mUbjz0gfW2xvEuV8Rabm";
const CACHE_DIR = path.join(__dirname, "../../data/BADOL/cache/welcome");

const FIXED_BOT_NAME = "ESB-BOT";
const FIXED_OWNER_NAME = "ESB TEAM";
const FIXED_PREFIX = "/";

const WELCOME_BUTTONS = {
  inline_keyboard: [
    [{ text: "👑 Contact Owner", url: "https://t.me/B4D9L_007" }],
    [{ text: "📢 Support Group", url: "https://t.me/ESB_TEAM_1" }]
  ]
};

function ensureCache() {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  } catch {}
}

async function getAvatarUrl(tg, userId) {
  try {
    const photos = await tg.getUserProfilePhotos(userId, { limit: 1 });
    if (photos && photos.total_count > 0) {
      const fileId = photos.photos[0].at(-1).file_id;
      try {
        const link = await tg.getFileLink(fileId);
        return link.href || link;
      } catch {
        const file = await tg.getFile(fileId);
        return `https://api.telegram.org/file/bot${tg.token}/${file.file_path}`;
      }
    }
  } catch {}
  return null;
}

async function createBanner(data) {
  ensureCache();
  const width = 1416, height = 856;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  try {
    const bgPath = path.join(CACHE_DIR, "welcome_bg.jpg");
    if (!fs.existsSync(bgPath)) {
      const res = await axios({ url: BG_URL, method: "GET", responseType: "arraybuffer", timeout: 15000 });
      fs.writeFileSync(bgPath, Buffer.from(res.data));
    }
    const bg = await loadImage(bgPath);
    ctx.drawImage(bg, 0, 0, width, height);
  } catch {
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, "#0b1528");
    g.addColorStop(1, "#111827");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
  }

  const userX = 260, userY = 320, userSize = 145;
  const groupX = 708, groupY = 340, groupSize = 130;
  const adderX = 1150, adderY = 320, adderSize = 145;
  const labelY = 520, labelW = 220, labelH = 75;

  async function loadCircleImage(url, x, y, size, glow) {
    if (!url) return;
    try {
      const res = await axios.get(url, { responseType: "arraybuffer", timeout: 8000 });
      const img = await loadImage(Buffer.from(res.data));
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, x - size - 15, y - size - 15, (size + 15) * 2, (size + 15) * 2);
      ctx.restore();
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, size + 4, 0, Math.PI * 2);
      ctx.strokeStyle = glow;
      ctx.lineWidth = 9;
      ctx.shadowColor = glow;
      ctx.shadowBlur = 35;
      ctx.stroke();
      ctx.restore();
    } catch {}
  }

  await loadCircleImage(data.avatarUrl, userX, userY, userSize, "#00F5FF");
  await loadCircleImage(data.groupImage, groupX, groupY, groupSize, "#A020F0");
  await loadCircleImage(data.adderAvatar, adderX, adderY, adderSize, "#00FF88");

  function drawLabel(x, y, title, name) {
    const n = String(name || "Unknown");
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(x - labelW / 2, y, labelW, labelH);
    ctx.strokeStyle = "#00eaff";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - labelW / 2, y, labelW, labelH);
    ctx.restore();
    ctx.textAlign = "center";
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 15;
    ctx.fillStyle = "#00eaff";
    ctx.font = "bold 20px Arial";
    ctx.fillText(title, x, y + 22);
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px Arial";
    ctx.fillText((n.length > 14 ? n.substring(0, 14) + ".." : n).toUpperCase(), x, y + 50);
  }

  drawLabel(userX, labelY, "NEW USER", data.name);
  drawLabel(groupX, labelY, "GROUP", data.groupName);
  drawLabel(adderX, labelY, "ADDED BY", data.adderName);

  ctx.textAlign = "center";
  ctx.shadowColor = "#00ffff";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#fff";
  ctx.font = "bold 64px Arial";
  ctx.fillText("WELCOME", width / 2, 110);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#00eaff";
  ctx.font = "bold 28px Arial";
  ctx.fillText("THANKS FOR JOINING", width / 2, 170);

  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.lineTo(width, 10);
  ctx.strokeStyle = "#00E5FF";
  ctx.lineWidth = 5;
  ctx.shadowColor = "#00E5FF";
  ctx.shadowBlur = 25;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, height - 10);
  ctx.lineTo(width, height - 10);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 22px Arial";
  ctx.fillText(`ESB-BOT • Total: ${data.member || 0} Members`, width / 2, height - 25);

  // JPEG = smaller, no socket hang on Render
  return canvas.toBuffer("image/jpeg", { quality: 0.65 });
}

async function sendPhotoBuffer(tg, chatId, buffer, caption, reply_markup) {
  const token = tg.token || global.config?.botInfo?.token || global.config?.token;
  try {
    const form = new FormData();
    form.append("chat_id", String(chatId));
    if (caption) form.append("caption", caption);
    form.append("photo", buffer, { filename: "welcome.jpg", contentType: "image/jpeg" });
    if (reply_markup) form.append("reply_markup", JSON.stringify(reply_markup));
    await axios.post(`https://api.telegram.org/bot${token}/sendPhoto`, form, {
      headers: form.getHeaders(),
      timeout: 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    return true;
  } catch (e) {
    try {
      await tg.sendPhoto(chatId, { source: buffer }, { caption, reply_markup });
      return true;
    } catch (e2) {
      console.log("[JOIN] photo fail:", e.message || e2.message);
      return false;
    }
  }
}

module.exports = {
  config: {
    name: "welcome",
    author: "MOHAMMAD BADOL",
    version: "5.0-CANVAS-FIX",
    description: "Welcome new members with canvas (JPEG buffer, Render-safe)",
    eventType: "new_member"
  },

  BADOL: async function ({ event, api, newMembers, ctx, chatId: passedChatId }) {
    try {
      ensureCache();
      const tg = api || ctx?.telegram;
      if (!tg) return;

      const msg = event || ctx?.message || {};
      const chatId = passedChatId || msg.chat?.id || ctx?.chat?.id;
      if (!chatId) return;

      const members = newMembers || msg.new_chat_members || ctx?.message?.new_chat_members || [];
      if (!members.length) return;

      const chatTitle = msg.chat?.title || ctx?.chat?.title || "Group";
      let groupImageUrl = null;
      try {
        const cp = await tg.getChat(chatId);
        if (cp && cp.photo) {
          const f = await tg.getFile(cp.photo.big_file_id);
          groupImageUrl = `https://api.telegram.org/file/bot${tg.token}/${f.file_path}`;
        }
      } catch {}

      const botName = FIXED_BOT_NAME;
      const ownerName = FIXED_OWNER_NAME;
      const prefix = global.config?.botInfo?.prefix || FIXED_PREFIX;

      for (const member of members) {
        if (!member) continue;

        // Bot itself added
        if (member.is_bot) {
          let myId = null;
          try { myId = (await tg.getMe()).id; } catch {}
          if (myId && String(member.id) === String(myId)) {
            const addedByName = event?.from?.first_name || ctx?.from?.first_name || "Admin";
            const addedByUsername = event?.from?.username ? "@" + event.from.username : (ctx?.from?.username ? "@" + ctx.from.username : "—");
            const displayTitle = String(chatTitle).slice(0, 24);
            const botWelcomeMessage =
`╭─❖─〔 ${botName} 〕─❖─╮
│ 🤖 𝐇𝐄𝐋𝐎 ${displayTitle.toUpperCase()}!
├──────────────────────┤
│ ✅ 𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐟𝐨𝐫 𝐚𝐝𝐝𝐢𝐧𝐠 𝐦𝐞!
│
│ 👤 𝐀𝐝𝐝𝐞𝐝 𝐛𝐲: ${addedByName}
│ 📝 ${addedByUsername}
│ 👑 𝐎𝐰𝐧𝐞𝐫: ${ownerName}
│ ⚙️ 𝐏𝐫𝐞𝐟𝐢𝐱: ${prefix}
│ 💡 ${prefix}help for all cmds
├──────────────────────┤
╰─❖─〔 𝐄𝐒𝐁-𝐁𝐎𝐓 〕─❖─╯`;
            try {
              await tg.sendPhoto(chatId, BOT_WELCOME_PHOTO, {
                caption: botWelcomeMessage,
                reply_markup: WELCOME_BUTTONS
              });
            } catch {
              await tg.sendMessage(chatId, botWelcomeMessage, { reply_markup: WELCOME_BUTTONS }).catch(() => {});
            }
            continue;
          }
          continue; // other bots skip
        }

        const userName = (member.first_name || "") + (member.last_name ? " " + member.last_name : "") || "User";
        const userId = member.id;
        const username = member.username ? `@${member.username}` : "No username";
        const adderName = event?.from?.first_name || ctx?.from?.first_name || "Unknown";

        const avatarUrl = await getAvatarUrl(tg, userId);
        const adderAvatarUrl = await getAvatarUrl(tg, event?.from?.id || ctx?.from?.id);

        let buffer;
        try {
          buffer = await createBanner({
            name: userName,
            adderName,
            groupName: chatTitle,
            member: await tg.getChatMembersCount(chatId).catch(() => 0),
            avatarUrl,
            adderAvatar: adderAvatarUrl,
            groupImage: groupImageUrl || avatarUrl
          });
        } catch (e) {
          console.log("[JOIN] canvas error:", e.message);
          buffer = null;
        }

        const bdTime = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka", hour: "2-digit", minute: "2-digit", hour12: true });
        const bdDate = new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka", day: "2-digit", month: "short", year: "numeric" });

        const welcomeMessage = `╔══════════════════════╗
║ ✨ WELCOME FAMILY ✨ ║
╚══════════════════════╝

┏━━━━━━━━━━━━━━━━━━━━━┓
┃ 👤 𝗡𝗮𝗺𝗲 : ${userName}
┃ 🆔 𝗨𝗜𝗗 : ${userId}
┃ 📝 𝗨𝘀𝗲𝗿 : ${username}
┃ 🏠 𝗚𝗿𝗼𝘂𝗽 : ${chatTitle}
┃ ➕ 𝗔𝗱𝗱𝗲𝗱 : ${adderName}
┃ ⏰ 𝗧𝗶𝗺𝗲 : ${bdTime}
┃ 📅 𝗗𝗮𝘁𝗲 : ${bdDate}
┗━━━━━━━━━━━━━━━━━━━━━┛

🌟 আমাদের পরিবারে আপনাকে স্বাগতম 🌟`;

        if (buffer) {
          const ok = await sendPhotoBuffer(tg, chatId, buffer, welcomeMessage);
          if (!ok) await tg.sendMessage(chatId, welcomeMessage).catch(() => {});
        } else {
          await tg.sendMessage(chatId, welcomeMessage).catch(() => {});
        }
      }
    } catch (error) {
      console.log("[JOIN ERROR]", error.message || error);
      try { if (global.log) global.log.error("Error in welcome event:", error); } catch {}
    }
  }
};
