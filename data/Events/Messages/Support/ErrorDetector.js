require('dotenv').config();
const {MessageEmbed} = require('discord.js');
const {v4} = require('uuid');
const https = require('https');
const fs = require('fs');
const ReadText = require('text-from-image')
const Tesseract = require('tesseract.js');

module.exports = {
    name: 'messageCreate',
    description: 'messageCreate',

    async execute (interaction) {
        const {content, author, guild, channel, attachments} = interaction;
        let attachment = '';
        let imageurl = '';
        let nb = 0;
        let data = content;
        attachments.forEach(async (atta) => {
            nb += 1;
            attachment += `[Attachement ${nb}](${atta.attachment}), Type: ${atta.contentType}\n `;

            if (atta.contentType.startsWith('image')) {
                const name = v4();
                Tesseract.recognize(
                    atta.url,
                    'eng',
                  ).then(({ data: { text } }) => {
                    data = text
                    console.log(data);
            if(data.includes("Argunent of type 'AciosProgressEvent! is not assignable to parameter of type 'ProgressEvent<EventTarget>") || data.includes("Argument of type 'AxiosProgressEvent' is not assignable to parameter of type 'ProgressEvent<EventTarget>") || data.includes('alploadProgress: (daca) => cnploadProgress (data, file.nane')) {
                        const embed = new MessageEmbed()
                                        .setTitle('Knowed error detected')
                                        .setDescription('My circuit detected a error that i know for resolve it please upload this file (https://cdn.bagou450.com/botfiles/UploadButton.tsx) to resources/scripts/components/server/files folder!\n **If you are in a ticket and if this resolved your error please close the ticket with the "Close ticket" button above** ')
                                        .setTimestamp()
                                        .setColor('PURPLE')
                                        .setAuthor('Bagouox', 'https://cdn.bagou450.com/botfiles/bot_2.png');
                        interaction.reply({embeds: [embed]})
                    }
                    if(data.includes("ERROR in resources/scripts/routers/ServerRouter.tsx")) {
                        const embed = new MessageEmbed()
                                        .setTitle('Knowed error detected')
                                        .setDescription('My circuit detected a error that i know for resolve it please upload this file (https://cdn.bagou450.com/botfiles/ServerRouter.tsx) to resources/scripts/components/server/files folder!\n **If you are in a ticket and if this resolved your error please close the ticket with the "Close ticket" button above** ')
                                        .setTimestamp()
                                        .setColor('PURPLE')
                                        .setAuthor('Bagouox', 'https://cdn.bagou450.com/botfiles/bot_2.png');
                        interaction.reply({embeds: [embed]})
                    }
                    if(data.includes("Duplicate identifier 'nestId'.") || data.includes("Duplicate identifier 'nestld'.") || data.includes("Duplicate identifier 'eggId'.") || data.includes("Duplicate identifier 'eggld'.") || data.includes("Duplicate identifier 'nestld’.") || data.includes("Duplicate identifier ’nestld'.") || data.includes("Duplicate identifier ’nestld’.") || data.includes("Duplicate identifier 'eggId’.") || data.includes("Duplicate identifier ’eggId'.") || data.includes("Duplicate identifier ’eggId’.") ) {
                        const embed = new MessageEmbed()
                                        .setTitle('Knowed error detected')
                                        .setDescription('My circuit detected a error that i know for resolve it please upload this file (https://cdn.bagou450.com/botfiles/getServer.ts) to resources/scripts/api/server folder!\n **If you are in a ticket and if this resolved your error please close the ticket with the "Close ticket" button above** ')
                                        .setTimestamp()
                                        .setColor('PURPLE')
                                        .setAuthor('Bagouox', 'https://cdn.bagou450.com/botfiles/bot_2.png');
                        interaction.reply({embeds: [embed]})
                    }
               if(data.includes("does not exist on type 'ServerRouteDefinition'")) {
                const embed = new MessageEmbed()
                                .setTitle('Knowed error detected')
                               .setDescription('My circuit detected a error that i know how to resolve.\n Please open "resources/scripts/routers/routes.ts" file and under "permission?: string | string[];" add: \n\n nestId?: number;\n nestIds?: number[];\n eggId?: number;\n eggIds?: number[];\n\n **If you are in a ticket and if this resolved your error please close the ticket with the "Close ticket" button above** ')
                                .setTimestamp()
                                .setColor('PURPLE')
                                .setAuthor('Bagouox', 'https://cdn.bagou450.com/botfiles/bot_2.png');
                interaction.reply({embeds: [embed]})
            }
                        if(data.includes("View [admin.bagoucenter.license.index] not found.")) {
                const embed = new MessageEmbed()
                                .setTitle('Knowed error detected')
                               .setDescription('My circuit detected a error that i know how to resolve.\n Please just do `php artisan optimize && php artisan migrate` in pterodactyl folder\n\n **If you are in a ticket and if this resolved your error please close the ticket with the "Close ticket" button above** ')
                                .setTimestamp()
                                .setColor('PURPLE')
                                .setAuthor('Bagouox', 'https://cdn.bagou450.com/botfiles/bot_2.png');
                interaction.reply({embeds: [embed]})
            }
                  })
                
            }
        });
           data = content;
 if(data.includes("Argunent of type 'AciosProgressEvent! is not assignable to parameter of type 'ProgressEvent<EventTarget>") || data.includes("Argument of type 'AxiosProgressEvent' is not assignable to parameter of type 'ProgressEvent<EventTarget>")  || data.includes('alploadProgress: (daca) => cnploadProgress (data, file.nane')) {
     const embed = new MessageEmbed()
                                .setTitle('Knowed error detected')
                                .setDescription('My circuit detected a error that i know for resolve it please upload this file (https://cdn.bagou450.com/botfiles/UploadButton.tsx) to resources/scripts/components/server/files folder!\n **If you are in a ticket and if this resolved your error please close the ticket with the "Close ticket" button above** ')
                                .setTimestamp()
                                .setColor('PURPLE')
                                .setAuthor('Bagouox', 'https://cdn.bagou450.com/botfiles/bot_2.png');
                interaction.reply({embeds: [embed]})
            }
            if(data.includes("ERROR in resources/scripts/routers/ServerRouter.tsx")) {
                const embed = new MessageEmbed()
                                .setTitle('Knowed error detected')
                                .setDescription('My circuit detected a error that i know for resolve it please upload this file (https://cdn.bagou450.com/botfiles/ServerRouter.tsx) to resources/scripts/components/server/files folder!\n **If you are in a ticket and if this resolved your error please close the ticket with the "Close ticket" button above** ')
                                .setTimestamp()
                                .setColor('PURPLE')
                                .setAuthor('Bagouox', 'https://cdn.bagou450.com/botfiles/bot_2.png');
                interaction.reply({embeds: [embed]})
            }
            if(data.includes("Duplicate identifier 'nestId'") || data.includes("Duplicate identifier 'nestld'") || data.includes("Duplicate identifier 'eggId'") || data.includes("Duplicate identifier 'eggld'")) {
                const embed = new MessageEmbed()
                                .setTitle('Knowed error detected')
                                .setDescription('My circuit detected a error that i know for resolve it please upload this file (https://cdn.bagou450.com/botfiles/getServer.ts) to resources/scripts/api/server folder!\n **If you are in a ticket and if this resolved your error please close the ticket with the "Close ticket" button above** ')
                                .setTimestamp()
                                .setColor('PURPLE')
                                .setAuthor('Bagouox', 'https://cdn.bagou450.com/botfiles/bot_2.png');
                interaction.reply({embeds: [embed]})
            }
         if(data.includes("Mcplugins::$validationRules must not be defined")) {
                const embed = new MessageEmbed()
                                .setTitle('Knowed error detected')
                                .setDescription('My circuit detected a error that i know for resolve it please replace in app/Models/McPlugins.php "array $validationRules" by "$validationRules"  \n **If you are in a ticket and if this resolved your error please close the ticket with the "Close ticket" button above** ')
                                .setTimestamp()
                                .setColor('PURPLE')
                                .setAuthor('Bagouox', 'https://cdn.bagou450.com/botfiles/bot_2.png');
                interaction.reply({embeds: [embed]})
            }
        if(data.includes("Bagoulicense::$validationRules must not be defined")) {
                const embed = new MessageEmbed()
                                .setTitle('Knowed error detected')
                                .setDescription('My circuit detected a error that i know for resolve it please replace in app/Models/Bagoulicense.php "array $validationRules" by "$validationRules"  \n **If you are in a ticket and if this resolved your error please close the ticket with the "Close ticket" button above** ')
                                .setTimestamp()
                                .setColor('PURPLE')
                                .setAuthor('Bagouox', 'https://cdn.bagou450.com/botfiles/bot_2.png');
                interaction.reply({embeds: [embed]})
            }
        
         if(data.includes("does not exist on type 'ServerRouteDefinition'")) {
                const embed = new MessageEmbed()
                                .setTitle('Knowed error detected')
                               .setDescription('My circuit detected a error that i know how to resolve.\n Please open "resources/scripts/routers/routes.ts" file and under "permission?: string | string[];" add: \n\n nestId?: number;\n nestIds?: number[];\n eggId?: number;\n eggIds?: number[];\n\n **If you are in a ticket and if this resolved your error please close the ticket with the "Close ticket" button above** ')
                                .setTimestamp()
                                .setColor('PURPLE')
                                .setAuthor('Bagouox', 'https://cdn.bagou450.com/botfiles/bot_2.png');
                interaction.reply({embeds: [embed]})
            }
           if(data.includes("View [admin.bagoucenter.license.index] not found.")) {
                const embed = new MessageEmbed()
                                .setTitle('Knowed error detected')
                               .setDescription('My circuit detected a error that i know how to resolve.\n Please just do `php artisan optimize && php artisan migrate` in pterodactyl folder\n\n **If you are in a ticket and if this resolved your error please close the ticket with the "Close ticket" button above** ')
                                .setTimestamp()
                                .setColor('PURPLE')
                                .setAuthor('Bagouox', 'https://cdn.bagou450.com/botfiles/bot_2.png');
                interaction.reply({embeds: [embed]})
            }
      /*  const embed = new MessageEmbed()
            .setTitle('Un message a été supprimer! ;(')
            .setDescription(`**Message** \n ${content}\n**Attachement:**\n ${attachment}`)
            .addFields({name: 'Utilisateur', value: `<@${author.id}>`, inline: true}, {name: 'Channel', value: `<#${channel.id}>`, inline: true})
            .setTimestamp()
            .setColor('PURPLE')
            .setImage(imageurl)
            .setAuthor('CapriceHost Bot', 'https://cdn.discordapp.com/avatars/808671126112698388/730f58043d3464f7ab985b6b4b759610.png?size=1024');*/
        
    }
};