require('dotenv').config();
const {StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextInputStyle, ModalBuilder, TextInputBuilder,
    ActionRowBuilder} = require('discord.js');
const DB = require('../../schemas/Ticket');
const EVERYONEID = process.env.EVERYONE_ID;
const TICKETCATID = process.env.TICKETCATID;
const APIENDPOINT = process.env.APIURL;

const axios = require('axios');

module.exports = {
    name: 'interactionCreate',
    description: 'Ticket',

    async execute (interaction) {
        if (!interaction.isStringSelectMenu()) {
            return;
        }

        const {customId} = interaction;
        if (!['ticketmenu'].includes(customId)) {
            return;
        }
        const addon = interaction.values[0];
        if (addon.startsWith('next') || addon.startsWith('previous')) {
            const page = addon.charAt(addon.length - 1);
            // Create the modal
            const select = new StringSelectMenuBuilder()
                .setCustomId('ticketmenu')
                .setPlaceholder('Select the relevant add-on.:');
            if (parseInt(String(page), 10) !== 1) {
                select.addOptions(new StringSelectMenuOptionBuilder().setLabel('⬅️ Previous page')
                    .setValue(`previous${page - 1}`));
            }
            let totalpage = -1;
            await axios.get(`${APIENDPOINT}web/addons/get?page=${page}&search=&perpage=23`)
                .then((response) => response.data)
                .then((data) => {
                    totalpage = data.totalpage;
                    const addonlist = data.data;
                    Object.keys(addonlist).forEach((key) => {
                        const name = addonlist[key].name;
                        const desc = addonlist[key].tag;
                        select.addOptions(new StringSelectMenuOptionBuilder().setLabel(name)
                            .setDescription(desc)
                            .setValue(String(addonlist[key].id)));
                    });
                })
                .catch((error) => console.log(error));
            if (totalpage === -1) {
                await interaction.reply({content: 'Error', ephemeral: true});
                return;
            }
            if (page === totalpage) {
                select.addOptions(new StringSelectMenuOptionBuilder()
                    .setLabel('Other')
                    .setDescription('Another addon than listed addons.')
                    .setValue('other'));
            } else if (totalpage > page) {
                select.addOptions(new StringSelectMenuOptionBuilder()
                    .setLabel('Next page ➡️')
                    .setValue(`next${page + 1}`));
            }

            const row = new ActionRowBuilder()
                .addComponents(select);

            await interaction.reply({
                content: 'Please select the relevant add-on!',
                components: [row],
                ephemeral: true
            });
            return;
        }
        let addonname = '';
        let licensed = false;
        await axios.get(`${APIENDPOINT}web/addons/getone?id=${addon}`)
            .then((response) => response.data.data)
            .then((data) => {
                addonname = data.name;
                licensed = data.licensed;
            })
            .catch((error) => {
                console.log(error);
                interaction.reply({content: 'Error', ephemeral: true});
            });
        // Create the modal
        let name = `Create new ticket about ${addonname}`;
        if (name.length > 45) {
            name = 'Create new ticket'
        }
        const modal = new ModalBuilder()
            .setCustomId(`ticketModal-${addon}`)
            .setTitle(name);

        // Add components to modal

        // Create the text input components
        const panelVersionInput = new TextInputBuilder()
            .setCustomId('panelVersion')
            // The label is the prompt the user sees for this input
            .setLabel('What is your panel version?')
            .setRequired()
            .setMaxLength(8)
            .setMinLength(5)
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);


        const wingsVersionInput = new TextInputBuilder()
            .setCustomId('wingsVersion')
            // The label is the prompt the user sees for this input
            .setLabel('What is your wings version?')
            .setRequired()
            .setMaxLength(8)
            .setMinLength(5)
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

        const logsUrl = new TextInputBuilder()
            .setCustomId('logs')
            .setLabel('Provide your logs here?')
            .setPlaceholder('tail -n 150 /var/www/pterodactyl/storage/logs/laravel-$(date +%F).log | nc pteropaste.com 99')
            .setStyle(TextInputStyle.Short);

        const messageInput = new TextInputBuilder()
            .setCustomId('messageInput')
            .setLabel('Ask your question here:')
            .setRequired()
            .setMaxLength(2000)
            .setMinLength(20)
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Paragraph);


        const panelVersionRow = new ActionRowBuilder().addComponents(panelVersionInput);
        const messageRow = new ActionRowBuilder().addComponents(messageInput);
        const wingsVersionRow = new ActionRowBuilder().addComponents(wingsVersionInput);
        const logsUrlRow = new ActionRowBuilder().addComponents(logsUrl);

        modal.addComponents(panelVersionRow, wingsVersionRow, messageRow, logsUrlRow);
        if (licensed) {


            const licenseInput = new TextInputBuilder()
                .setCustomId('licenseInput')
                .setMaxLength(256)
                .setMinLength(5)
                // The label is the prompt the user sees for this input
                .setLabel('What is your addon license/order id?')
                // Short means only a single line of text

                .setStyle(TextInputStyle.Short);
            modal.addComponents(new ActionRowBuilder().addComponents(licenseInput));

        }
        await interaction.showModal(modal);
    }
};