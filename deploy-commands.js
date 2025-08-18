import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './utils/logger.js';

// Zorg dat je dit invult:
const CLIENT_ID = "JOUW_CLIENT_ID"; 
const GUILD_ID = "1404783511629594645"; 
const TOKEN = process.env.TOKEN;

// __dirname fix (omdat je ESM gebruikt)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(foldersPath, file);
  const command = (await import(`file://${filePath}`)).default;
  if (command?.data && command?.execute) {
    commands.push(command.data.toJSON());
    logger.info(`✅ Command klaar om te deployen: ${command.data.name}`);
  } else {
    logger.warn(`⚠️ Command ${file} mist data of execute`);
  }
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

try {
  logger.info(`🚀 Deployen van ${commands.length} commands...`);
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands },
  );
  logger.info('✅ Alle slash commands succesvol gedeployed!');
} catch (error) {
  logger.error(error);
}
