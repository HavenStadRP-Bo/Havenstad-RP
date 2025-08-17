import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick een gebruiker')
  .addUserOption(option =>
    option.setName('gebruiker')
      .setDescription('De gebruiker die je wilt kicken')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('reden')
      .setDescription('De reden van de kick')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers);

export async function execute(interaction) {
  const user = interaction.options.getUser('gebruiker');
  const reden = interaction.options.getString('reden') || 'Geen reden opgegeven';

  const member = await interaction.guild.members.fetch(user.id).catch(() => null);

  if (!member) {
    await interaction.reply(`❌ Kon ${user.tag} niet vinden.`);
    return;
  }

  await member.kick(reden);
  await interaction.reply(`👢 ${user.tag} is gekickt. Reden: ${reden}`);
}
