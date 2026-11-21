function extractMention(event) {
  if (!event) return null;
  const text = event.text || event.caption || event.body || '';
  const entities = event.entities || event.caption_entities || [];

  for (const entity of entities) {
    if (entity.type === 'text_mention' && entity.user) {
      return { type: 'id', value: String(entity.user.id) };
    }
  }
  for (const entity of entities) {
    if (entity.type === 'mention') {
      const username = text.slice(entity.offset, entity.offset + entity.length);
      return { type: 'username', value: username.replace('@', '') };
    }
  }
  const words = text.split(/\s+/);
  for (const word of words) {
    if (word.startsWith('@') && word.length > 1) {
      return { type: 'username', value: word.replace('@', '').replace(/[^a-zA-Z0-9_]/g,'') };
    }
  }
  return null;
}

async function resolveTarget({ event, args, bot, senderID }) {
  if (event?.reply_to_message?.from?.id) {
    return String(event.reply_to_message.from.id);
  }
  const mention = extractMention(event);
  if (mention) {
    if (mention.type === 'id') return mention.value;
    if (mention.type === 'username') {
      const query = mention.value.toLowerCase();
      try {
        const users = typeof global.db?.getAllUsers === 'function' ? await global.db.getAllUsers() : [];
        const found = users.find(u => (u.username && u.username.toLowerCase() === query) || (u.name && u.name.toLowerCase() === query));
        if (found) return String(found.uid || found.id);
      } catch {}
      try {
        const chat = await bot.getChat('@' + mention.value);
        if (chat?.id) return String(chat.id);
      } catch (e) {
        return '@' + mention.value;
      }
    }
  }
  if (args && args.length > 0) {
    const arg = String(args[0]).trim();
    if (/^-?\d+$/.test(arg)) return arg;
    const query = arg.replace('@', '').toLowerCase();
    try {
      const users = typeof global.db?.getAllUsers === 'function' ? await global.db.getAllUsers() : [];
      const found = users.find(u => (u.username && u.username.toLowerCase() === query) || (u.name && u.name.toLowerCase() === query));
      if (found) return String(found.uid || found.id);
    } catch {}
    try {
      const chat = await bot.getChat(arg.startsWith('@')? arg : '@' + arg);
      if (chat?.id) return String(chat.id);
    } catch (e) {
      return arg.startsWith('@')? arg : '@' + arg;
    }
  }
  return String(senderID);
}

async function getDisplayName(bot, id) {
  if (typeof id === 'string' && id.startsWith('@')) return id;
  try {
    const chat = await bot.getChat(id);
    if (chat) {
      if (chat.first_name) return chat.first_name + (chat.last_name? ' ' + chat.last_name : '');
      if (chat.username) return '@' + chat.username;
      if (chat.title) return chat.title;
    }
  } catch {}
  return 'User';
}

module.exports = {
  config: {
    name: "pp",
    aliases: ["profile", "pfp"],
    author: "Community",
    version: "1.1.0",
    role: 0,
    category: "image",
    description: "Show profile photo of you, a replied user, or a UID.",
    usePrefix: true,
    cooldown: 5
  },

  BADOL: async function ({ event, api, args, message, chatId }) {
    const senderID = event.from.id;
    const bot = api;

    const targetID = await resolveTarget({ event, args, senderID, bot });

    if (typeof targetID === 'string' && targetID.startsWith('@')) {
      return await api.sendMessage(chatId, `❌ Could not find user: ${targetID}\n\n💡 Make sure the username is correct or the user has messaged the bot.`);
    }

    try {
      const name = await getDisplayName(bot, targetID);
      const photos = await bot.getUserProfilePhotos(targetID, { limit: 1 });

      if (!photos || photos.total_count === 0 ||!photos.photos || photos.photos.length === 0) {
        return await api.sendMessage(chatId, `❌ No profile photo found for ${name}\n📌 ID: ${targetID}`);
      }

      const sizes = photos.photos[0];
      const bestPhoto = sizes[sizes.length - 1];
      const caption = `📸 Profile photo of ${name}\n🆔 ID: ${targetID}`;

      await bot.sendPhoto(chatId, bestPhoto.file_id, { caption });

    } catch (err) {
      let errorMsg = '❌ Could not fetch profile photo.';
      if (err.message.includes('USER_ID_INVALID')) errorMsg += '\n❌ Invalid user ID or username.';
      else if (err.message.includes('PHOTO')) errorMsg += '\n🔒 Hidden photo.';
      else errorMsg += `\n📌 Error: ${err.message}`;

      await api.sendMessage(chatId, errorMsg);
    }
  }
};
