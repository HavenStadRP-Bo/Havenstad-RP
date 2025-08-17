import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./data/warns.json');

export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription('Waarschuw een gebruiker')
  .addUserOption(option =>
    option.setName('gebruiker')
      .setDescription('De gebruiker die je wilt waarschuwen')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('reden')
      .setDescription('De reden van de waarschuwing')
      .setRequired(true));

export async function execute(interaction) {
  const user = interaction.options.getUser('gebruiker');
  const reden = interaction.options.getString('reden');

  let warns = [];
  if (fs.existsSync(filePath)) {
    warns = JSON.parse(fs.readFileSync(filePath));
  }

  warns.push({
    gebruiker: user.id,
    moderator: interaction.user.id,
    reden,
    datum: new Date().toISOString()
  });

  fs.writeFileSync(filePath, JSON.stringify(warns, null, 2));

  await interaction.reply(`⚠️ ${user.tag} is gewaarschuwd. Reden: ${reden}`);
}
