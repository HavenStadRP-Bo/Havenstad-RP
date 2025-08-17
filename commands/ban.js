import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Ban een gebruiker')
  .addUserOption(option =>
    option.setName('gebruiker')
      .setDescription('De gebruiker die je wilt bannen')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('reden')
      .setDescription('De reden van de ban')
      .setRequired(false))
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export async function execute(interaction) {
  const user = interaction.options.getUser('gebruiker');
  const reden = interaction.options.getString('reden') || 'Geen reden opgegeven';

  const member = await interaction.guild.members.fetch(user.id).catch(() => null);

  if (!member) {
    await interaction.reply(`❌ Kon ${user.tag} niet vinden.`);
    return;
  }

  await member.ban({ reason: reden });
  await interaction.reply(`⛔ ${user.tag} is geband. Reden: ${reden}`);
}
