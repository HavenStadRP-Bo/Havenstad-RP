// deploy-commands.js
import { REST, Routes, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientId = process.env.CLIENT_ID; // 1406028276199067780
const guildId = process.env.GUILD_ID;   // 1406028276199067780
const token = process.env.TOKEN;

const commands = [];

// Rollen die staff perms krijgen
const staffRoles = [
  '1406025210527879238', // Beheer
  '1406942631522734231', // Manager
  '1406942944627265536', // Superizer
  '1406943073694515280', // SR.Mod
  '1406943251826606234', // MOD
];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Commands inlezen
for (const file of commandFiles) {
  const { data } = await import(`./commands/${file}`);

  // Basis JSON
  const cmd = data.toJSON();

  // Speciale regels:
  if (['partner', 'rechtzaak', 'report'].includes(cmd.name)) {
    // iedereen kan deze gebruiken → geen default perms
    cmd.default_member_permissions = null;
  } else {
    // alleen staff rollen mogen deze
    cmd.default_member_permissions = PermissionFlagsBits.ModerateMembers.toString();
  }

  commands.push(cmd);
}

const rest = new REST({ version: '10' }).setToken(token);

// Deploy functie
(async () => {
  try {
    logger.info(`⏳ Slash commands registreren (${commands.length})...`);

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    logger.info('✅ Slash commands succesvol geregistreerd.');
  } catch (error) {
    logger.error(`❌ Fout bij registreren van slash commands: ${error}`);
  }
})();
