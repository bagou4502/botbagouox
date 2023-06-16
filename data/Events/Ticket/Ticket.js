/* eslint-disable no-undef */
require('dotenv').config();
const {MessageEmbed, MessageActionRow, MessageButton, } = require('discord.js');
const DB = require('../../schemas/Ticket');
const EVERYONEID = process.env.EVERYONE_ID;
const TICKETCATID = process.env.TICKETCATID;
const {Modal, TextInputComponent, showModal} = require('discord-modals');

module.exports = {
    name: 'interactionCreate',
    description: 'Ticket',

    async execute (interaction) {
        if (!interaction.isButton()) {
            return;
        }
        const {guild, member, customId} = interaction;
        if (!['ticketopen'].includes(customId)) {
            return;
        }
        const support = guild.roles.cache.find((role) => role.name === "Support")
        DB.count({}, async (err, number) => {
        await guild.channels.create(`ticket-${number+1}`, {
            type: 'GUILD_TEXT',
            parent: TICKETCATID,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']

                },
                {
                    id: support.id,
                    allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']

                },
                {
                    id: EVERYONEID,
                    deny: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
                }
            ]
        }).then(async (channel) => {
            await DB.create({
                GuildID: guild.id,
                MemberID: member.id,
                TicketID: number+1,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: customId
            });
            const EmbedExplain = new MessageEmbed()
                .setAuthor(`${guild.name} | Ticket : ${number+1}`, guild.iconURL({dynamic: true}))
                .setDescription('**READ THE INSTRUCTIONS!**\n-If you have a transaction id send it.\n-Send your panel version (you can see it on overview tab of admin panel part)\n -Send your wings version(s) (you can see it by clicking on your node)\n -Send panel logs you can get it with:\n```tail -n 100 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log | nc pteropaste.com 99```\n-Send wings logs you can get it with:\n```tail -n 100 /var/log/pterodactyl/wings.log | nc pteropaste.com 99```\n After ask your question/explain your problem');

            const Buttons = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setCustomId('ticketclose')
                    .setLabel('❌ Close ticket')
                    .setStyle('PRIMARY'));
            channel.send({embeds: [EmbedExplain], components: [Buttons]});
            await channel.send({content: `${member} here is your ticket`}).then((ma) => {
                setTimeout(() => {
                    // eslint-disable-next-line no-empty-function
                    ma.delete().catch(() => {});
                }, 2000);
            });

            interaction.reply({content: `Votre ticket a été crée #ticket-${number+1}`, ephemeral: true});
        });
    });

    }
};