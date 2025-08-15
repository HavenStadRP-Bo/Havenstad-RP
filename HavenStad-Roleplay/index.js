import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import logger from './utils/logger.js';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// commands laden
const commandsPath = path.join('./commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    client.commands.set(command.default.data.name, command.default);
}

// ready event
client.once('ready', () => {
    logger.logInfo(`Bot is online als ${client.user.tag}`);
    console.log(`Bot is online als ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
        logger.logCommand(interaction.commandName, interaction.user.tag);
    } catch (error) {
        logger.logError(error, interaction.commandName);
        console.error(error);
        await interaction.reply({ content: 'Er ging iets mis!', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);
