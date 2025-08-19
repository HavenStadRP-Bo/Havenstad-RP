// deploy-commands.js
import 'dotenv/config';
import { REST, Routes, PermissionFlagsBits } from 'discord.js';
import fs from 'fs';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

// ✅ Staff rollen die mod-rechten hebben
const STAFF_ROLES = [
  "1406025210527879238", // Beheer
  "1406942631522734231", // Manager
  "1406942944627265536", // Superizer
  "1406943073694515280", // SR.Mod
  "1406943251826606234"  // MOD
];

const commands = [];

// Commands mappen laden
const foldersPath = './commands';
const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  if (command.data) {
    // Default iedereen mag
    const cmdData = command.data.toJSON();

    // Permissions instellen
    if (!['partner', 'rechtzaak', 'report'].includes(cmdData.name)) {
      cmdData.default_member_permissions = PermissionFlagsBits.ManageGuild.toString();
    }

    commands.push(cmdData);
  }
}

const rest = new REST({ version: '10' }).setToken(token);

try {
  console.log('[DEPLOY] 📤 Slash commands worden geregistreerd...');

  await rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    { body: commands }
  );

  console.log('[DEPLOY] ✅ Slash commands succesvol geregistreerd!');
} catch (error) {
  console.error('[DEPLOY] ❌ Fout bij registreren van slash commands:', error);
}
