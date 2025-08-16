const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
    name: "softban",
    description: "Softban (ban + unban om berichten te verwijderen)",
    options: [
        {
            name: "gebruiker",
            type: 6,
            description: "Wie wil je softbannen?",
            required: true
        },
        {
            name: "reden",
            type: 3,
            description: "Reden van de softban",
            required: false
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "❌ Je hebt hier geen rechten voor!", ephemeral: true });
        }

        const gebruiker = interaction.options.getUser("gebruiker");
        const reden = interaction.options.getString("reden") || "Geen reden opgegeven";

        await interaction.guild.members.ban(gebruiker.id, { days: 1, reason: reden });
        await interaction.guild.members.unban(gebruiker.id);

        const embed = new EmbedBuilder()
            .setTitle("🧹 Softban uitgevoerd")
            .setColor("Purple")
            .addFields(
                { name: "👤 Gebruiker", value: `${gebruiker}`, inline: true },
                { name: "📋 Reden", value: reden, inline: true }
            );

        await interaction.reply({ embeds: [embed] });

        logger.info(`${interaction.user.tag} softban ${gebruiker.tag}: ${reden}`);
    }
};
