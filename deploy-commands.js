// deploy-commands.js
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// config
const clientId = '1406028276199067780'; // jouw bot ID
const guildId = '1404865392962033664';  // jouw server ID
const token = process.env.TOKEN; // je bot token staat in Render

const commands = [];

// alle commands inladen
const foldersPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(foldersPath, file);
  const command = await import(`./commands/${file}`);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WAARSCHUWING] Command ${file} heeft geen data of execute`);
  }
}

// commands pushen naar Discord
const rest = new REST({ version: '10' }).setToken(token);

try {
  console.log(`🔄 Bezig met registreren van ${commands.length} commands...`);

  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands },
  );

  console.log('✅ Slash commands succesvol geregistreerd!');
} catch (error) {
  console.error(error);
}
