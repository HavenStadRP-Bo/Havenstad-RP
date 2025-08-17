// commands/softban.js
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('softban')
  .setDescription('🚪 Softban een gebruiker (ban + unban voor schoonmaak)')
  .addUserOption(opt => opt.setName('gebruiker').setDescription('De gebruiker').setRequired(true))
  .addStringOption(opt => opt.setName('reden').setDescription('Reden'))
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers);

export async function execute(interaction) {
  const user = interaction.options.getUser('gebruiker');
  const reason = interaction.options.getString('reden') || 'Geen reden';
  const member = await interaction.guild.members.fetch(user.id).catch(() => null);

  if (!member) return interaction.reply('❌ Gebruiker niet gevonden.');

  // Ban
  await member.ban({ days: 1, reason });
  // Unban
  await interaction.guild.members.unban(user.id, 'Softban reset');

  await interaction.reply(`✅ ${user.tag} is softbanned (ban + unban). Reden: ${reason}`);
}
