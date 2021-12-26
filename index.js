/* eslint-disable no-undef */
require('dotenv').config();
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const {Client, Intents, Collection, MessageEmbed} = require('discord.js');
const mongoose = require('mongoose');
const Database = 'mongodb://localhost:27017/bagouox';
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
    commands.push(JSON.stringify(command.data));
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
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
    for (const file of CommandsFiles) {
        const commandname = require(`./data/commands/${file}`);
        command?.create({
            category: commandname.data.category,
            description: commandname.data.description,
            name: commandname.data.name
        });
        logs.debug(`${color.Bright(color.FgCyan(commandname.data.name.charAt(0).toUpperCase() + commandname.data.name.slice(1)))} ${color.FgGreen(color.Bright('Command'))} was loaded.`);
    }
    mongoose.connect(Database, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => logs.debug(`Connected to ${color.FgMagenta('Database')}`))
        .catch(() => logs.fatal('Cant connect to Database.'));

    require('./data/Handlers/Events')(client);

});

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
            .addField({inline: true, name: 'You can see my test panel here', value: 'https://demo.bagou450.com'})
            .setTimestamp()
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