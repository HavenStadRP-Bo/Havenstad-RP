const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
    name: "kick",
    description: "Kick een gebruiker uit de server",
    options: [
        {
            name: "gebruiker",
            type: 6,
            description: "Wie wil je kicken?",
            required: true
        },
        {
            name: "reden",
            type: 3,
            description: "Reden van de kick",
            required: false
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "❌ Je hebt hier geen rechten voor!", ephemeral: true });
        }

        const gebruiker = interaction.options.getUser("gebruiker");
        const reden = interaction.options.getString("reden") || "Geen reden opgegeven";

        const member = await interaction.guild.members.fetch(gebruiker.id).catch(() => null);
        if (!member) return interaction.reply({ content: "❌ Gebruiker niet gevonden.", ephemeral: true });

        await member.kick(reden);

        const embed = new EmbedBuilder()
            .setTitle("👢 Kick uitgevoerd")
            .setColor("Orange")
            .addFields(
                { name: "👤 Gebruiker", value: `${gebruiker}`, inline: true },
                { name: "📋 Reden", value: reden, inline: true },
                { name: "👮 Moderator", value: interaction.user.tag, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        logger.info(`${interaction.user.tag} kickte ${gebruiker.tag}: ${reden}`);
    }
};
