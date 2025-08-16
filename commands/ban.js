const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
    name: "ban",
    description: "Verban een gebruiker uit de server",
    options: [
        {
            name: "gebruiker",
            type: 6, // USER
            description: "Wie wil je bannen?",
            required: true
        },
        {
            name: "reden",
            type: 3, // STRING
            description: "Reden van de ban",
            required: false
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "❌ Je hebt hier geen rechten voor!", ephemeral: true });
        }

        const gebruiker = interaction.options.getUser("gebruiker");
        const reden = interaction.options.getString("reden") || "Geen reden opgegeven";

        const member = await interaction.guild.members.fetch(gebruiker.id).catch(() => null);
        if (!member) return interaction.reply({ content: "❌ Gebruiker niet gevonden.", ephemeral: true });

        await member.ban({ reason: reden });

        const embed = new EmbedBuilder()
            .setTitle("🔨 Ban uitgevoerd")
            .setColor("Red")
            .addFields(
                { name: "👤 Gebruiker", value: `${gebruiker}`, inline: true },
                { name: "📋 Reden", value: reden, inline: true },
                { name: "👮 Moderator", value: interaction.user.tag, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        logger.info(`${interaction.user.tag} bannede ${gebruiker.tag}: ${reden}`);
    }
};
