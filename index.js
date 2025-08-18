// index.js
import { Client, GatewayIntentBits, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import logger from "./utils/logger.js";
import "./handlers/commands.js"; // zorgt dat je commands worden geregistreerd

// Express server voor Render + uptime bots
import express from "express";
const app = express();
app.get("/", (req, res) => res.send("✅ HavenStad RP Bot draait!"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[WEB] Server online op poort ${PORT}`);
});

// Nodige vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Discord client setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// Commands inladen
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(`file://${filePath}`);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    logger.info(`✅ Command geladen: ${command.data.name}`);
  } else {
    logger.error(`❌ Command ${file} mist "data" of "execute"`);
  }
}

// Bot klaar event
client.once("ready", () => {
  logger.info(`🚀 Ingelogd als ${client.user.tag}`);
});

// Interactie handler
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    logger.error(error);
    await interaction.reply({
      content: "❌ Er ging iets mis bij het uitvoeren van dit command.",
      ephemeral: true,
    });
  }
});

// Bot starten
client.login(process.env.DISCORD_TOKEN);
