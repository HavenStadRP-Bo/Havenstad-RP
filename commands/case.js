// commands/case.js
import { SlashCommandBuilder, ChannelType } from 'discord.js';
import { hasModPermission } from '../utils/permissions.js';

export const data = new SlashCommandBuilder()
  .setName('case')
  .setDescription('📂 Start een case')
  .addStringOption(opt => 
    opt.setName('naam')
      .setDescription('Naam van de case')
      .setRequired(true)
  );

export async function execute(interaction) {
  if (!hasModPermission(interaction.member)) {
    return interaction.reply({ content: '❌ Geen permissie.', ephemeral: true });
  }

  const naam = interaction.options.getString('naam');
  const categoryId = '1406026219966693558'; // Case category ID

  const channel = await interaction.guild.channels.create({
    name: `case-${naam}`,
    type: ChannelType.GuildText,
    parent: categoryId,
    topic: `Case gestart door ${interaction.user.tag}`
  });

  await interaction.reply(`✅ Case kanaal aangemaakt: ${channel}`);
}
