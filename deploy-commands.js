// deploy-commands.js
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Zorgt dat __dirname werkt met ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Laad alle command data
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  if (command.data) {
    commands.push(command.data.toJSON());
    console.log(`✅ Command gevonden voor registratie: ${command.data.name}`);
  }
}

// Environment variables (moeten in Render staan)
const clientId = process.env.CLIENT_ID;   // 1406028276199067780
const guildId = process.env.GUILD_ID;     // 1406028276199067780
const token = process.env.DISCORD_TOKEN;  // jouw bot token

if (!clientId || !guildId || !token) {
  console.error('❌ CLIENT_ID, GUILD_ID of DISCORD_TOKEN ontbreekt in environment!');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

try {
  console.log('🚀 Start met deployen van slash commands...');

  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands },
  );

  console.log('✅ Slash commands succesvol geregistreerd!');
} catch (error) {
  console.error('❌ Fout bij deployen van commands:', error);
}
