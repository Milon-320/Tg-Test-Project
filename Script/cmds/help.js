module.exports = {
  config: {
    name: "help",
    aliases: ["h", "menu", "commands"],
    author: "MCS HELP BOT",
    version: "1.0",
    role: 0,
    cooldown: 2,
    description: "Simple help menu",
    category: "system",
    usePrefix: true
  },

  BADOL: async function ({ event, api, args, chatId }) {
    const prefix = global.config?.prefix || "/";
    const allCmds = [...new Map([...global.badol.commands.values()].map(c => [c.config.name, c])).values()].sort((a,b)=>a.config.name.localeCompare(b.config.name));
    
    const input = (args[0] || "").toLowerCase();

    if (input && isNaN(input)) {
      const cmd = allCmds.find(c => c.config.name.toLowerCase() === input || (c.config.aliases||[]).map(a=>a.toLowerCase()).includes(input));
      if (!cmd) {
        return api.sendMessage(chatId, `❌ Command "${input}" not found!\n\nUse ${prefix}help to see all commands.`);
      }
      const cfg = cmd.config;
      let text = `📌 COMMAND INFO\n\n`;
      text += `Name: ${prefix}${cfg.name}\n`;
      text += `Aliases: ${cfg.aliases?.length ? cfg.aliases.join(", ") : "None"}\n`;
      text += `Category: ${cfg.category || "general"}\n`;
      text += `Role: ${cfg.role ?? 0} (0=All, 1=GC Admin, 2=Bot Admin)\n`;
      text += `Cooldown: ${cfg.cooldown || 0}s\n`;
      text += `Author: ${cfg.author || "Unknown"}\n`;
      text += `Description: ${cfg.description || "No description"}\n`;
      text += `\nGuide: ${cfg.guide ? cfg.guide.replace("{pn}", `${prefix}${cfg.name}`).replace("{p}", prefix) : `${prefix}${cfg.name}`}`;
      
      return api.sendMessage(chatId, text);
    }

    const perPage = 30;
    let page = parseInt(input) || 1;
    const totalPages = Math.ceil(allCmds.length / perPage) || 1;
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    const start = (page - 1) * perPage;
    const slice = allCmds.slice(start, start + perPage);

    let msg = `📋 HELP MENU - Page ${page}/${totalPages}\n`;
    msg += `Total Commands: ${allCmds.length}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;

    slice.forEach((c, i) => {
      msg += `${start + i + 1}. ${prefix}${c.config.name}\n`;
    });

    msg += `\n━━━━━━━━━━━━━━━━━━━━\n`;
    if (page < totalPages) {
      msg += `Next Page: ${prefix}help ${page + 1}\n`;
    }
    msg += `Info: ${prefix}help <command name>\n`;
    msg += `Example: ${prefix}help video`;

    return api.sendMessage(chatId, msg);
  }
};