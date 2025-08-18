// handlers/commands.js
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

export async function loadCommands(client) {
  const commands = [];
  const __dirname = path.resolve();
  const commandsPath = path.join(__dirname, 'commands');

  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = await import(`../commands/${file}`);
    if (command.default && command.default.data && command.default.execute) {
      commands.push(command.default.data.toJSON());
      client.commands.set(command.default.data.name, command.default);
      logger.info(`✅ Command geladen: ${command.default.data.name}`);
    } else {
      logger.error(`❌ Ongeldige command in ${file}`);
    }
  }

  // Commands registreren bij Discord API
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    logger.info('⏳ Slash commands aan het registreren...');
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands },
    );
    logger.info('✅ Slash commands geregistreerd!');
  } catch (error) {
    logger.error(`❌ Fout bij registreren commands: ${error}`);
  }
}
