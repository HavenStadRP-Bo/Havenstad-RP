const { EmbedBuilder } = require("discord.js");

module.exports = {
    success: (title, description) => {
        return new EmbedBuilder()
            .setColor("Green")
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();
    },

    error: (title, description) => {
        return new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle(`❌ ${title}`)
            .setDescription(description)
            .setTimestamp();
    },

    info: (title, description) => {
        return new EmbedBuilder()
            .setColor("Blue")
            .setTitle(title)
            .setDescription(description)
            .setTimestamp();
    },
};
