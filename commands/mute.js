const { PermissionsBitField, EmbedBuilder } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
    name: "mute",
    description: "Mute een gebruiker",
    options: [
        {
            name: "gebruiker",
            type: 6,
            description: "Wie wil je muten?",
            required: true
        },
        {
            name: "reden",
            type: 3,
            description: "Reden van de mute",
            required: false
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "❌ Je hebt hier geen rechten voor!", ephemeral: true });
        }

        const gebruiker = interaction.options.getUser("gebruiker");
        const reden = interaction.options.getString("reden") || "Geen reden opgegeven";

        const member = await interaction.guild.members.fetch(gebruiker.id).catch(() => null);
        if (!member) return interaction.reply({ content: "❌ Gebruiker niet gevonden.", ephemeral: true });

        await member.timeout(60 * 60 * 1000, reden); // mute 1 uur

        const embed = new EmbedBuilder()
            .setTitle("🔇 Gebruiker gemute")
            .setColor("Grey")
            .addFields(
                { name: "👤 Gebruiker", value: `${gebruiker}`, inline: true },
                { name: "📋 Reden", value: reden, inline: true },
                { name: "⏰ Duur", value: "1 uur", inline: true }
            );

        await interaction.reply({ embeds: [embed] });

        logger.info(`${interaction.user.tag} mute ${gebruiker.tag}: ${reden}`);
    }
};
