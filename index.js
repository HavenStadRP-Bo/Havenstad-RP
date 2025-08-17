// index.js
import { Client, Collection, GatewayIntentBits, Partials, Events } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './utils/logger.js';

// 🔧 __dirname fix (omdat we ESM gebruiken)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔑 Discord bot token via Render Environment Variables
const TOKEN = process.env.DISCORD_TOKEN;

// 🚀 Maak de bot client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel], // Voor DM's
});

// Commands collectie
client.commands = new Collection();

// 📂 Commands inladen
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  try {
    const command = await import(`file://${filePath}`);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      logger.info(`✅ Command geladen: ${command.data.name}`);
    } else {
      logger.warn(`⚠️ Command in ${file} mist "data" of "execute".`);
    }
  } catch (err) {
    logger.error(`❌ Fout bij laden van ${file}: ${err}`);
  }
}

// 🤖 Ready event
client.once(Events.ClientReady, readyClient => {
  logger.info(`🚀 Ingelogd als ${readyClient.user.tag}`);
});

// 📝 Command handler
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    logger.warn(`Geen command gevonden voor: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction, client);
  } catch (error) {
    logger.error(`❌ Fout bij uitvoeren van ${interaction.commandName}: ${error}`);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'Er is een fout opgetreden bij dit commando!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'Er is een fout opgetreden bij dit commando!', ephemeral: true });
    }
  }
});

// 🔑 Login
client.login(TOKEN);
