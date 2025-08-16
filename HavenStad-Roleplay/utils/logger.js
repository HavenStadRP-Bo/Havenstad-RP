const fs = require("fs");
const path = require("path");

function writeLog(file, message) {
    const logPath = path.join(__dirname, "../logs", file);
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

module.exports = {
    info: (msg) => {
        console.log(`ℹ️ ${msg}`);
        writeLog("info.log", msg);
    },
    error: (msg) => {
        console.error(`❌ ${msg}`);
        writeLog("error.log", msg);
    },
    command: (msg) => {
        console.log(`📘 ${msg}`);
        writeLog("command.log", msg);
    }
};
