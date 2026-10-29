const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const ejs = require("ejs");

const root = path.resolve(__dirname, "..");
const skippedDirectories = new Set(["node_modules", ".git", "build"]);
const files = [];

function collect(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory() && !skippedDirectories.has(entry.name)) collect(filename);
        if (entry.isFile() && /\.(?:[cm]?js|ejs)$/.test(entry.name)) files.push(filename);
    }
}

try {
    collect(root);
    let javascriptCount = 0;
    let templateCount = 0;
    for (const filename of files.sort()) {
        if (filename.endsWith(".ejs")) {
            ejs.compile(fs.readFileSync(filename, "utf8"), { filename });
            templateCount += 1;
        } else {
            const result = spawnSync(process.execPath, ["--check", filename], { encoding: "utf8" });
            if (result.error) throw result.error;
            if (result.status !== 0) {
                throw new Error((result.stderr || result.stdout || `Syntax check failed: ${filename}`).trim());
            }
            javascriptCount += 1;
        }
    }
    console.log(`Build successful: ${javascriptCount} JavaScript files and ${templateCount} EJS templates checked.`);
} catch (error) {
    console.error(`Build failed: ${error.message}`);
    process.exitCode = 1;
}
