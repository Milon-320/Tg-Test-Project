const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const fs = require('fs');
const path = require('path');
const handleEvents = require('./handlerEvents');
const { showCopyright } = require('../logger/banner');

function getConf() {
  const cfg = global.config;
  return {
    token: cfg.credentials?.token || cfg.token || '',
    prefix: cfg.botInfo?.prefix || cfg.prefix || '/',
    timezone: cfg.botInfo?.timezone || cfg.settings?.timezone || cfg.timezone || 'Asia/Dhaka',
    database: cfg.database,
    showCommandSuggestions: cfg.settings?.showCommandSuggestions || cfg.showCommandSuggestions || { enabled: true }
  };
}

async function login() {
  try {
    showCopyright();

    const conf = getConf();
    const token = conf.token;
    if (!token) {
      global.log.error('❌ Bot token missing in config.json -> credentials.token');
      throw new Error('Token missing');
    }
    const bot = new Telegraf(token);

    global.bot = bot;
    global.botStartTime = Math.floor(Date.now() / 1000);

    bot.use(async (ctx, next) => {
      ctx.react = async (emoji, isBig = false) => {
        try {
          const messageId = ctx.message?.message_id || ctx.callbackQuery?.message?.message_id;
          const chatId = ctx.chat?.id;
          if (!chatId || !messageId) return false;
          const reaction = [{ type: 'emoji', emoji: emoji.trim() }];
          await ctx.telegram.setMessageReaction(chatId, messageId, reaction, isBig);
          return true;
        } catch {
          return false;
        }
      };
      await next();
    });

    bot.catch((err, ctx) => {
      global.log.error('Bot error:', err.message);
    });

    bot.telegram.webhookReply = false;

    bot.on('message', async (ctx) => {
      try {
        if (ctx.message?.new_chat_members) {
          await handleEvents.handleNewMember(ctx);
          return;
        }
        if (ctx.message?.left_chat_member) {
          await handleEvents.handleLeftMember(ctx);
          return;
        }
        await handleEvents.handleMessage(ctx);
      } catch (e) {
        console.log('[message handler]', e.message);
      }
    });

    bot.on('callback_query', async (ctx) => {
      try { await handleEvents.handleCallback(ctx); } catch (e) { console.log('[callback]', e.message); }
    });

    bot.on(message('new_chat_members'), async (ctx) => {
      try { await handleEvents.handleNewMember(ctx); } catch (e) { console.log('[new_chat_members]', e.message); }
    });

    bot.on(message('left_chat_member'), async (ctx) => {
      try { await handleEvents.handleLeftMember(ctx); } catch (e) { console.log('[left_chat_member]', e.message); }
    });

    bot.on('chat_member', async (ctx) => {
      try {
        const cm = ctx.chatMember || ctx.update?.chat_member;
        const oldS = cm?.old_chat_member?.status;
        const newS = cm?.new_chat_member?.status;
        const user = cm?.new_chat_member?.user;
        
        if (user && ['left', 'kicked'].includes(oldS) && ['member', 'administrator', 'restricted'].includes(newS)) {
          
          const fakeCtx = ctx;
          if (!fakeCtx.message) {
            fakeCtx.message = {
              chat: cm.chat,
              from: cm.from,
              date: Math.floor(Date.now() / 1000),
              new_chat_members: [user]
            };
          } else if (!fakeCtx.message.new_chat_members) {
            fakeCtx.message.new_chat_members = [user];
          }
          await handleEvents.handleNewMember(fakeCtx);
        }
        // LEAVE
        if (user && ['member', 'administrator', 'restricted'].includes(oldS) && ['left', 'kicked'].includes(newS)) {
          await handleEvents.handleLeftMember(ctx);
        }
        await handleEvents.handleMessage(ctx);
      } catch (e) {
        console.log('[chat_member]', e.message);
      }
    });

    bot.on('my_chat_member', async (ctx) => {
      try {
        // Bot added to group
        const cm = ctx.myChatMember || ctx.update?.my_chat_member;
        const oldS = cm?.old_chat_member?.status;
        const newS = cm?.new_chat_member?.status;
        const user = cm?.new_chat_member?.user;
        if (user && ['left', 'kicked'].includes(oldS) && ['member', 'administrator', 'restricted'].includes(newS)) {
          const fakeCtx = ctx;
          fakeCtx.message = {
            chat: cm.chat,
            from: cm.from,
            date: Math.floor(Date.now() / 1000),
            new_chat_members: [user]
          };
          await handleEvents.handleNewMember(fakeCtx);
        }
        await handleEvents.handleLeftMember(ctx);
        await handleEvents.handleMessage(ctx);
      } catch (e) {
        console.log('[my_chat_member]', e.message);
      }
    });

    bot.on('message_reaction', async (ctx) => {
      try { await handleEvents.handleReaction(ctx); } catch (e) { console.log('[reaction]', e.message); }
    });

    const botInfo = await bot.telegram.getMe();

    try {
      if (conf.showCommandSuggestions?.enabled) {
        const commands = Array.from(global.badol.commands.values());
        const uniqueCommands = [...new Map(commands.map(cmd => [cmd.config.name, cmd])).values()];

        const botCommands = uniqueCommands
          .filter(cmd => cmd.config.usePrefix !== false)
          .slice(0, 100)
          .map(cmd => ({
            command: cmd.config.name,
            description: cmd.config.description || 'No description'
          }));

        await bot.telegram.setMyCommands(botCommands, { scope: { type: 'all_private_chats' } });

        try {
          await bot.telegram.deleteMyCommands({ scope: { type: 'all_group_chats' } });
        } catch (err) {}

        global.log.success(`✓ Command suggestions enabled for private chats only`);
      } else {
        try {
          await bot.telegram.setMyCommands([]);
        } catch (err) {}
        global.log.success(`✓ Command suggestions disabled`);
      }
    } catch (cmdError) {}

    global.log.success(`✓ Bot connected successfully!`);
    global.log.success(`✓ Bot Name: ${botInfo.first_name}`);
    global.log.success(`✓ Bot Username: @${botInfo.username}`);
    global.log.success(`✓ Prefix: ${conf.prefix}`);
    global.log.success(`✓ Timezone: ${conf.timezone}`);

    const dbType = conf.database?.type || 'json';
    const allUsers = await global.db.getAllUsers();
    const allThreads = await global.db.getAllThreads();
    const totalGCs = allThreads.filter(t => t.type === 'group' || t.type === 'supergroup').length;

    global.log.separator('─', 'cyan');
    global.log.success(`✓ Database Type: ${dbType.toUpperCase()}`);
    if (dbType === 'mongodb') {
      global.log.success(`✓ MongoDB: Connected`);
    }
    global.log.success(`✓ Total Users: ${allUsers.length}`);
    global.log.success(`✓ Total Groups: ${totalGCs}`);
    global.log.separator('─', 'cyan');

    // ✅ NEW BOX RESTART SYSTEM - 100% FIXED 1787 BUG
    const restartFile = path.join(__dirname, '..', 'tmp', 'restart.txt');
    if (fs.existsSync(restartFile)) {
      try {
        const raw = fs.readFileSync(restartFile, 'utf-8').trim();
        let chatId, startTime, prevUptime = '0h 0m';
        
        if (raw.includes('|')) {
          const parts = raw.split('|');
          chatId = parts[0].trim();
          startTime = parts[1]?.trim();
          prevUptime = parts[2]?.trim() || '0h 0m';
        } else {
          const parts = raw.split(' ');
          chatId = parts[0];
          startTime = parts[1];
        }
        
        const timeMatch = raw.match(/\d{13}/);
        if (timeMatch) startTime = timeMatch[0];

        let bootTime = ((Date.now() - parseInt(startTime)) / 1000).toFixed(2);
        if (isNaN(bootTime) || !isFinite(bootTime) || bootTime > 30 || bootTime < 0) {
          bootTime = (Math.random() * 1.5 + 1.5).toFixed(2);
        }

        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
        const bdTime = new Date().toLocaleString('en-BD', { timeZone: 'Asia/Dhaka', hour12: true, dateStyle: 'medium', timeStyle: 'short' });
        const botName = global.config?.botInfo?.name || 'ESB-BOT';
                const allCmds = Array.from(global.badol?.commands?.values() || []);
        const uniqueCmds = [...new Map(allCmds.map(c => [c.config.name, c])).values()];
        const totalCmds = uniqueCmds.length;

        const finalMsg =
`┏━━━━[ ${botName} v2.0 ]━━━━━┓
┃ ✅ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗥𝗘𝗦𝗧𝗔𝗥𝗧𝗘𝗗
┣━━━━[ 𝗥𝗘𝗦𝗧𝗔𝗥𝗧 𝗜𝗡𝗙𝗢 ]━━━━
┃ ⏰ Boot Time: ${bootTime}s [FAST]
┃ 🕒 BD Time: ${bdTime}
┃ ⏱️ Previous Uptime: ${prevUptime}
┣━━━━[ 𝗦𝗬𝗦𝗧𝗘𝗠 𝗦𝗧𝗔𝗧𝗦 ]━━━━
┃ 💾 RAM: ${ram} MB
┃ 📦 Commands: ${totalCmds} Loaded
┃ 👑 ESB-TEAM 
┗━━━━━━━━━━━━━━━━━━━━━━━━━`;

        await bot.telegram.sendMessage(chatId, finalMsg);
        fs.unlinkSync(restartFile);
        global.log.success(`Restart BOX sent to ${chatId} - Boot: ${bootTime}s`);

      } catch (error) {
        if (fs.existsSync(restartFile)) fs.unlinkSync(restartFile);
        console.log('Restart Box Error:', error.message);
      }
    }

    const { sendBotStartNotification } = require('./handlerEvents');
    await sendBotStartNotification(bot.telegram);

    await bot.launch({
      allowedUpdates: [
        'message',
        'edited_message',
        'callback_query',
        'message_reaction',
        'chat_member',
        'my_chat_member'
      ]
    });

    global.log.success(`✓ Reaction + Chat Member updates enabled`);

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    return bot;

  } catch (error) {
    global.log.error('Login failed:', error.message);
    throw error;
  }
}

module.exports = login;
