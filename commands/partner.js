// commands/partner.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('partner')
  .setDescription('🤝 Dien een partnership aanvraag in')
  .addStringOption(opt => opt.setName('naam').setDescription('Jouw servernaam').setRequired(true))
  .addIntegerOption(opt => opt.setName('leden').setDescription('Aantal leden').setRequired(true))
  .addStringOption(opt => opt.setName('reden').setDescription('Waarom wil je partneren?').setRequired(true));

export async function execute(interaction) {
  const naam = interaction.options.getString('naam');
  const leden = interaction.options.getInteger('leden');
  const reden = interaction.options.getString('reden');
  const channel = interaction.guild.channels.cache.get('1406025919499337728');

  const embed = new EmbedBuilder()
    .setColor('Blue')
    .setTitle('🤝 Partner Aanvraag')
    .addFields(
      { name: 'Servernaam', value: naam, inline: true },
      { name: 'Aantal leden', value: leden.toString(), inline: true },
      { name: 'Waarom', value: reden, inline: false }
    );

  await channel.send({ embeds: [embed] });
  await interaction.reply('✅ Je partneraanvraag is verzonden!');
}
