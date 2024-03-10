const { Intents } = require("discord.js");
const express = require('express');
const router = express.Router();
const Discord = require("discord.js");
const User = require('../models/user');
const mongoose2 = require('mongoose');
const fetch = require('node-fetch')	
const { Partials } = require("discord.js");
const twilio = require('twilio');
//const clientt = twilio('', '');
const client = new Discord.Client({
	fetchAllMembers: true,
	  intents: [
	  Intents.FLAGS.GUILDS,
	  Intents.FLAGS.GUILD_MEMBERS,
	  Intents.FLAGS.GUILD_BANS,
	  Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	  Intents.FLAGS.GUILD_INTEGRATIONS,
	  Intents.FLAGS.GUILD_VOICE_STATES,
	  Intents.FLAGS.GUILD_PRESENCES,
	  Intents.FLAGS.GUILD_MESSAGES,
	  Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	  Intents.FLAGS.GUILD_INVITES,
	  Intents.FLAGS.GUILD_MESSAGE_TYPING,
	  32767] });
const token = '';
client.login(token);

router.get('/', (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
			return res.render('user.ejs', {data: data});
})
});

router.get('/404', (req, res, next) => {
			res.render('404.ejs');
});

router.get('/admin/sunuculiste', (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
		if (!data) {
			res.redirect('/404');
		  } else {
			if (data.permissions === 'Admin') {
				User.findOne({ unique_id: req.session.userId }, 'guildId', (err, guildData) => {
				const sunucuID = guildData ? guildData.guildId : '';
				const botGuilds = client.guilds.cache.map(guild => ({
					id: guild.id,
					name: guild.name,
					memberCount: guild.memberCount,
					iconURL: guild.iconURL({ format: 'png', dynamic: true, size: 4096 }) || 'https://cdn.discordapp.com/attachments/1168953173533261965/1171211029859016735/8eb17bd9-2ef8-4809-934b-09a0280c2f54.jpg?ex=655bda45&is=65496545&hm=75e4a1a496fb11290a7f453a2256f6b35267721b14fa9949313239d9743fb761&',
					bannerURL: guild.bannerURL({ format: 'png', dynamic: true, size: 4096 }) || '',
					vanityURLCode: guild.vanityURLCode,
					boostCount: guild.premiumSubscriptionCount
				}));
				res.render('root.ejs', { "name": data.username, "email": data.email, "KullanıcıID": data.unique_id, bot: client, sunucuID: sunucuID, perm: data.permissions,  botGuilds: botGuilds });
				})
			  } else {
				res.redirect('/404');
			  }
			}
		})
})

router.get(`/admin/notify`, (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
		if (!data) {
			res.redirect('/404');
		  } else {
			if (data.permissions === 'Admin') {
				User.findOne({ unique_id: req.session.userId }, 'guildId', (err, guildData) => {
				const sunucuID = guildData ? guildData.guildId : '';
				res.render('notifySend.ejs', { "name": data.username, "email": data.email, "KullanıcıID": data.unique_id, bot: client, sunucuID: sunucuID, perm: data.permissions });
				})
			  } else {
				res.redirect('/404');
			  }
			}
		})
})

router.post('/successNotify', (req, res) => {
	const Notify = require('../models/notify')
    const notificationText = req.body.notificationText;
		
    const newNotification = new Notify({
    notifications: notificationText
    });

    newNotification.save((err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/admin/notify');
        }
    });
});

router.get('/manage-account', (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
		if (!data) {
			res.redirect('/login');
		  } else {
			User.findOne({ unique_id: req.session.userId }, 'guildId', (err, guildData) => {
				if (err) {
				  console.error('guildId çekilirken hata oluştu: ', err);
				} else {
				  const sunucuID = guildData ? guildData.guildId : '';
		
				  if (!sunucuID) {
					  res.redirect('/');
					  return;
					}
					const Notify = require("../models/notify")
				Notify.find({}, (err, notifications) => {
				res.render('account-settings.ejs', { notifications: notifications, "name": data.username, "email": data.email, "KullanıcıID": data.unique_id, bot: client, sunucuID: sunucuID})
				})  
			}
			})
		  }
		})
})


router.get('/register', (req, res, next) => {
			return res.render('register.ejs');
});

router.get('/setup', (req, res, next) => {
	const setupdurum = require("../models/setup")
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
	  if (!data) {
		res.redirect('/login');
	  } else {
		User.findOne({ unique_id: req.session.userId }, 'guildId', (err, guildData) => {
			if (err) {
			  console.error('guildId çekilirken hata oluştu: ', err);
			} else {
			  const sunucuID = guildData ? guildData.guildId : '';
	
			  if (!sunucuID) {
				  res.redirect('/');
				  return;
				}
				const Notify = require("../models/notify")
				Notify.find({}, (err, notifications) => {
		 res.render('setup.ejs', { notifications: notifications, "name": data.username, "email": data.email, bot: client, sunucuID: sunucuID, "database": setupdurum})
				})	
		}
		})
	  }
	});
  });

router.get('/login', (req, res, next) => {
	return res.render('login.ejs');
});

router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
	  if (data) {
		if (data.password == req.body.password) {
		  req.session.userId = data.unique_id;
          res.redirect('/anasayfa');
		} else {
		  res.send({ "Pass": "Girilen Şifre Geçersiz!" });
		}
	  } else {
		res.send({ "Login": "Girilen Bilgiler Geçersiz!" });
	  }
	});
  });

  router.get('/anasayfa', (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
	  if (!data) {
		res.redirect('/login');
	  } else {
		User.findOne({ unique_id: req.session.userId }, 'guildId', (err, guildData) => {
		  if (err) {
			console.error('guildId çekilirken hata oluştu: ', err);
		  } else {
			const sunucuID = guildData ? guildData.guildId : '';
  
			if (!sunucuID) {
				res.redirect('/');
				return;
			  }

			const token = ""
			const userIP = req.ip;
  
			fetch(`https://discord.com/api/v10/guilds/${sunucuID}`, {
			  method: 'GET',
			  headers: {
				'Authorization': `Bot ${token}`,
				'Content-Type': 'application/json',
			  },
			}).then(response => response.json())
			.then(sunucuData => {
  
			  fetch(`https://discord.com/api/v10/guilds/${sunucuID}/members?limit=1000`, {
				method: 'GET',
				headers: {
				  'Authorization': `Bot ${token}`,
				  'Content-Type': 'application/json',
				},
			  })
			  .then(response => response.json())
			  .then(sunucuBilgi => {
  
				const sunucuAdi = sunucuData.name;
				const iconUrl = `https://cdn.discordapp.com/icons/${sunucuID}/${sunucuData.icon}.png`;
				const name = data.username;
				const email = data.email;
				const Notify = require("../models/notify")
				Notify.find({}, (err, notifications) => {
					if (err) {
						console.error(err);
					} else {
		
				res.render('index.ejs', {notifications: notifications, sunucuAdi: sunucuAdi, name: name, email: email, iconUrl: iconUrl, bot: client, sunucuID: sunucuID, userIP, userIP });  

			}
		});
			})
			});
		  }
		});
	  }
	});
  });
  
  
  router.get('/profil', (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
	  if (!data) {
		res.redirect('/login');
	  } else {
		User.findOne({ unique_id: req.session.userId }, 'guildId', (err, guildData) => {
			if (err) {
			  console.error('guildId çekilirken hata oluştu: ', err);
			} else {
			  const sunucuID = guildData ? guildData.guildId : '';
	
			  if (!sunucuID) {
				  res.redirect('/');
				  return;
				}

				const Notify = require("../models/notify")
				Notify.find({}, (err, notifications) => {
			
		 res.render('profil.ejs', { notifications: notifications, "name": data.username, "email": data.email, "KullanıcıID": data.unique_id, bot: client, sunucuID: sunucuID, perm: data.permissions})
				})	
		}
		})
	  }
	});
  });

router.get('/logout', (req, res, next) => {
	if (req.session) {
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

router.post('/guilds', async (req, res, next) => {
			const setupdurum = require("../models/setup")
		  User.findOne({ unique_id: req.session.userId }, 'guildId', (err, sunucuIDBull) => {
			User.findOne({ unique_id: req.session.userId }, (err, data) => {
			if (err) {
			  console.error('Veri postlarken guildId bulunamadı!', err);
			} else {
			  const sunucuID = sunucuIDBull ? sunucuIDBull.guildId : '';

			  if (!sunucuID) {
				res.redirect('/');
				return;
			  }
			  res.render('setup', {bot: client, sunucuID: sunucuID, "name": data.username, "email": data.email});

	   let obj = { sunucutagfln: req.body.sunucutagfln, sunucutagsızfln: req.body.sunucutagsızfln, sunucuototag: req.body.sunucuototag, botdurum: req.body.botdurum, botstatus: req.body.botstatus, kurallar: req.body.kurallar, genelchat: req.body.genelchat, ftchat: req.body.ftchat, welcomekanal: req.body.welcomekanal, welcomeseskanal: req.body.welcomeseskanal, botses: req.body.botses, botcommands: req.body.botcommands, registeryetkili: req.body.registeryetkili, kayitsiz: req.body.kayitsizrol, erkekrolleri: req.body.erkekrolleri, kadinrolleri: req.body.kadinrolleri, hgmesaj: req.body.hgmesaj, jailyrol: req.body.jailyrol, banyrol: req.body.banyrol, muteyrol: req.body.muteyrol, vmuteyrol: req.body.vmuteyrol, jailrol: req.body.jailrol, vmuterol: req.body.vmuterol, muterol: req.body.muterol, enaltyetkilirol: req.body.enaltrol, staffRoles: req.body.yetkilirolleriymiş, yasaklitag: req.body.yasaklıtagrol, yoneticirol: req.body.ytrol, yenihesap: req.body.yenihesaprol, publickategori: req.body.publickategori, registerkategori: req.body.registerkategori, sorunçözmekategori: req.body.sorunçözmekategori, alonekategori: req.body.alonekategori, privatekategori: req.body.privatekategori, streamerkategori: req.body.streamerkategori, sleepkanalı: req.body.sleepkanalı, gamekategori: req.body.gamekategori,  menuisim: req.body.menuisim, menuaciklama: req.body.menuaciklama, menuroller: req.body.menuroller}; 
	   if (obj.sunucutagfln !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID }, 
	    { $set: { guildTag: obj.sunucutagfln } }, { upsert: true }).exec(); }; 
	   if (obj.sunucutagsızfln !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { guildNoTag: obj.sunucutagsızfln } }, { upsert: true }).exec();}
	   if (obj.sunucutagsızfln !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { guildNoTag: obj.sunucutagsızfln } }, { upsert: true }).exec();}
	   if (obj.sunucuototag !== undefined) {  setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { otoTag: obj.sunucuototag } }, { upsert: true }).exec(); };
	   if (obj.sunucuototag !== undefined) {  setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { otoTag: obj.sunucuototag } }, { upsert: true }).exec(); };
	   if (obj.botdurum !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { durum: obj.botdurum } }, { upsert: true }).exec(); };
	   if (obj.botstatus !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { status: obj.botstatus } }, { upsert: true }).exec(); };
	   if (obj.genelchat !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { chat: obj.genelchat } }, { upsert: true }).exec(); };
	   if (obj.ftchat !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { fotoChat: obj.ftchat } }, { upsert: true }).exec(); };
	   if (obj.welcomekanal !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { registerChat: obj.welcomekanal } }, { upsert: true }).exec(); };
	   if (obj.welcomeseskanal !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { RegisterVoices: [obj.welcomeseskanal] } }, { upsert: true }).exec(); };
	   if (obj.botses !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
	    { $set: { botVoiceChannel: obj.botses } }, { upsert: true }).exec(); };
	   if (obj.kurallar !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { rules: obj.kurallar } }, { upsert: true }).exec(); };
	   if (obj.botcommands !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { botCommandsChannel: obj.botcommands } }, { upsert: true }).exec(); };
	   if (obj.registeryetkili !== undefined) { let RegisterRollerFiltred = []; typeof obj.registeryetkili == 'string' ? RegisterRollerFiltred.push(obj.registeryetkili) : obj.registeryetkili.map(a => RegisterRollerFiltred.push(a)); setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $addToSet: { botCommandsRoles: RegisterRollerFiltred } }, { upsert: true }).exec(); };
	   if (obj.erkekrolleri !== undefined) { let ErkekRollerFiltered = []; typeof obj.erkekrolleri == 'string' ? ErkekRollerFiltered.push(obj.erkekrolleri) : obj.erkekrolleri.map(a => ErkekRollerFiltered.push(a)); setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $addToSet: { manRoles: ErkekRollerFiltered } }, { upsert: true }).exec(); };
	   if (obj.kadinrolleri !== undefined) { let KadinRollerFiltered = []; typeof obj.kadinrolleri == 'string' ? KadinRollerFiltered.push(obj.kadinrolleri) : obj.kadinrolleri.map(a => KadinRollerFiltered.push(a)); setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $addToSet: { ladyRoles: KadinRollerFiltered } }, { upsert: true }).exec(); }
	   if (obj.kayitsiz !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { unregisterRoles: [obj.kayitsiz] } }, { upsert: true }).exec(); }
	   if (obj.hgmesaj !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { hgMesajı: obj.hgmesaj } }, { upsert: true }).exec(); };
	   if (obj.jailyrol !== undefined) { let JailRollerFiltred = []; typeof obj.jailyrol == 'string' ? JailRollerFiltred.push(obj.jailyrol) : obj.jailyrol.map(a => JailRollerFiltred.push(a)); setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $addToSet: { jailRoles: JailRollerFiltred } }, { upsert: true }).exec(); };
	   if (obj.banyrol !== undefined) { let BanRollerFiltered = []; typeof obj.banyrol == 'string' ? BanRollerFiltered.push(obj.banyrol) : obj.banyrol.map(a => BanRollerFiltered.push(a)); setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $addToSet: { banHammerRoles: BanRollerFiltered } }, { upsert: true }).exec(); };
	   if (obj.muteyrol !== undefined) { let MuteRollerFiltred = []; typeof obj.muteyrol == 'string' ? MuteRollerFiltred.push(obj.muteyrol) : obj.muteyrol.map(a => MuteRollerFiltred.push(a)); setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $addToSet: { chatMuteRoles: MuteRollerFiltred } }, { upsert: true }).exec(); };
	   if (obj.vmuteyrol !== undefined) { let VmuteRollerFiltred = []; typeof obj.vmuteyrol == 'string' ? VmuteRollerFiltred.push(obj.vmuteyrol) : obj.vmuteyrol.map(a => VmuteRollerFiltred.push(a)); setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $addToSet: { voiceMuteRoles: VmuteRollerFiltred } }, { upsert: true }).exec(); };
	   if (obj.jailrol !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { punitiveRole: obj.jailrol } }, { upsert: true }).exec(); };
	   if (obj.muterol !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { mutedRole: obj.muterol } }, { upsert: true }).exec(); };
	   if (obj.yasaklitag !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { bannedTagRole: obj.yasaklitag } }, { upsert: true }).exec(); };
	   if (obj.yenihesap !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { newAccRole: obj.yenihesap } }, { upsert: true }).exec(); };
	   if (obj.yoneticirol !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { adminRole: obj.yoneticirol } }, { upsert: true }).exec(); };
	   if (obj.enaltyetkilirol !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { minStaffRole: obj.enaltyetkilirol } }, { upsert: true }).exec(); };
	   if (obj.staffRoles !== undefined) {let yetkilirollerfiltred = []; typeof obj.staffRoles == 'string' ? yetkilirollerfiltred.push(obj.staffRoles) : obj.staffRoles.map(a => yetkilirollerfiltred.push(a)); setupdurum.findOneAndUpdate({ guildID: sunucuID},
		{ $addToSet: { staffRoles: yetkilirollerfiltred } }, { upsert: true}); }
	   if (obj.publickategori !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { publicCategory: obj.publickategori } }, { upsert: true }).exec() };
	   if (obj.registerkategori !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { registerCategory: obj.registerkategori } }, { upsert: true }).exec(); }
	   if (obj.sorunçözmekategori !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { sorunÇözmeCategory: obj.sorunçözmekategori } }, { upsert: true }).exec(); };
	   if (obj.alonekategori !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { aloneCategory: obj.alonekategori } }, { upsert: true }).exec(); };
	   if (obj.streamerkategori !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { streamerCategory: obj.streamerkategori } }, { upsert: true }).exec(); };
	   if (obj.sleepkanalı !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { sleepChannel: obj.sleepkanalı } }, { upsert: true }).exec(); };
	   if (obj.gamekategori !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { gameParents: obj.gamekategori } }, { upsert: true }).exec(); }
	   if (obj.privatekategori !== undefined) { setupdurum.findOneAndUpdate({ guildID: sunucuID },
		{ $set: { privateCategory: obj.privatekategori } }, { upsert: true }).exec() };
	} 
})})})


module.exports = router;
