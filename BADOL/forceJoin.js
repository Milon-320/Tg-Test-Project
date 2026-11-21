function getForceConfig(){
  try{
    const cfg = global.config?.settings?.forceJoin;
    if(!cfg || !cfg.enabled) return null;
    
    if (cfg.channelId) return cfg;
    if (Array.isArray(cfg.channels) && cfg.channels[0]) {
      return { enabled: true, channelId: cfg.channels[0].id, channelLink: cfg.channels[0].link };
    }
    return null;
  }catch{ return null; }
}

async function isUserJoined(api, userId){
  try{
    const cfg = getForceConfig();
    if(!cfg) return true;
    const oi = global.config?.ownerInfo || {};
    const admins = (oi.botAdmins || global.config?.adminUID || []).map(String);
    if (oi.owner?.id) admins.push(String(oi.owner.id));
    if (oi.mainOwner?.id) admins.push(String(oi.mainOwner.id));
    if(admins.includes(String(userId))) return true;
    const member = await api.getChatMember(cfg.channelId, userId);
    return ["member","administrator","creator","restricted"].includes(member.status);
  }catch(e){
    const msg = (e.message || "").toLowerCase();
    if(msg.includes("not found") || msg.includes("not a member") || msg.includes("left") || msg.includes("kicked")) return false;
    return true;
  }
}

function getForceJoinButtons(){
  const cfg = getForceConfig();
  if(!cfg || !cfg.channelLink) return null;
  return {
    inline_keyboard: [
      [{ text: "📢 Join Channel", url: cfg.channelLink }],
      [{ text: "✅ Check Joined", callback_data: "check_force_join" }]
    ]
  };
}

function getForceJoinText(){
  return `🚨 Force Join Required\n\nJoin the required channel, then press Check Joined.`;
}

module.exports = { isUserJoined, getForceJoinButtons, getForceJoinText, getForceConfig };
