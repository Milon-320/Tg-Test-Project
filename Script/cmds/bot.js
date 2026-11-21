const axios = require('axios');

const getApiUrl = async () => {
    try {
        const b = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-OFFICIAL/Nayan/main/api.json", { timeout: 5000 });
        return b.data.sim;
    } catch { return "https://api.nayan-v1.repl.co"; }
};

if (!global.badol.onReply) global.badol.onReply = new Map();
if (!global.badol.catbotUsed) global.badol.catbotUsed = [];

// ✅ NO REPEAT PICKER FUNCTION
function getRandomUnique() {
    let availableIndexes = RAND.map((_, i) => i).filter(i =>!global.badol.catbotUsed.includes(i));
    if (availableIndexes.length === 0) {
        global.badol.catbotUsed = [];
        availableIndexes = RAND.map((_, i) => i);
    }
    const randIdx = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    global.badol.catbotUsed.push(randIdx);
    // Memory Clean - 500+ হলে Reset
    if (global.badol.catbotUsed.length > 500) global.badol.catbotUsed.shift();
    return RAND[randIdx];
}

const RAND = [
    "বেশি Bot Bot করলে leave নিবো কিন্তু! 😒😒", "শুনবো না😼 তুমি আমার বাদল ভাই কে প্রেম করাই দাও নাই🥺পচা তুমি🥺",
                    "Bolo Babu, তুমি কি আমার বাদল ভাই কে ভালোবাসো? 🙈💋", "I love you janu! 🥰", "আরে বলদ, এতো ডাকিস কেন? 🤬",
                    "আসসালামু আলাইকুম, বলুন আপনার জন্য কি করতে পারি? 🥰", "আমাকে না ডেকে মেয়ে হলে বাদল ভাই এর ইনবক্সে চলে যা 🌚😂",
                    "আমাকে বট না বলে, বাদল ভাই কে জানু বল জানু 😘", "আমাকে ডেকো না,আমি বাদল ভাই এর সাথে ব্যাস্ত আছি",
                    "আমার বাদল ভাই এর পক্ষ থেকে তোমারে এতো এতো ভালোবাসা-🥰😽🫶", "বার বার Disturb করছিস কোনো😾,আমার জানুর সাথে ব্যাস্ত আছি😋",
                    "হ্যাঁ জানু, এইদিক এ আসো কিস দেই🤭 😘", "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস 😉😋🤣",
                    "তোর কথা তোর বাড়ি কেউ শুনে না,তো আমি কোনো শুনবো?🤔😂", "জান মেয়ে হলে বাদল ভাই এর ইনবক্সে চলে যাও 😍🫣💕",
                    "হা বলো, শুনছি আমি 😏", "আর কত বার ডাকবি,শুনছি তো", "বলো জানু 🌚", "তোর কি চোখে পড়ে না আমি ব্যাস্ত আছি😒",
                    "হুম জান তোমার ওই খানে উম্মহ😑😘", "আহ শুনা আমার তোমার অলিতে গলিতে উম্মাহ😇😘", "jang hanga korba😒😬",
                    "আমি এখন বাদল ভাই এর সাথে বিজি আছি আমাকে ডাকবেন না-😕😏", "আমাকে না ডেকে আমার বাদল ভাই কে একটা জি এফ দাও-😽🫶🌺",
                    "ঝাং থুমালে আইলাপিউ পেপি-💝😽", "উফফ বুঝলাম না এতো ডাকছেন কেনো-😤😡😈",
                    "জান তোমার বান্ধবী রে আমার বাদল ভাই এর হাতে তুলে দিবা-🙊🙆‍♂", "আজকে আমার মন ভালো নেই তাই আমারে ডাকবেন না-😪🤧",
                    "ঝাং 🫵থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ-🌺🤤💦", "চুনা ও চুনা আমার বাদল ভাই এর হবু বউ রে কেও দেকছো খুজে পাচ্ছি না😪🤧😭",
                    "স্বপ্ন তোমারে নিয়ে দেখতে চাই তুমি যদি আমার হয়ে থেকে যাও-💝🌺🌻", "জান হাঙ্গা করবা-🙊😝🌻",
                    "তোদের জন্য একটুও শান্তি নাই! শুধু ডিস্টার্ব করিস 😿", "জান মেয়ে হলে চিপায় আসো বাদল ভাই এর থেকে অনেক ভালোবাসা শিখছি তোমার জন্য-🙊🙈😽",
                    "ইসস এতো ডাকো কেনো লজ্জা লাগে তো-🙈🖤🌼", "ভালোবাসা করতে চাইলে বস বাদল ভাই এর ইনবক্স যাও-🙊🥱👅",
                    "আমার জান তুমি শুধু আমার 💝", "কিরে প্রেম করবি তাহলে বস বাদল ভাই এর ইনবক্সে গুতা দে 😘",
                    "জান আমার বস বাদল ভাই কে বিয়ে করবা-🙊😘🥳", "ওই বেডা চুপ থাক, নাইলে বাদল ভাই রে বলে দিমু 😾",
                    "তোরে দেখলেই আমার BP হাই হয়ে যায় 😵‍💫", "আমি কি তোর চাকর? খালি ডাকিস কেন 😒",
                    "বাদল ভাই বলছে তোরে পাত্তা না দিতে 🙄", "তোর নাকি গার্লফ্রেন্ড নাই? বাদল ভাই এর কাছে আয় শিখাই দিবে 😂",
                    "এত ডাকাডাকি করিস না, আমি সিঙ্গেল না 😏 বাদল ভাই আছে", "তুই কি হিরো আলম? এত ভাব নিস কেন 🤡",
                    "আমার বাদল ভাই তোর থেকে 100 গুণ হ্যান্ডসাম 😎", "তোরে ব্লক মারমু কিন্তু, বেশি জ্বালাইলে 😤",
                    "বাদল ভাই এর সাথে লুডু খেলতেছি, ডিস্টার্ব করিস না 🎲", "তোর কপালে প্রেম নাই, বাদল ভাই এর দোয়া নে 😇"
];

module.exports = {
    config: {
        name: "catbot",
        aliases: ["baby", "bby", "বট", "bot"],
        version: "9.0 NO-REPEAT 500+",
        author: "MOHAMMAD BADOL",
        role: 0,
        cooldown: 1,
        description: "chat bot sim sim ai system - No Repeat",
        category: "fun",
        usePrefix: false
    },

    BADOL: async function({ event, api, args }) {
        const chatId = event.chat.id;
        const userId = event.from.id;
        const name = (event.from.first_name || "User").trim();
        const text = (event.text || "").trim();
        const lower = text.toLowerCase();

        if(!text) return;

        if(event.reply_to_message?.from?.is_bot){
            return await this.apiCall(api, chatId, name, text, userId, event.message_id);
        }

        const keys = ["baby", "bby", "bot", "বট", "sim", "catbot"];
        const isKey = keys.some(k => lower.startsWith(k));
        let q = "";

        if(isKey){
            q = text.split(" ").slice(1).join(" ").trim();
            if(!q){
                const r = getRandomUnique();
                const s = await api.sendMessage(chatId, `${name}, ${r}`);
                global.badol.onReply.set(s.message_id, { commandName: "catbot" });
                return s;
            }
        } else {
            q = args.join(" ").trim();
            if(keys.includes(args[0]?.toLowerCase())) q = args.slice(1).join(" ").trim();
            if(!q) return;
        }

        return await this.apiCall(api, chatId, name, q, userId, event.message_id);
    },

    apiCall: async function(api, chatId, name, q, userId, replyId){
        try {
            const base = await getApiUrl();
            const res = await axios.get(`${base}/sim?type=ask&ask=${encodeURIComponent(q)}&senderID=${userId}`, { timeout: 15000 });
            let msg = res.data.data?.msg || res.data.msg || "বলো জানু 🥺";
            const s = await api.sendMessage(chatId, `${name}, ${msg}`, { reply_to_message_id: replyId });
            global.badol.onReply.set(s.message_id, { commandName: "catbot" });
            return s;
        } catch {
            const r = getRandomUnique();
            const s = await api.sendMessage(chatId, `${name}, ${r}`, { reply_to_message_id: replyId });
            global.badol.onReply.set(s.message_id, { commandName: "catbot" });
            return s;
        }
    },

    onReply: async function({ event, api }){
        const chatId = event.chat.id;
        const name = (event.from.first_name || "User").trim();
        const text = (event.text || "").trim();
        if(!text) return;
        return await this.apiCall(api, chatId, name, text, event.from.id, event.message_id);
    }
};