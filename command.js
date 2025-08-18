import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function loadCommands(client) {
  client.commands = new Map();

  const foldersPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(foldersPath, file);
    import(`file://${filePath}`).then(commandModule => {
      const command = commandModule.default;
      if (command?.data && command?.execute) {
        client.commands.set(command.data.name, command);
        logger.info(`✅ Command geladen: ${command.data.name}`);
      } else {
        logger.warn(`⚠️ Command ${file} mist data of execute`);
      }
    }).catch(err => logger.error(`❌ Fout bij laden van ${file}: ${err}`));
  }
}
