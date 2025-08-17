// commands/case.js
import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('case')
  .setDescription('📂 Start een case')
  .addStringOption(opt => opt.setName('naam').setDescription('Naam van de case').setRequired(true));

export async function execute(interaction) {
  const naam = interaction.options.getString('naam');
  const categoryId = '1406026219966693558';

  const channel = await interaction.guild.channels.create({
    name: `case-${naam}`,
    type: 0,
    parent: categoryId
  });

  await interaction.reply(`✅ Case kanaal aangemaakt: ${channel}`);
}
