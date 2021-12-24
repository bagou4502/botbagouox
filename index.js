const Discord = require('discord.js');

const client = new Discord.Client();

const config = require('./config/config.json');

const intents = new Discord.intents('32767');

client.once('ready', () => {
    console.log('Bagouox is online!');
});

client.login(config.token);
a