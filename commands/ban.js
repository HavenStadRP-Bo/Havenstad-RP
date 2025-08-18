import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { hasModPermission } from '../utils/permissions.js';

export const data = new SlashCommandBuilder()
  .setName('ban')
  .setDescription('Verban een gebruiker')
  .addUserOption(option =>
    option.setName('target')
      .setDescription('Wie wil je bannen?')
      .setRequired(true)
  );

export async function execute(interaction) {
  if (!hasModPermission(interaction.member)) {
    return await interaction.reply({ content: '❌ Je hebt hier geen permissie voor.', ephemeral: true });
  }

  const user = interaction.options.getUser('target');
  const member = await interaction.guild.members.fetch(user.id);

  try {
    await member.ban();
    await interaction.reply(`✅ ${user.tag} is verbannen.`);
  } catch (error) {
    await interaction.reply(`❌ Fout bij bannen: ${error.message}`);
  }
}
