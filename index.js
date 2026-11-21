
const { spawn } = require("child_process");
const path = require("path");
const express = require("express");
const fs = require("fs");
const Logger = require("./logger/logs");

const log = new Logger("Asia/Dhaka");
const app = express();
const PORT = process.env.PORT || 3000;
let botProcess = null;
let restartCount = 0;
const MAX_RESTART = 50;
const botPath = path.join(__dirname, "ESB-TEAM.js");

if (!fs.existsSync(botPath)) {
  console.error("ESB-TEAM.js not found!");
  process.exit(1);
}

app.get("/", (req, res) => res.status(200).send("ESB BOT is running! 🚀"));
app.get("/health", (req, res) => res.status(200).send("OK"));
app.get("/uptime", (req, res) => res.status(200).json({ status: "ok", uptime: Math.floor(process.uptime()) }));

const server = app.listen(PORT, "0.0.0.0", () => console.log(`Process manager on port ${PORT}`));
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") console.log(`Port ${PORT} busy — continuing`);
  else console.log("HTTP error:", err.message);
});

function startBot() {
  if (restartCount >= MAX_RESTART) { log.error("Max restart reached"); process.exit(1); }
  log.info("Starting ESB BOT...");
  botProcess = spawn("node", ["ESB-TEAM.js"], { cwd: __dirname, stdio: "inherit", env: process.env });
  botProcess.on("close", (code) => {
    log.info(`Bot stopped code: ${code}`);
    restartCount++;
    setTimeout(startBot, 3000);
  });
  botProcess.on("error", (err) => {
    log.error("Process error:", err.message);
    restartCount++;
    setTimeout(startBot, 5000);
  });
}
process.on("SIGINT", () => { if (botProcess) botProcess.kill("SIGINT"); process.exit(0); });
process.on("SIGTERM", () => { if (botProcess) botProcess.kill("SIGTERM"); process.exit(0); });
startBot();
