import { SlashCommandBuilder } from 'discord.js';
import { hasModPermission } from '../utils/permissions.js';

export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Waarschuw een gebruiker')
  .addUserOption(opt => opt.setName('target').setDescription('Gebruiker').setRequired(true))
  .addStringOption(opt => opt.setName('reden').setDescription('Reden').setRequired(true));

export async function execute(interaction) {
  if (!hasModPermission(interaction.member)) {
    return interaction.reply({ content: '❌ Geen permissie.', ephemeral: true });
  }
  const user = interaction.options.getUser('target');
  const reden = interaction.options.getString('reden');
  await interaction.reply(`⚠️ ${user.tag} is gewaarschuwd. Reden: ${reden}`);
}
