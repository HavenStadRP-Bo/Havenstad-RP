// utils/logger.js
import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

// nodig voor juiste paden (Render gebruikt /opt/render/project/src/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    // Console log
    new winston.transports.Console(),

    // Error logs
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
    }),

    // Info & alles boven info
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/info.log"),
      level: "info",
    }),

    // Alles gecombineerd
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/combined.log"),
    }),
  ],
});

// Zorg dat je default export hebt
export default logger;
