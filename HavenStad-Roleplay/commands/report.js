const { EmbedBuilder } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
    name: "report",
    description: "Meld een speler",
    options: [
        {
            name: "gebruiker",
            type: 6,
            description: "Wie
