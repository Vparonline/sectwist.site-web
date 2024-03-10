const { Intents } = require("discord.js");
const express = require('express');
const Discord = require("discord.js");
const ejs = require('ejs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const client = new Discord.Client({fetchAllMembers: true,
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
  32767]});
const token = '';
const MongoDBURI = process.env.MONGO_URI;
const User = require("./models/user")

mongoose.connect(MongoDBURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
/*
const yeniKullanici = new User({
  unique_id: 1, 
  email: '',
  username: '',
  password: '',
  passwordConf: '',
  guildId: '',
  permissions: 'Üye'
});

yeniKullanici.save((err) => {
  if (err) {
    console.error('Hataoc', err);
  } else {
    console.log('Kullanıcı başarıyla kaydedildi.');
  }
});*/


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));
app.use('/assets', express.static(path.join(__dirname, './views/assets')));

const index = require('./routes/index');
const { error } = require('console');
app.use('/', index);

app.use((req, res, next) => {
  const err = new Error('Selam guest, klasör yollarını araştırmayı bıraksan mı?');
  err.status = 404;
  next(err);
});


app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(443, () => {
  console.log('443 Portunda Başlatıldı.');
});

client.login(token)
.catch(err => console.log("Bot Tokeni Hatalı"))
