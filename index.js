/* eslint-disable no-undef */
require('dotenv').config();
const {Client, GatewayIntentBits, Collection, MessageEmbed} = require('discord.js');
const mongoose = require('mongoose');
const Database = 'mongodb://185.25.205.206:30001/bagouox';
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
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
/*process.on('uncaughtException', (err) => {
    logs.err(err);
});*/
for (const file of CommandsFiles) {
    const command = require(`./data/commands/${file}`);
    commands.push(JSON.stringify(command.data));
    client.commands.set(command.data.name, command);
}


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
        if (commandname.permission) {
            const perm = commandname.permission;
            command?.create({
                category: commandname.data.category,
                description: commandname.data.description,
                name: commandname.data.name,
                options: commandname.data.options,
                permissions: {perm}
            });
        } else {
            command?.create({
                category: commandname.data.category,
                description: commandname.data.description,
                name: commandname.data.name,
                options: commandname.data.options
            });
        }
        logs.debug(`${color.Bright(color.FgCyan(commandname.data.name.charAt(0).toUpperCase() + commandname.data.name.slice(1)))} ${color.FgGreen(color.Bright('Command'))} was loaded.`);
    }
    mongoose.connect(Database, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => logs.debug(`Connected to ${color.FgMagenta('Database')}`))
        .catch(() => logs.fatal('Cant connect to Database.'));

    require('./data/Handlers/Events')(client);
    require('./data/Handlers/Messages')(client);


});

client.on('interactionCreate', async (interaction, args) => {
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
            const perm = interaction.client.commands.get(interaction.commandName).permission;
            const authorPerms = interaction.channel.permissionsFor(interaction.member);
            if (perm) {
                if (!authorPerms || !authorPerms.has(perm)) {
                    const NoPerm = new MessageEmbed()
                        .setColor('RED')
                        .setDescription('You don\'t have permission to execute this command');
                    interaction.reply({
                        embeds: [NoPerm],
                        ephemeral: true
                    });
                } else {
                    await command.execute(interaction, args);
                }
            } else {
                await command.execute(interaction, args);
            }
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