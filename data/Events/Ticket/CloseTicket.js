/* eslint-disable prefer-arrow-callback */
/* eslint-disable default-case */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
require('dotenv').config();
// eslint-disable-next-line no-unused-vars
const {ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton, Interaction} = require('discord.js');
const DB = require('../../schemas/Ticket');
const TRANSCRIPTIONID = process.env.TRANSCRIPTID;
const log = require('../../../libs/logger').log;
const {v4} = require('uuid');
const {createTranscript} = require('discord-html-transcripts');
const ClientFTP = require('basic-ftp');
const fs = require('fs');
module.exports = {
    name: 'interactionCreate',
    description: 'CloseTicket',

    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute (interaction) {
        if (!interaction.isButton()) {
            return;
        }
        const {guild, channel, customId, client} = interaction;
        if (!['ticketclose'].includes(customId)) {
            return;
        }
        const Embed = new MessageEmbed().setColor('BLUE');
        // eslint-disable-next-line consistent-return
        DB.findOne({ChannelID: channel.id}, async (err, docs) => {
            if (err) {
                throw err;
            }
            if (!docs) {
                return interaction.reply({
                    content: 'No data was found please ask a support for delete it',
                    ephemeral: true
                });
            }
            switch (customId) {
            case 'ticketclose':
                if (docs.Closed === true) {
                    return interaction.reply({
                        content: 'This ticket was already closed',
                        ephemeral: true
                    });
                }
                const name = v4();
                const attachement = await createTranscript(channel, {
                    limit: -1,
                    returnBuffer: false,
                    fileName: `${name}.html`
                });
                // eslint-disable-next-line func-names
                fs.writeFile(`./transcripts/${name}.transcripts`, attachement.attachment.toString(), function (errr) {
                    if (errr) {
                        log.err(errr);
                    }
                });
                const clientftp = new ClientFTP.Client();
                try {
                    log.info(`Start upload of ${docs.TicketID} on transcripts server`);
                    await clientftp.access({
                        host: process.env.FTPHOTE,
                        user: process.env.FTPUSER,
                        password: process.env.FTPPASS,
                        secure: false
                    });
                    await clientftp.uploadFrom(`./transcripts/${name}.transcripts`, `${name}.html`);
                    log.info('Uploaded sucessfully');
                } catch (errr) {
                    log.err(errr);
                }
                clientftp.close();
                await DB.updateOne({ChannelID: channel.id}, {Closed: true});
                const MEMBER = guild.members.cache.get(docs.MemberID);
                const Message = await guild.channels.cache.get(TRANSCRIPTIONID).send({
                    embeds: [
                        Embed
                            .setAuthor(MEMBER.user.tag, MEMBER.user.displayAvatarURL({dynamic: true}))
                            .setTitle(`Transcript Type: ${docs.Type}\nID: ${docs.TicketID}`)
                            .setDescription(`[Here](https://transcripts.bagou450.com/data/${name}.html)`)
                    ]
                });
                client.users.fetch(MEMBER.user.id, false).then((userr) => {
                    userr.send({
                        embeds: [
                            Embed
                                .setAuthor(MEMBER.user.tag, MEMBER.user.displayAvatarURL({dynamic: true}))
                                .setTitle(`Your ticket id ${docs.TicketID} has been closed`)
                                .setDescription(`[Click Here](https://transcripts.bagou450.com/data/${name}.html) for see ticket logs`)
                        ]
                    });
                });
                interaction.reply({embeds: [Embed.setDescription(`The transcript is now saved [TRANSCRIPT](${Message.url})`)]});
                setTimeout(() => {
                    channel.delete();
                }, 10000);
            }
        });
    }
};