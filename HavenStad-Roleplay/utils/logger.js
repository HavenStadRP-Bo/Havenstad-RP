import fs from 'fs';
import path from 'path';

function timestamp() {
    return new Date().toISOString().replace('T', ' ').split('.')[0];
}

const logFile = (filename, message) => {
    const filePath = path.join('./logs', filename);
    fs.appendFileSync(filePath, `${message}\n`);
};

export default {
    logInfo: (msg) => {
        console.log(`[INFO] ${timestamp()} - ${msg}`);
        logFile('info.log', `[INFO] ${timestamp()} - ${msg}`);
    },
    logError: (err, context) => {
        console.error(`[ERROR] ${timestamp()} - ${context}: ${err}`);
        logFile('errors.log', `[ERROR] ${timestamp()} - ${context}: ${err}`);
    },
    logCommand: (cmd, user) => {
        const msg = `[COMMAND] ${timestamp()} - ${user} gebruikte ${cmd}`;
        console.log(msg);
        logFile('commands.log', msg);
    }
};
