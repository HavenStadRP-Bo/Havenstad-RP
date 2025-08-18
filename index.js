import express from 'express';
import { Client, GatewayIntentBits, Events } from 'discord.js';
import logger from './utils/logger.js';
import loadCommands from './command.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Kleine webserver voor uptime bots
const app = express();
app.get('/', (req, res) => res.send('✅ HavenStad RP Bot is online'));
app.listen(process.env.PORT || 3000, () => {
  logger.info(`🌐 Webserver gestart op poort ${process.env.PORT || 3000}`);
});

// Commands laden
loadCommands(client);

client.once(Events.ClientReady, () => {
  logger.info(`🚀 Ingelogd als ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) {
    logger.warn(`⚠️ Command ${interaction.commandName} niet gevonden`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(`❌ Fout bij uitvoeren van ${interaction.commandName}: ${error}`);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: '❌ Er ging iets mis bij dit commando.',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: '❌ Er ging iets mis bij dit commando.',
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.TOKEN);
