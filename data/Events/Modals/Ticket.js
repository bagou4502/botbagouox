
require('dotenv').config();
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    ChannelType,
    PermissionsBitField,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');
const DB = require('../../schemas/Ticket');
const EVERYONEID = process.env.EVERYONE_ID;
const APIENDPOINT = process.env.APIURL;

const axios = require('axios');
const {sleep} = require('ssh2-sftp-client/src/utils');

module.exports = {
    name: 'interactionCreate',
    description: 'TicketCreate',

    async execute (interaction) {
        if (!interaction.isModalSubmit()) {
            return;
        }
        const {guild, member, customId} = interaction;
        if (!['ticketModal'].includes(customId.split('-')[0])) {
            return;
        }

        let lasted = -1;
        await axios.get(`${APIENDPOINT}web/tickets/getLasted`, {
            headers: {
                Authorization: `Bearer ${process.env.APIKEY}`
            }
        }).then((response) => response.data)
            .then((data) => {
                lasted = data.data + 1;
                console.log(data.data);
            })
            .catch((error) => {
                console.log(error);
                interaction.reply({content: 'Error', ephemeral: true});

            });
        if (lasted === -1 || lasted === 1) {
            interaction.reply({content: 'Error', ephemeral: true});
            return;
        }
        const support = guild.roles.cache.find((role) => role.name === 'Support');
        let catId = process.env.TICKETCATID;
        // eslint-disable-next-line no-loop-func
        while (guild.channels.cache.filter((ch) => ch.parentId === catId).size > 49) {
            // eslint-disable-next-line default-case
            switch (catId) {
            case process.env.TICKETCATID:
                catId = process.env.TICKET2CATID;
                break;
            case process.env.TICKET2CATID:
                catId = process.env.TICKET3CATID;
                break;
            case process.env.TICKET3CATID:
                catId = process.env.TICKET4CATID;
                break;
            case process.env.TICKET4CATID:
                catId = process.env.TICKET5CATID;
                break;
            case process.env.TICKET5CATID:
                interaction.reply('Error please contact the Bagou450 Team trough email (contact@bagou450.com)');
                return;
            }
        }
        await guild.channels.create({
            name: `ticket-${lasted}`,
            type: ChannelType.GuildText,
            parent: catId,
            permissionOverwrites: [
                {
                    id: member.id,
                    allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]

                },
                {
                    id: support.id,
                    allow: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]

                },
                {
                    id: EVERYONEID,
                    deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory]
                }
            ]
        })
            .then(async (channel) => {
                const EmbedExplain = new EmbedBuilder()
                    .setAuthor({name: `${guild.name} | Ticket : ${lasted}`, iconURL: guild.iconURL({dynamic: true})})
                    .setDescription('**Remember that you can link your Bagou450 and your Discord Account for get this ticket directly on the website!**');
                interaction.reply({
                    content: `Your ticket has been created #ticket-${lasted}`,
                    ephemeral: true
                })
                const Buttons = new ActionRowBuilder()
                    .addComponents(new ButtonBuilder()
                        .setCustomId('ticketclose')
                        .setLabel('❌ Close ticket')
                        .setStyle(ButtonStyle.Primary));
                channel.send({
                    embeds: [EmbedExplain],
                    components: [Buttons]
                });
                let addonname = '';
                let licensed = false;
                await axios.get(`${APIENDPOINT}web/addons/getone?id=${customId.split('-')[1]}}`)
                    .then((response) => response.data.data)
                    .then((data) => {
                        addonname = data.name;
                        licensed = data.licensed;
                    })
                    .catch((error) => {
                        console.log(error);
                        interaction.reply({content: 'Error', ephemeral: true});
                    });
                const subject = `Discord ${member.user.username} - ${addonname}`;
                const panelVersion = interaction.fields.getTextInputValue('panelVersion');
                const wingsVersion = interaction.fields.getTextInputValue('wingsVersion');
                const logsUrl = interaction.fields.getTextInputValue('logs');
                const message = `${member.user.username} - ${addonname} \nPanel version: ${panelVersion}\n Wings version: ${wingsVersion}\n${interaction.fields.getTextInputValue('messageInput')}`;
                // eslint-disable-next-line no-ternary
                const license = licensed
                    ? interaction.fields.getTextInputValue('licenseInput')
                    : 'Unlicensed';
                const discordId = channel.id;
                const discordUserId = member.id;
                const data = {
                    subject,
                    'logs_url': logsUrl,
                    message,
                    license,
                    'discord_id': discordId,
                    'discord_user_id': discordUserId
                };
                await axios.post(`${APIENDPOINT}web/tickets`, data, {
                    headers: {
                        Authorization: `Bearer ${process.env.APIKEY}`
                    }
                }).catch((error) => {
                    console.log(error);
                    interaction.reply({content: 'Error', ephemeral: true});
                });
                await channel.send({content: message});
                await channel.send({content: `${member} here is your ticket`})
                    .then((ma) => {
                        setTimeout(() => {
                            // eslint-disable-next-line no-empty-function
                            ma.delete()
                                .catch(() => {
                                });
                        }, 2000);
                    });


            });

    }
};