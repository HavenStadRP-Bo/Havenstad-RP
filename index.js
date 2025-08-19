// index.js
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import express from 'express';
import logger from './utils/logger.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import './deploy-commands.js'; // registreert commands bij startup

// Zorg dat __dirname werkt in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express uptime server
const app = express();
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot is online ✅'));
app.listen(PORT, () => logger.info(`[WEB] Server online op poort ${PORT}`));

// Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// Commands laden
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const { data, execute } = await import(`./commands/${file}`);
  if (data && execute) {
    client.commands.set(data.name, { data, execute });
    logger.info(`✅ Command geladen: ${data.name}`);
  } else {
    logger.error(`❌ Fout bij laden van ${file}`);
  }
}

// Event: bot klaar
client.once('ready', () => {
  logger.info(`🚀 Ingelogd als ${client.user.tag}`);
});

// Event: command uitgevoerd
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`❌ Fout bij uitvoeren van ${interaction.commandName}: ${error}`);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: '⚠️ Er ging iets mis.', ephemeral: true });
    } else {
      await interaction.reply({ content: '⚠️ Er ging iets mis.', ephemeral: true });
    }
  }
});

// Login
client.login(process.env.TOKEN);
