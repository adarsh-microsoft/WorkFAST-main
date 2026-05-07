#!/usr/bin/env node
// QMD bootstrap for VS Code MCP — resolves the global npm install path
// so the MCP config doesn't need a hardcoded or space-fragile path.
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const { pathToFileURL } = require("url");

const npmRoot = execSync("npm root -g", { encoding: "utf8" }).trim();
const pkgRoot = path.join(npmRoot, "@tobilu", "qmd");

// Try known CLI entry points (qmd has changed layout across versions).
// Mirrors the resolution order in the package's bin/qmd shell script.
const candidates = [
  path.join(pkgRoot, "dist", "cli", "qmd.js"),
  path.join(pkgRoot, "dist", "qmd.js"),
];
const entry = candidates.find(fs.existsSync);
if (!entry) {
  console.error("QMD CLI entry not found. Checked:\n" + candidates.join("\n"));
  process.exit(1);
}

// QMD is ESM with top-level await — must use dynamic import()
process.argv = [process.argv[0], entry, ...process.argv.slice(2)];
import(pathToFileURL(entry).href);
