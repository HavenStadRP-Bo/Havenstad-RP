import { SlashCommandBuilder } from 'discord.js';
import { hasModPermission } from '../utils/permissions.js';

export const data = new SlashCommandBuilder()
  .setName('showwarns')
  .setDescription('Bekijk waarschuwingen van een gebruiker')
  .addUserOption(opt => opt.setName('target').setDescription('Gebruiker').setRequired(true));

export async function execute(interaction) {
  if (!hasModPermission(interaction.member)) {
    return interaction.reply({ content: '❌ Geen permissie.', ephemeral: true });
  }
  const user = interaction.options.getUser('target');
  await interaction.reply(`📜 Waarschuwingen van ${user.tag}: (hier komt db).`);
}
