import { Client, GatewayIntentBits, Collection, REST, Routes, PermissionsBitField } from 'discord.js';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './utils/logger.js';

// ====== Discord client ======
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});
client.commands = new Collection();

// ====== Pad helpers ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Commands laden ======
const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(filePath);
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
    logger.info(`✅ Command geladen: ${command.data.name}`);
  } else {
    logger.error(`❌ Fout bij laden van ${file}`);
  }
}

// ====== Slash commands registreren ======
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
const clientId = '1406028276199067780';
const guildId = '1406028276199067780';

(async () => {
  try {
    logger.info('🔄 Slash commands registreren...');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    logger.info('✅ Slash commands succesvol geregistreerd!');
  } catch (error) {
    logger.error('❌ Fout bij registreren van slash commands:', error);
  }
})();

// ====== Staff rollen ======
const STAFF_ROLES = [
  '1406025210527879238', // Beheer
  '1406942631522734231', // Manager
  '1406942944627265536', // Superizer
  '1406943073694515280', // SR.Mod
  '1406943251826606234', // MOD
];

// Commands die iedereen mag doen
const PUBLIC_COMMANDS = ['rechtzaak', 'partner', 'report'];

// ====== Bot ready ======
client.once('ready', () => {
  logger.info(`🚀 Ingelogd als ${client.user.tag}`);
});

// ====== Interactie handler ======
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  // 🔒 Check permissions
  if (!PUBLIC_COMMANDS.includes(command.data.name)) {
    const memberRoles = interaction.member.roles.cache;
    const isStaff = STAFF_ROLES.some(r => memberRoles.has(r));

    if (!isStaff) {
      return interaction.reply({
        content: '❌ Je hebt geen permissie om dit commando te gebruiken.',
        ephemeral: true,
      });
    }
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(error);
    await interaction.reply({ content: '❌ Er ging iets mis bij uitvoeren van dit commando.', ephemeral: true });
  }
});

// ====== Webserver voor uptime ======
const app = express();
app.get('/', (req, res) => res.send('Bot is running ✅'));
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => logger.info(`[WEB] Server online op poort ${PORT}`));

// ====== Login ======
client.login(process.env.TOKEN);
