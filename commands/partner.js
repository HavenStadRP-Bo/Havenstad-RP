const { EmbedBuilder } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
    name: "partner",
    description: "Stuur een partnerbericht",
    options: [
        {
            name: "bericht",
            type: 3,
            description: "Wat wil je posten?",
            required: true
        }
    ],

    run: async (client, interaction) => {
        const tekst = interaction.options.getString("bericht");
        const partnerKanaal = "1406025919499337728";

        const embed = new EmbedBuilder()
            .setTitle("🤝 Nieuwe Partner!")
            .setDescription(tekst)
            .setColor("Blue")
            .setTimestamp();

        const channel = client.channels.cache.get(partnerKanaal);
        if (!channel) return interaction.reply({ content: "❌ Kanaal niet gevonden.", ephemeral: true });

        await channel.send({ embeds: [embed] });
        await interaction.reply({ content: "✅ Partnerbericht verzonden!", ephemeral: true });

        logger.info(`${interaction.user.tag} stuurde partnerbericht`);
    }
};
