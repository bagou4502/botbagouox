/* eslint-disable no-undef */
require('dotenv').config();
const {ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const {execute} = require('../../commands/setupticket.bagou');
const DB = require('../../schemas/Ticket');
const EVERYONEID = process.env.EVERYONE_ID;
const TICKETCATID = process.env.TICKETCATID;

module.exports = {
    name: 'interactionCreate',
    description: 'Ticket',

    /**
     *
     * @param {ButtonInteraction} interaction
     */
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
            const Embed = new MessageEmbed()
                .setAuthor(`${guild.name} | Ticket : ${ID}`, guild.iconURL({dynamic: true}))
                .setDescription('Explain your problem/question here.');
            const Buttons = new MessageActionRow()
                .addComponents(new MessageButton()
                    .setCustomId('ticketclose')
                    .setLabel('❌ Close ticket')
                    .setStyle('PRIMARY'));
            channel.send({embeds: [Embed], components: [Buttons]});
            await channel.send({content: `${member} here is your ticket`}).then((ma) => {
                setTimeout(() => {
                    // eslint-disable-next-line no-empty-function
                    ma.delete().catch(() => {});
                }, 5000);
            });

            interaction.reply({content: `Votre ticket a été crée #ticket-${ID}`, ephemeral: true});
        });


    }
};