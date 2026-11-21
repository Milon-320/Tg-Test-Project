<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=36&duration=2800&pause=900&color=00F5FF&center=true&vCenter=true&multiline=true&repeat=true&width=720&height=130&lines=ESB+BOT+v2.1;Open+Source+Telegram+Framework;Fork+%E2%80%A2+Customize+%E2%80%A2+Deploy" alt="Typing SVG" />

<br/>

<img src="https://user-images.githubusercontent.com/74038190/212284087-bbe7e430-757e-4901-90bf-4cd2ce3e1852.gif" width="110">

<br/><br/>

![Node](https://img.shields.io/badge/Node.js-18%2B-brightgreen?style=for-the-badge&logo=node.js&logoColor=white)
![Telegraf](https://img.shields.io/badge/Telegraf-4.x-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-F7DF1E?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Open%20Source-00F5FF?style=for-the-badge)
![PRs](https://img.shields.io/badge/PRs-Welcome-ff69b4?style=for-the-badge)

<br/>

**🔥 Modular Commands • Events • Dashboard • Fully Customizable 🔥**

<sub>No owner lock · No paid lock · Fork and make it yours</sub>

</div>

---

<div align="center">

### 👑 CREATOR & CREDITS

| | |
|:--:|:--|
| **Creator** | **MOHAMMAD BADOL** |
| **Telegram** | [@B4D9L_007](https://t.me/B4D9L_007) |
| **Role** | Original author of this framework |

<img src="https://user-images.githubusercontent.com/74038190/212284158-515455ee-5d6c-4ff6-9cad-4ad2a3a1b3b3.gif" width="70">

> এই ওপেন-সোর্স ফ্রেমওয়ার্কের মূল নির্মাতা **MOHAMMAD BADOL**।  
> ফর্ক করে ব্যবহার করতে পারবেন — ক্রেডিট রাখা উচিত ও প্রশংসনীয়।

</div>

---

## 📑 Table of Contents

- [✨ Features](#-features)
- [📋 Requirements](#-requirements)
- [🚀 Fork & Install](#-fork--install)
- [⚙️ Configuration](#️-configuration)
- [▶️ How to Run](#️-how-to-run)
- [☁️ Hosting Guide](#️-hosting-guide)
- [🧩 Create a Command](#-create-a-command)
- [📡 Create an Event](#-create-an-event)
- [🧰 Supported Handlers](#-supported-handlers)
- [🔐 Permission Roles](#-permission-roles)
- [🗄️ Database API](#️-database-api)
- [🌐 Global Objects](#-global-objects)
- [📁 Project Structure](#-project-structure)
- [🛠️ Built-in Systems](#️-built-in-systems)
- [❓ FAQ](#-faq)
- [📞 Contact](#-contact)

---

## ✨ Features

<div align="center">

| | Feature | Details |
|:---:|:-------:|:--------|
| 🧩 | **Modular Commands** | প্রতিটি কমান্ড আলাদা `.js` ফাইল — অ্যাড/রিমুভ সহজ |
| 📡 | **Event System** | Join, Leave, Reaction, Admin change, Video chat… |
| 🔓 | **No Owner Lock** | ফর্ক করে A–Z সব কাস্টমাইজ করা যায় |
| 🛡️ | **Moderation** | Anti-link, Anti-gali, Anti-bot, Mute, Warn, Kick |
| 📊 | **Optional Dashboard** | ওয়েব UI (চাইলে চালু) |
| 🗄️ | **JSON / MongoDB** | দুই ধরনের ডাটাবেস |
| ⚡ | **Prefix / No-Prefix** | কমান্ড অনুযায়ী কনফিগারযোগ্য |
| 🔄 | **Reload Ready** | লোডার দিয়ে কমান্ড/ইভেন্ট ম্যানেজ |
| 🎨 | **Colored Logs** | ব্যানার + কনসোল লগ |

</div>

---

## 📋 Requirements

| Item | Details |
|:-----|:--------|
| **Node.js** | `v18` বা তার উপর ([nodejs.org](https://nodejs.org)) |
| **npm** | Node এর সাথে আসে |
| **Bot Token** | [@BotFather](https://t.me/BotFather) → `/newbot` |
| **Telegram User ID** | [@MCS_HELP_BOT](https://t.me/MCS_HELP_BOT) |
| **Git** (ঐচ্ছিক) | Clone / Fork এর জন্য |

অন্য কোনো পেইড সার্ভিস বা আলাদা ডেভেলপার লাগবে না।

---

## 🚀 Fork & Install

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=2000&color=FFD700&center=true&vCenter=true&width=480&height=40&lines=Fork+%E2%86%92+Clone+%E2%86%92+npm+install+%E2%86%92+Config+%E2%86%92+Run" alt="steps" />
</div>

### ১) Fork
GitHub রিপো পেজে উপরের **Fork** বাটনে ক্লিক করুন → আপনার অ্যাকাউন্টে কপি হবে।

### ২) Clone বা Download
```bash
git clone https://github.com/BADOL-VAI/ESB-TG-BOT.git
cd ESB-TG-BOT
```
অথবা **Code → Download ZIP** করে এক্সট্র্যাক্ট করুন।

### ৩) Dependencies
```bash
npm install
```

---

## ⚙️ Configuration

শুধু `config.json` এডিট করুন:

```json
{
  "botInfo": {
    "name": "ESB BOT",
    "prefix": "/",
    "token": "PASTE_BOTFATHER_TOKEN_HERE",
    "timezone": "Asia/Dhaka",
    "usePrefix": true
  },
  "ownerInfo": {
    "owner": {
      "name": "Your Name",
      "id": "YOUR_NUMERIC_TELEGRAM_ID"
    },
    "botAdmins": ["YOUR_NUMERIC_TELEGRAM_ID"]
  },
  "settings": {
    "onlyAdmin": false,
    "allowInboxMode": true,
    "antilinkGlobalEnabled": true,
    "forceJoin": {
      "enabled": false,
      "channelId": "",
      "channelLink": ""
    }
  },
  "database": {
    "type": "json"
  }
}
```

| Field | Meaning |
|:------|:--------|
| `botInfo.token` | BotFather টোকেন (**বাধ্যতামূলক**) |
| `botInfo.prefix` | কমান্ড প্রিফিক্স, যেমন `/` |
| `botInfo.name` | বটের নাম |
| `ownerInfo.owner.id` | মেইন ওনার Telegram ID |
| `ownerInfo.botAdmins` | অ্যাডমিন ID অ্যারে |
| `settings.onlyAdmin` | `true` হলে শুধু অ্যাডমিন কমান্ড চালাবে |
| `database.type` | `"json"` বা `"mongodb"` |

> ⚠️ টোকেন ও ID কখনো পাবলিক কমিটে পুশ করবেন না।

---

## ▶️ How to Run

### লোকাল / VPS
```bash
npm start
```
অথবা সরাসরি:
```bash
node ESB-TEAM.js
```
অটো-রিস্টার্ট ম্যানেজারসহ:
```bash
node index.js
```

### PM2 (VPS এ সুপারিশকৃত)
```bash
npm install -g pm2
pm2 start ESB-TEAM.js --name esb-bot
pm2 save
pm2 startup
```

---

## ☁️ Hosting Guide

| Platform | কীভাবে |
|:---------|:-------|
| **Render** | New → Web Service → এই রিপো কানেক্ট → Build: `npm install` → Start: `npm start` → Free/Paid plan |
| **Railway** | New Project → Deploy from GitHub → Start command `npm start` |
| **Katabump / Bot hosting panels** | ZIP আপলোড বা Git pull → Start: `npm start` বা `node index.js` → Node 18+ |
| **Replit** | Import from GitHub → Secrets এ চাইলে টোকেন → Run |
| **VPS (Ubuntu)** | Node 18 ইন্সটল → `npm install` → `pm2 start ESB-TEAM.js` |
| **GitHub** | কোড হোস্ট/ফর্ক; রানটাইম আলাদা হোস্টে (Render/VPS/Panel) |

**Render `render.yaml`** রিপোতে থাকলে এক-ক্লিক ডিপ্লয় সহজ হয়।  
পোর্ট হোস্টিং নিজে সেট করে (`PORT` env) — কোড সেটা অটো নেয়।

---

## 🧩 Create a Command

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=17&duration=2200&color=7CFC00&center=true&vCenter=true&width=520&height=40&lines=Copy+this+template+%E2%86%92+Save+in+Script%2Fcmds+%E2%86%92+Restart" alt="cmd" />
</div>

ফাইল: `Script/cmds/hello.js`

```js
module.exports = {
  config: {
    name: "hello",              // মেইন নাম → /hello
    aliases: ["hi", "hey"],     // অন্য নাম
    version: "1.0",
    author: "Your Name",        // ইনফো মাত্র — লক নয়
    role: 0,                    // 0 = all, 1 = admin, 2 = owner
    cooldowns: 3,               // সেকেন্ড
    description: "Say hello",
    category: "general",
    guide: "{prefix}hello [name]",
    usePrefix: true             // false = প্রিফিক্স ছাড়াও চলবে
  },

  // মেইন হ্যান্ডলার — নাম অবশ্যই BADOL
  BADOL: async function ({ message, args, event, api, userId, chatId, ctx, db }) {
    const name = args.join(" ") || "World";
    await message.reply(`Hello, ${name}! 👋`);
  }
};
```

সেভ → বট রিস্টার্ট → চাটে `/hello Rafi`

### `BADOL` এ পাওয়া আর্গুমেন্ট

| Param | Type | ব্যবহার |
|:------|:-----|:--------|
| `message` | Helper | `message.reply("text")` |
| `args` | `string[]` | প্রিফিক্স+নামের পরের অংশ |
| `event` | Object | র টেলিগ্রাম মেসেজ |
| `api` | Telegraf API | `api.sendMessage`, `getChat`… |
| `userId` | number/string | যিনি কমান্ড দিয়েছেন |
| `chatId` | number | গ্রুপ/প্রাইভেট চ্যাট ID |
| `ctx` | Context | পুরো Telegraf context |
| `db` | Database | `getUser` / `setUser` / … |
| `bot` | Bot | বট ইনস্ট্যান্স |

### মেসেজ রিপ্লাই উদাহরণ
```js
await message.reply("সাধারণ টেক্সট");
await message.reply("<b>Bold</b> & <i>Italic</i>", { parse_mode: "HTML" });
await message.reply("*Markdown*", { parse_mode: "Markdown" });
```

---

## 📡 Create an Event

ফাইল: `Script/events/welcome.js`

```js
module.exports = {
  config: {
    name: "welcome",
    eventType: "new_member",    // কোন ইভেন্টে চলবে
    author: "Your Name",
    version: "1.0"
  },

  BADOL: async function ({ event, api, message, ctx, newMembers }) {
    const user = newMembers?.[0];
    if (!user) return;
    await message.reply(`স্বাগতম ${user.first_name}! 🎉`);
  }
};
```

### সাপোর্টেড `eventType`

| eventType | কখন ফায়ার হয় |
|:----------|:-------------|
| `new_member` | কেউ গ্রুপে জয়েন |
| `left_member` | লিভ / কিক |
| `reaction` | মেসেজে রিয়্যাকশন |
| `message_edit` | মেসেজ এডিট |
| `admin_change` | অ্যাডমিন ওঠানামা |
| `video_chat_lifecycle` | ভয়েস/ভিডিও চ্যাট |
| `group_info_change` | নাম/ফটো পরিবর্তন |

---

## 🧰 Supported Handlers

একই কমান্ড ফাইলে অতিরিক্ত হ্যান্ডলার দেওয়া যায়:

```js
module.exports = {
  config: { name: "demo", role: 0, author: "You" },

  // স্ল্যাশ/প্রিফিক্স কমান্ড
  BADOL: async function ({ message, args }) { /* ... */ },

  // ইনলাইন বাটন কলব্যাক
  onCallback: async function ({ event, api, ctx, message }) { /* ... */ },

  // ইউজার রিপ্লাই (onReply সেট করার পর)
  onReply: async function ({ message, event, Reply }) { /* ... */ },

  // প্রতিটি মেসেজে (কমান্ড না হলেও)
  onChat: async function ({ message, event, userId }) { /* ... */ },

  // বট স্টার্টে একবার
  onLoad: async function ({ api, bot }) { /* ... */ }
};
```

| Handler | কাজ |
|:--------|:----|
| `BADOL` | মেইন কমান্ড বডি (**প্রয়োজনীয়**) |
| `onCallback` | `callback_query` / ইনলাইন বাটন |
| `onReply` | বট মেসেজের রিপ্লাই হ্যান্ডেল |
| `onChat` | সব মেসেজে রান (ফিল্টার নিজে করুন) |
| `onLoad` | বট অনলাইন হলে ইনিট |

---

## 🔐 Permission Roles

| Role | Access |
|:----:|:-------|
| `0` | সবাই |
| `1` | গ্রুপ অ্যাডমিন + `botAdmins` |
| `2` | Owner + `botAdmins` |

ID শুধু `config.json` → `ownerInfo` থেকে পড়ে। কোনো হার্ডকোডেড লক নেই।

---

## 🗄️ Database API

```js
// User
const user = await db.getUser(userId);
await db.setUser(userId, { name: "Rafi", exp: 50 });

// Thread / Group
const thread = await db.getThread(chatId);
await db.setThread(chatId, { welcome: true });

// Lists
const users = await db.getAllUsers();
const threads = await db.getAllThreads();
```

`config.json` → `database.type`:
- `"json"` — ফাইল বেসড (ডিফল্ট, সহজ)
- `"mongodb"` — `uriMongodb` স্ট্রিং দিন

---

## 🌐 Global Objects

কোডের যেকোনো জায়গা থেকে:

| Global | মানে |
|:-------|:-----|
| `global.config` | `config.json` |
| `global.badol.commands` | লোডেড কমান্ড Map |
| `global.badol.events` | লোডেড ইভেন্ট Map |
| `global.db` | ডাটাবেস ইনস্ট্যান্স |
| `global.bot` | Telegraf bot |
| `global.botUsername` | বট ইউজারনেম |
| `global.log` | লগার |

---

## 📁 Project Structure

```text
ESB-BOT-main/
├── ESB-TEAM.js              # মেইন বট এন্ট্রি
├── index.js                 # প্রসেস ম্যানেজার (অটো রিস্টার্ট)
├── config.json              # টোকেন, ওনার, সেটিংস
├── package.json
├── render.yaml              # Render ডিপ্লয় হেল্পার
│
├── BADOL/                   # কোর ইঞ্জিন
│   ├── autoload.js          # কমান্ড/ইভেন্ট লোডার
│   ├── handlerEvents.js     # মেসেজ/ক্যালব্যাক রাউটার
│   ├── login.js             # Telegram কানেকশন
│   ├── notices.js           # পারমিশন / কুলডাউন নোটিশ
│   ├── forceJoin.js         # অপশনাল ফোর্স জয়েন
│   └── util.js              # MessageUtils ও হেল্পার
│
├── Script/
│   ├── cmds/                # ← আপনার কমান্ড এখানে
│   └── events/              # ← আপনার ইভেন্ট এখানে
│
├── database/                # JSON / Mongo ড্রাইভার
├── logger/                  # ব্যানার + কালার লগ
└── dashboard/               # অপশনাল ওয়েব ড্যাশবোর্ড
```

---

## 🛠️ Built-in Systems

| System | বর্ণনা |
|:-------|:-------|
| **Command loader** | `Script/cmds/*.js` অটো লোড |
| **Event loader** | `Script/events/*.js` অটো লোড |
| **Roles** | 0 / 1 / 2 পারমিশন |
| **Cooldown** | কমান্ড কনফিগ থেকে |
| **Anti systems** | লিংক, গালি, আনঅথরাইজড বট… |
| **Group tools** | kick, mute, warn, pin, poll, tag… |
| **Info tools** | uid, pp, gcinfo, botinfo, ping… |
| **Dashboard** | `dashBoard.enable = true` করলে চালু |

নতুন ফিচার = নতুন ফাইল `cmds/` বা `events/` এ যোগ করা।

---

## ❓ FAQ

**নতুন কমান্ড লিখলাম, কাজ করে না?**  
→ ফাইল `Script/cmds/` এ আছে তো? `module.exports` ও `BADOL` ঠিক আছে? বট **রিস্টার্ট** করেছেন?

**আলাদা ডেভেলপার বা ChatGPT ছাড়া কি চলবে?**  
→ হ্যাঁ। এই README এর টেমপ্লেট কপি-এডিট করেই কমান্ড/ইভেন্ট বানানো যায়। AI ব্যবহার করলে এই ফাইল রেফারেন্স হিসেবে দিন।

**টোকেন কোথায় পাব?**  
→ [@BotFather](https://t.me/BotFather) → `/newbot` → টোকেন কপি → `config.json`।

**নিজের ID?**  
→ [@MCS_HELP_BOT](https://t.me/MCS_HELP_BOT) এ `/uid`।

**`EADDRINUSE` পোর্ট এরর?**  
→ হোস্টে অন্য প্রসেস পোর্ট ধরেছে। সার্ভিস রিস্টার্ট করুন; টেলিগ্রাম বট সাধারণত তবু চলে।

**MongoDB চাই?**  
→ `database.type = "mongodb"` এবং `uriMongodb` এ URI দিন।

**ক্রেডিট কি রাখতে হবে?**  
→ লাইসেন্স লক নেই; মূল নির্মাতা **MOHAMMAD BADOL** এর ক্রেডিট রাখা ভালো অভ্যাস।

---

## 📞 Contact

<div align="center">

<img src="https://user-images.githubusercontent.com/74038190/212284087-bbe7e430-757e-4901-90bf-4cd2ce3e1852.gif" width="80">

| | |
|:--:|:--|
| 👑 **Creator** | **MOHAMMAD BADOL** |
| 📱 **Telegram** | [t.me/B4D9L_007](https://t.me/B4D9L_007) |
| 💬 **Support** | বট সেটআপ/কাস্টম সমস্যায় ইনবক্স করুন |

<br/>

[![Telegram](https://img.shields.io/badge/Contact_Owner-MOHAMMAD%20BADOL-00CEED?style=for-the-badge&logo=telegram)](https://t.me/B4D9L_007)

<br/>

**ESB BOT** — Open Source Telegram Framework  
Built with ❤️ by **MOHAMMAD BADOL**

`MIT License` — Free to fork, modify & deploy

</div>
