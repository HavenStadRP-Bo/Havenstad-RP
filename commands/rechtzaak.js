// commands/rechtzaak.js
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('rechtzaak')
  .setDescription('⚖️ Start een rechtzaak')
  .addStringOption(opt => opt.setName('jouwnaam').setDescription('Jouw naam').setRequired(true))
  .addStringOption(opt => opt.setName('verdachte').setDescription('Naam van verdachte').setRequired(true))
  .addStringOption(opt => opt.setName('reden').setDescription('Reden').setRequired(true))
  .addStringOption(opt => opt.setName('advocaat').setDescription('Naam advocaat').setRequired(true))
  .addStringOption(opt => opt.setName('type').setDescription('voice of text').setRequired(true).addChoices(
    { name: 'Voice', value: 'voice' },
    { name: 'Text', value: 'text' }
  ));

export async function execute(interaction) {
  const jouw = interaction.options.getString('jouwnaam');
  const verdachte = interaction.options.getString('verdachte');
  const reden = interaction.options.getString('reden');
  const advocaat = interaction.options.getString('advocaat');
  const type = interaction.options.getString('type');
  const categoryId = '1406026219966693558';

  let channel;
  if (type === 'voice') {
    channel = await interaction.guild.channels.create({
      name: `rechtzaak-${jouw}-${verdachte}`,
      type: 2,
      parent: categoryId
    });
  } else {
    channel = await interaction.guild.channels.create({
      name: `rechtzaak-${jouw}-${verdachte}`,
      type: 0,
      parent: categoryId
    });
  }

  await interaction.reply(`✅ Rechtzaak gestart in ${channel}`);
}
