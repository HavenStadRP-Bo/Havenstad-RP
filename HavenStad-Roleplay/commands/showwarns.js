const fs = require("fs");
const path = require("path");
const { EmbedBuilder } = require("discord.js");

const warnsPath = path.join(__dirname, "../data/warns.json");

module.exports = {
    name: "showwarns",
    description: "Bekijk alle waarschuwingen van een gebruiker",
    options: [
        {
            name: "gebruiker",
            type: 6,
            description: "Van wie wil je de waarschuwingen zien?",
            required: true
        }
    ],

    run: async (client, interaction) => {
        const gebruiker = interaction.options.getUser("gebruiker");

        if (!fs.existsSync(warnsPath)) {
            return interaction.reply({ content: "❌ Er zijn nog geen waarschuwingen opgeslagen.", ephemeral: true });
        }

        const warns = JSON.parse(fs.readFileSync(warnsPath));
        const userWarns = warns[gebruiker.id] || [];

        if (userWarns.length === 0) {
            return interaction.reply({ content: "✅ Deze gebruiker heeft geen waarschuwingen.", ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle(`📋 Waarschuwingen van ${gebruiker.tag}`)
            .setColor("Orange")
            .setDescription(
                userWarns.map((w, i) => 
                    `**#${i+1}** - ${w.reden}\n👮 Door: ${w.moderator}\n🕒 ${w.tijd}`
                ).join("\n\n")
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
