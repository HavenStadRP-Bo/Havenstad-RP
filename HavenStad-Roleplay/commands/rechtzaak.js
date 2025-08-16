const { ChannelType, PermissionsBitField } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
    name: "rechtzaak",
    description: "Maak een rechtzaak kanaal aan",
    options: [
        {
            name: "naam",
            type: 3, // STRING
            description: "Naam van de rechtzaak",
            required: true
        },
        {
            name: "type",
            type: 3,
            description: "Kies: tekst of voice",
            required: true,
            choices: [
                { name: "Tekst", value: "text" },
                { name: "Voice", value: "voice" }
            ]
        },
        {
            name: "persoon1",
            type: 6, // USER
            description: "Eerste persoon",
            required: true
        },
        {
            name: "persoon2",
            type: 6, // USER
            description: "Tweede persoon",
            required: true
        }
    ],

    run: async (client, interaction) => {
        const naam = interaction.options.getString("naam");
        const type = interaction.options.getString("type");
        const persoon1 = interaction.options.getUser("persoon1");
        const persoon2 = interaction.options.getUser("persoon2");

        const rechterRol = "1404873533951312024"; // rechter rol ID
        const category = "1406026219966693558"; // category ID

        const permissions = [
            { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
            { id: persoon1.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.Connect] },
            { id: persoon2.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.Connect] },
            { id: rechterRol, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.Connect] }
        ];

        let channel;
        if (type === "text") {
            channel = await interaction.guild.channels.create({
                name: `rechtzaak-${naam}`,
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: permissions
            });
        } else {
            channel = await interaction.guild.channels.create({
                name: `rechtzaak-${naam}`,
                type: ChannelType.GuildVoice,
                parent: category,
                permissionOverwrites: permissions
            });
        }

        await interaction.reply({ content: `✅ Rechtzaak kanaal aangemaakt: ${channel}`, ephemeral: true });
        logger.info(`${interaction.user.tag} maakte rechtzaak: ${naam}`);
    }
};
