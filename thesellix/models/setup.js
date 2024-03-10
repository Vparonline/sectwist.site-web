const { Schema, model } = require("mongoose");

const setup = Schema({
    guildID: String,
    hgMesajı: String,
    guildName: String,
    welcomeMessageGuildName: String,
    botVoiceChannel: String,
    fotoChat: String,
    RegisterVoices: Array,
    RegisterVoiceName: String,
    bannedTagLog: String,
    messageLog: String,
    voiceLog: String,
    rolLog: String,
    publicCategory: String,
    chat: String,
    registerChat: String,
    AgeLimits: Array,
    streamerCezalıLog: String,
    tagLog: String,
    tagAyrıcalıkları: String,
    streamerDenetim: String,
    banLog: String,
    jailLog: String,
    voiceMuteLog: String,
    chatMuteLog: String,
    cezaPuanıLog: String,
    leaderBoard: String,
    chatStatsLeaderBoardMessageID: String,
    voiceStatsLeaderBoardMessageID: String,
    taggedStatsLeaderBoardMessageID: String,
    inviteStatsLeaderBoardMessageID: String,
    registerStatsLeaderBoardMessageID: String,
    botCommandsChannel: String,
    AuthorityLeft: String,
    nickNameLog: String,
    commandsLog: String,
    joinLeaveLog: String,
    yetkiUpLog: String,
    registerLog: String,
    registerCategory: String,
    privateCategory: String,
    sorunÇözmeCategory: String,
    aloneCategory: String,
    streamerCategory: String,
    gameParents: Array,
    sleepChannel: String,
    registerPuan: Number,
    registerCoin: Number,
    taggedPuan: Number,
    taggedCoin: Number,
    invitePuan: Number,
    inviteCoin: Number,
    staffRoles: Array,
    taggedRole: String,
    guildTag: String,
    otoTag: String,
    guildNoTag: String,
    banHammerRoles: Array,
    allCommandsTrue: Array,
    botCommandsRoles: Array,
    staffRolesAddTrue: Array,
    voiceMuteRoles: Array,
    chatMuteRoles: Array,
    jailRoles: Array,
    moveRoles: Array,
    roleAddRemoveRoles: Array,
    manRoles: Array,
    ladyRoles: Array,
    boosterRole: String,
    vipRole: String,
    minStaffRole: String,
    bannedTagRole: String,
    unregisterRoles: Array,
    adminRole: String,
    punitiveRole: String,
    newAccRole: String,
    newAccLog: String,
    inviteLog: String,
    mutedRole: String,
    streamerPunishedRole: String,
    sponsorRole: String,
    musicianRole: String,
    durum: String, 
    status: String,    
    autoAuthorizationRoles: Array,
    banLimit: Number,
    jailLimit: Number,
    chatMuteLimit: Number,
    voiceMuteLimit: Number,
    registerLimit: Number,
    changeNameLimit: Number,
    veriResetLog: String,
    autoPerm: Boolean,
    noAutoPerm: Array,
    rules: String,
    levelLog: String,
    chatGuardLog: String, 
    spotifyMode: Boolean,
    capsMode: Boolean,
    msgLimitMode: Boolean,
    tagMode: Boolean,
    linkMode: Boolean,
    swearMode: Boolean,
    emojiMode: Boolean,
    spotifyTrue: Array,
    capsTrue: Array,
    msgLimitTrue: Array,
    tagTrue: Array,
    linkTrue: Array,
    swearTrue: Array,
    emojiTrue: Array,
    msgLimit: Number,
    linkLimit: Number,
    spamMode: Boolean,
    spamTrue: Array,
    spamLimit: Number,
    capsLimit: Number,
    tagLimit: Number,
    msgLimitLimit: Number,
    swearLimit: Number,
    emojiLimit: Number,
    etkinlikkatılımcısı: String,
    çekilişkatılımcısı: String,
});

module.exports = model("setup", setup);