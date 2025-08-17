// commands/ssu.js
import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ssu')
  .setDescription('🌴 Start/stop server roleplay')
  .addSubcommand(sub => sub.setName('start').setDescription('Start de server'))
  .addSubcommand(sub => sub.setName('stop').setDescription('Stop de server'))
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export async function execute(interaction) {
  const ssuChannel = interaction.guild.channels.cache.get('1404865394094637227');
  const ssuPing = '<@&1404867280546041986>';

  if (interaction.options.getSubcommand() === 'start') {
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setTitle('🌴 Server Start')
      .setDescription(`${ssuPing}\nOnze in-game server is **gestart**!\nKlik [hier](https://roblox.com) om te joinen.`)
      .setImage('https://media.discordapp.net/.../image.png');

    await ssuChannel.send({ embeds: [embed] });
    await interaction.reply('✅ Server is gestart.');
  }

  if (interaction.options.getSubcommand() === 'stop') {
    const embed = new EmbedBuilder()
      .setColor('DarkRed')
      .setTitle('⛔ Server Gesloten')
      .setDescription(`${ssuPing}\nOnze server is nu gesloten.\nKlik [hier](https://roblox.com) om alsnog te verbinden.`)
      .setImage('https://media.discordapp.net/.../image_1.png');

    await ssuChannel.send({ embeds: [embed] });
    await interaction.reply('✅ Server is gestopt.');
  }
}
