// commands/mute.js
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('mute')
  .setDescription('🔇 Mute een gebruiker')
  .addUserOption(opt => opt.setName('gebruiker').setDescription('De gebruiker').setRequired(true))
  .addIntegerOption(opt => opt.setName('duur').setDescription('Duur in minuten').setRequired(true))
  .addStringOption(opt => opt.setName('reden').setDescription('Reden'))
  .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers);

export async function execute(interaction) {
  const user = interaction.options.getUser('gebruiker');
  const duur = interaction.options.getInteger('duur');
  const reden = interaction.options.getString('reden') || 'Geen reden';
  const member = await interaction.guild.members.fetch(user.id).catch(() => null);

  if (!member) return interaction.reply('❌ Gebruiker niet gevonden.');
  await member.timeout(duur * 60 * 1000, reden);
  await interaction.reply(`✅ ${user.tag} is gemute voor ${duur} minuten. Reden: ${reden}`);
}
