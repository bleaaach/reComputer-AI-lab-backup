const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const standaloneDir = path.join(root, ".next", "standalone");
const standaloneNextDir = path.join(standaloneDir, ".next");

function copyDir(source, target) {
  if (!fs.existsSync(source)) return;
  fs.rmSync(target, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(source, target, { recursive: true });
}

fs.mkdirSync(standaloneNextDir, { recursive: true });
copyDir(path.join(root, ".next", "static"), path.join(standaloneNextDir, "static"));
copyDir(path.join(root, "public"), path.join(standaloneDir, "public"));

console.log("Copied standalone assets");
