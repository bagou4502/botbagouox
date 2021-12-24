/* eslint-disable no-undef */
require('dotenv').config();
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const {Client, Intents, Collection, MessageEmbed} = require('discord.js');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});
const fs = require('fs');

const liblog = require('./libs/logger.js');


const colorlib = require('./libs/color.js');
const color = colorlib.color;

const logs = liblog.log;
const commands = [];
client.commands = new Collection();
const CommandsFiles = fs.readdirSync('./data/commands').filter((file) => file.endsWith('.bagou'));

for (const file of CommandsFiles) {
    const command = require(`./data/commands/${file}`);
    logs.info(`Initialisation of ${color.Bright(color.FgCyan(command.data.name))} command...`);
    commands.push(JSON.stringify(command.data));
    client.commands.set(command.data.name, command);
    logs.info(`${color.Bright(color.FgCyan(command.data.name.charAt(0).toUpperCase() + command.data.name.slice(1)))} initialized sucessfully`);
}

client.once('ready', () => {
    logs.info(`${color.BgBlack(color.FgBlue('Bagouox'))} is ${color.FgGreen('online')}!`);
    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(process.env.APP_TOKEN);
    // eslint-disable-next-line no-unused-expressions
    async () => {
        try {
            if (process.env.TYPE === 'production') {
                await rest.put(Routes.applicationCommand(CLIENT_ID), {
                    body: commands
                });
                logs.info('All commands are globaly saved');

            } else {
                await rest.put(Routes.applicationCommand(CLIENT_ID, process.env.APP_GUILDID), {
                    body: commands
                });
                logs.info('All command are localy saved.');

            }
        } catch (err) {
            if (err) {
                logs.err(err);
            }
        }
    };
});


client.on('ready', () => {
    const guild = client.guilds.cache.get(process.env.APP_GUILDID);
    let command;

    if (guild) {
        command = guild.commands;
    } else {
        command = client.application?.commands;
    }

    command?.create({
        description: 'Replies with pong.',
        name: 'ping'
    });
    logs.info(`${color.Bright(color.FgCyan('Ping'))} Command was loaded.`);
    command?.create({
        description: 'List all commands.',
        name: 'help'
    });
    logs.info(`${color.Bright(color.FgCyan('Help'))} Command was loaded.`);

});

// eslint-disable-next-line max-statements
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const command = client.commands.get(interaction.commandName);
    if (!command) {
        return;
    }
    if (interaction.commandName === 'help') {
        const commandslist = JSON.parse(JSON.stringify(client.commands));

        const embed = new MessageEmbed().setColor('#76FD3D')
            .setTitle('List of commands')
            .setURL('https://bagou450.com/bot/help.html')
            .setFooter('Bagou450', 'https://cdn.discordapp.com/attachments/751908883005440071/924077222497775686/b5cc2146f6f5326025aac4bee011d70c.png');
        commandslist.forEach((aa) => {
            embed.addField(aa.data.name.charAt(0).toUpperCase() + aa.data.name.slice(1), aa.data.description);
        });
        await interaction.reply({embeds: [embed]});
    } else {
        try {
            await command.execute(interaction);
        } catch (err) {
            if (err) {
                logs.err(color.FgRed(err));
            }

            await interaction.reply({
                content: 'An error was occured please contace Bagou450#0666 for see why.',
                ephemeral: true
            });
        }
    }
});
client.login(process.env.APP_TOKEN);