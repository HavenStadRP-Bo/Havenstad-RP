import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './utils/logger.js';

// Zorg dat je BOT_TOKEN en CLIENT_ID in Render env staan
const token = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // kan je test server ID zijn

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`./commands/${file}`);
  if (command.data && command.data.toJSON) {
    commands.push(command.data.toJSON());
  } else {
    logger.error(`❌ Command ${file} mist "data"`);
  }
}

const rest = new REST({ version: '10' }).setToken(token);

try {
  logger.info(`🔄 Registreren van ${commands.length} slash commands...`);
  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands },
  );
  logger.info('✅ Slash commands succesvol geregistreerd!');
} catch (error) {
  logger.error('❌ Error bij registreren:', error);
}
