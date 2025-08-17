// commands/report.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'fs';

export const data = new SlashCommandBuilder()
  .setName('report')
  .setDescription('📢 Maak een report')
  .addStringOption(opt => opt.setName('jouwnaam').setDescription('Jouw Roblox naam').setRequired(true))
  .addStringOption(opt => opt.setName('tegen').setDescription('Tegen wie (Roblox of @user)').setRequired(true))
  .addStringOption(opt => opt.setName('reden').setDescription('Reden').setRequired(true));

export async function execute(interaction) {
  const jouw = interaction.options.getString('jouwnaam');
  const tegen = interaction.options.getString('tegen');
  const reden = interaction.options.getString('reden');

  const channel = interaction.guild.channels.cache.get('1406025829259022387');

  const embed = new EmbedBuilder()
    .setColor('Orange')
    .setTitle('📢 Nieuw Report')
    .addFields(
      { name: '👤 Reporter', value: jouw, inline: true },
      { name: '🎯 Tegen', value: tegen, inline: true },
      { name: '📖 Reden', value: reden, inline: false }
    );

  await channel.send({ embeds: [embed] });
  await interaction.reply('✅ Je report is verzonden!');
}
