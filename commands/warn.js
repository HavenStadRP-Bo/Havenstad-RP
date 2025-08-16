const fs = require("fs");
const path = require("path");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const logger = require("../utils/logger");

const warnsPath = path.join(__dirname, "../data/warns.json");

module.exports = {
    name: "warn",
    description: "Waarschuw een gebruiker",
    options: [
        {
            name: "gebruiker",
            type: 6, // USER
            description: "Wie wil je waarschuwen?",
            required: true
        },
        {
            name: "reden",
            type: 3, // STRING
            description: "Waarom krijgt deze gebruiker een waarschuwing?",
            required: true
        }
    ],

    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "❌ Je hebt hier geen rechten voor!", ephemeral: true });
        }

        const gebruiker = interaction.options.getUser("gebruiker");
        const reden = interaction.options.getString("reden");

        let warns = {};
        if (fs.existsSync(warnsPath)) {
            warns = JSON.parse(fs.readFileSync(warnsPath));
        }

        if (!warns[gebruiker.id]) warns[gebruiker.id] = [];
        warns[gebruiker.id].push({
            moderator: interaction.user.tag,
            reden,
            tijd: new Date().toISOString()
        });

        fs.writeFileSync(warnsPath, JSON.stringify(warns, null, 2));

        const embed = new EmbedBuilder()
            .setTitle("⚠️ Waarschuwing toegevoegd")
            .setColor("Yellow")
            .addFields(
                { name: "👤 Gebruiker", value: `${gebruiker}`, inline: true },
                { name: "📋 Reden", value: reden, inline: true },
                { name: "👮 Moderator", value: interaction.user.tag, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });

        logger.info(`${interaction.user.tag} gaf een warn aan ${gebruiker.tag}: ${reden}`);
    }
};
