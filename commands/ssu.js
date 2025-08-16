const { EmbedBuilder } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
    name: "ssu",
    description: "Start of stop een SSU (Server Startup)",
    options: [
        {
            name: "actie",
            type: 3,
            description: "Kies start of stop",
            required: true,
            choices: [
                { name: "Start", value: "start" },
                { name: "Stop", value: "stop" }
            ]
        }
    ],

    run: async (client, interaction) => {
        const actie = interaction.options.getString("actie");
        const ssuPing = "<@&1404867280546041986>"; // SSU ping rol
        const ssuKanaal = "1404865394094637227"; // SSU kanaal ID
        const channel = client.channels.cache.get(ssuKanaal);

        if (!channel) return interaction.reply({ content: "❌ Kanaal niet gevonden.", ephemeral: true });

        let embed;

        if (actie === "start") {
            embed = new EmbedBuilder()
                .setTitle("🌴 HavenStad Roleplay - Server Start!")
                .setDescription(
                    `${ssuPing}\n\n**Onze in-game server is nu aan het opstarten!** 🎉\n\n` +
                    "🔹 Zorg dat je alvast klaarzit om te joinen.\n" +
                    "🔹 Houd je aan de regels en roleplay serieus.\n\n" +
                    "**Klik hieronder om direct te joinen:**\n[✨ Klik hier om te verbinden](https://roblox.com)"
                )
                .setColor("Green")
                .setImage("https://media.discordapp.net/attachments/1394316929518272512/1406159811480915978/image.png") // banner start
                .setTimestamp()
                .setFooter({ text: "Veel plezier met roleplay in HavenStad!" });
        }

        if (actie === "stop") {
            embed = new EmbedBuilder()
                .setTitle("⛔ HavenStad Roleplay - Server Gesloten")
                .setDescription(
                    "**De server is momenteel gesloten.**\n\n" +
                    "❌ Er is op dit moment geen staff actief.\n" +
                    "✅ Je kunt nog steeds joinen, maar roleplay kan beperkt zijn.\n\n" +
                    "**Klik hieronder om alsnog te verbinden:**\n[✨ Klik hier om te verbinden](https://roblox.com)\n\n" +
                    "ℹ️ Houd onze Discord in de gaten voor de volgende SSU!"
                )
                .setColor("#8B0000") // donkerrood
                .setImage("https://media.discordapp.net/attachments/1394316929518272512/1406159811804139530/image_1.png") // banner stop
                .setTimestamp()
                .setFooter({ text: "Bedankt voor het spelen in HavenStad Roleplay!" });
        }

        await channel.send({ content: ssuPing, embeds: [embed] });
        await interaction.reply({ content: `✅ ${actie === "start" ? "SSU gestart" : "SSU gestopt"}!`, ephemeral: true });

        logger.info(`${interaction.user.tag} voerde /ssu ${actie} uit`);
    }
};
