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
        if (!interaction.isButton()) {
            return;
        }
        const {guild, member, customId} = interaction;

        if (!['ticketopen'].includes(customId)) {
            return;
        }
        let page = 1;
        if (customId.charAt(customId.length - 1) !== 'n') {
            page = customId.charAt(customId.length - 1);
        }
        // Create the modal
        const select = new StringSelectMenuBuilder()
            .setCustomId('ticketmenu')
            .setPlaceholder('Select the relevant add-on.:');
        if(page !== 1) {
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
    }
};

