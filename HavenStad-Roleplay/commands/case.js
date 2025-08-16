const { ChannelType, PermissionFlagsBits } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
    name: "case",
    description: "Maak een privé case channel aan tussen staff en een gebruiker",
    default_member_permissions: PermissionFlagsBits.ModerateMembers,
    options: [
        {
            name: "gebruiker",
            type: 6, // USER
            description: "De gebruiker voor de case",
            required: true,
        }
    ],

    run: async (client, interaction) => {
        const gebruiker = interaction.options.getUser("gebruiker");
        const rechtzaakCat = "1406026219966693558"; // rechtzaak categorie ID

        // Check of gebruiker bestaat
        if (!gebruiker) {
            return interaction.reply({ content: "❌ Ongeldige gebruiker.", ephemeral: true });
        }

        // Channel naam
        const channelName = `case-${gebruiker.username.toLowerCase()}`;

        // Check of er al een case bestaat
        const bestaande = interaction.guild.channels.cache.find(
            c => c.name === channelName && c.parentId === rechtzaakCat
        );
        if (bestaande) {
            return interaction.reply({ content: "❌ Er bestaat al een case voor deze gebruiker.", ephemeral: true });
        }

        // Channel aanmaken
        const caseChannel = await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: rechtzaakCat,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone.id, // iedereen blokkeren
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: gebruiker.id, // gebruiker toegang
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                },
                {
                    id: interaction.user.id, // command uitvoerder toegang
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                },
                {
                    id: "1404873533951312024", // Mod rol 1
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                },
                {
                    id: "1405102488775823430", // Mod rol 2
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                },
                {
                    id: "1406025210527879238", // Mod rol 3
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                }
            ]
        });

        await caseChannel.send(`📂 Case geopend voor ${gebruiker}. Staff kan hier communiceren.`);

        await interaction.reply({ content: `✅ Case aangemaakt: ${caseChannel}`, ephemeral: true });

        logger.info(`/case uitgevoerd door ${interaction.user.tag} voor ${gebruiker.tag}`);
    }
};
