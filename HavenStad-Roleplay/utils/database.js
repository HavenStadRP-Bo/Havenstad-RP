const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data");

function read(file) {
    try {
        const content = fs.readFileSync(path.join(dataPath, file), "utf8");
        return JSON.parse(content || "[]");
    } catch (err) {
        return [];
    }
}

function write(file, data) {
    fs.writeFileSync(path.join(dataPath, file), JSON.stringify(data, null, 2));
}

module.exports = {
    getWarns: () => read("warns.json"),
    saveWarns: (warns) => write("warns.json", warns),

    getReports: () => read("reports.json"),
    saveReports: (reports) => write("reports.json", reports),
};
