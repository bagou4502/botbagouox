const {MessageEmbed} = require('discord.js');
class myembed {
    static embed (title, commandname, pteroid, price, description) {
        const returned = new MessageEmbed().setColor('#7CCB86')
            .setAuthor(title.charAt(0).toUpperCase() + title.slice(1), `https://pterodactylmarket.com/images/resources/${pteroid}.webp`, `https://pterodactylmarket.com/resource/${pteroid}`)
            .setURL(`https://bagou450.com/bot/${commandname}.html`)
            .setThumbnail(`https://pterodactylmarket.com/images/resources/${pteroid}.webp`)
            .addFields(
                {inline: true, name: `Link of ${title} addon  `, value: `[Here](https://pterodactylmarket.com/resource/${pteroid})`},
                {inline: true, name: ' Price: ', value: price},
                {inline: false, name: 'Description', value: description},
                {inline: true, name: 'You can see my test panel here', value: '[Here](https://demo.bagou450.com)'}
            )
            .setTimestamp()
            .setFooter('Bagou450', 'https://cdn.discordapp.com/attachments/751908883005440071/924077222497775686/b5cc2146f6f5326025aac4bee011d70c.png');
        return returned;
    }
}
module.exports.embed = myembed;