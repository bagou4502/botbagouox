/* eslint-disable prefer-arrow-callback */
/* eslint-disable default-case */
/* eslint-disable no-case-declarations */
/* eslint-disable no-undef */
require('dotenv').config();
// eslint-disable-next-line no-unused-vars
const {ButtonInteraction, MessageEmbed,
    StringSelectMenuOptionBuilder
} = require('discord.js');
const DB = require('../../schemas/Ticket');
const DBTRANSCRIPT = require('../../schemas/Transcription');
const TRANSCRIPTIONID = process.env.TRANSCRIPTID;
const log = require('../../../libs/logger').log;
const {v4} = require('uuid');
const {createTranscript} = require('discord-html-transcripts');
const Client = require('ssh2-sftp-client');
const fs = require('fs');
const axios = require('axios');
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
        const id = channel.name.split('-')[1]
        await axios.post(`${process.env.APIURL}web/tickets/${id}/status`, {'status': 'closed'}, {
            headers: {
                Authorization: `Bearer ${process.env.APIKEY}`
            }
        }).catch((error) => console.log(error));
    }
};