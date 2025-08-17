import { SlashCommandBuilder } from 'discord.js';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./data/warns.json');

export const data = new SlashCommandBuilder()
  .setName('showwarns')
  .setDescription('Bekijk waarschuwingen van een gebruiker')
  .addUserOption(option =>
    option.setName('gebruiker')
      .setDescription('De gebruiker waarvan je warns wilt zien')
      .setRequired(true));

export async function execute(interaction) {
  const user = interaction.options.getUser('gebruiker');
  let warns = [];
  if (fs.existsSync(filePath)) {
    warns = JSON.parse(fs.readFileSync(filePath));
  }

  const userWarns = warns.filter(w => w.gebruiker === user.id);

  if (userWarns.length === 0) {
    await interaction.reply(`✅ ${user.tag} heeft geen waarschuwingen.`);
    return;
  }

  const list = userWarns
    .map((w, i) => `${i + 1}. ${w.reden} (door <@${w.moderator}> op ${new Date(w.datum).toLocaleString()})`)
    .join('\n');

  await interaction.reply(`📋 Waarschuwingen voor **${user.tag}**:\n${list}`);
}
