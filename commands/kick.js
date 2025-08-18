import { SlashCommandBuilder } from 'discord.js';
import { hasModPermission } from '../utils/permissions.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick een gebruiker')
  .addUserOption(opt => opt.setName('target').setDescription('Gebruiker').setRequired(true));

export async function execute(interaction) {
  if (!hasModPermission(interaction.member)) {
    return interaction.reply({ content: '❌ Geen permissie.', ephemeral: true });
  }
  const user = interaction.options.getUser('target');
  const member = await interaction.guild.members.fetch(user.id);
  await member.kick();
  await interaction.reply(`✅ ${user.tag} is gekickt.`);
}
