// deploy-commands.js
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import logger from './utils/logger.js';
import 'dotenv/config';

const commands = [];
const commandsPath = path.resolve('./commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// laad alle commands
for (const file of commandFiles) {
  const { data } = await import(`./commands/${file}`);
  if (data) commands.push(data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  logger.info(`📡 Uploaden van ${commands.length} slash commands...`);

  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  );

  logger.info('✅ Slash commands succesvol geüpload!');
} catch (error) {
  logger.error(error);
}
