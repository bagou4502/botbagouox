/* eslint-disable no-undef */
require('dotenv').config();
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const DB = require('../../schemas/Ticket');
const EVERYONEID = process.env.EVERYONE_ID;
const TICKETCATID = process.env.TICKETCATID;

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

        const ID = Math.floor(Math.random() * 90000) + 10000;

        await guild.channels.create(`ticket-${ID}`, {
            type: 'GUILD_TEXT',
            parent: TICKETCATID,
            permissionOverwrites: [
                {
                    id: member.id,
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
                TicketID: ID,
                ChannelID: channel.id,
                Closed: false,
                Locked: false,
                Type: customId
            });
            const EmbedExplain = new MessageEmbed()
                .setAuthor(`${guild.name} | Ticket : ${ID}`, guild.iconURL({dynamic: true}))
                .setDescription('**READ THE INSTRUCTIONS!**\n-If you have a transaction id send it.\n-Send your panel version (you can see it on overview tab of admin panel part)\n -Send your wings version(s) (you can see it by clicking on your node)\n -Send panel logs you can get it with:\n```tail -n 100 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log | nc bin.ptdl.co 99```\n-Send wings logs you can get it with:\n```tail -n 100 /var/log/pterodactyl/wings.log | nc bin.ptdl.co 99```\n After ask your question/explain your problem');

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

            interaction.reply({content: `Votre ticket a été crée #ticket-${ID}`, ephemeral: true});
        });


    }
};