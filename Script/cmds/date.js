module.exports = {
  config: { name: "date", aliases: ["today"], version: "1.0", author: "MOHAMMAD BADOL", role: 0, cooldowns: 2, description: "Show current date and time", category: "info", guide: "{prefix}date" },
  BADOL: async function ({ message }) {
    const tz = global.config?.timezone || global.config?.botInfo?.timezone || "Asia/Dhaka";
    try {
      const fmt = new Intl.DateTimeFormat("en-US", {
        timeZone: tz, weekday: "long", year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
      });
      await message.reply("Timezone: " + tz + "\n" + fmt.format(new Date()));
    } catch {
      await message.reply(new Date().toUTCString());
    }
  }
};
