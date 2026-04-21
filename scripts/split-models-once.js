/**
 * One-time migration: read content/models/models.yaml and split into
 * content/models/defaults.yaml + content/models/<type>/<family>/<slug>.yaml
 * Run: node scripts/split-models-once.js
 */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "models");
const YAML_PATH = path.join(CONTENT_DIR, "models.yaml");

const data = yaml.load(fs.readFileSync(YAML_PATH, "utf-8"));

// defaults.yaml already created manually; skip or overwrite
const defaultsPath = path.join(CONTENT_DIR, "defaults.yaml");
fs.writeFileSync(
  defaultsPath,
  yaml.dump(data.defaults || {}, { lineWidth: -1 }),
  "utf-8"
);
console.log("Wrote", defaultsPath);

for (const model of data.models || []) {
  const type = model.type || "cv";
  const family = model.secondaryCategoryId || model.categoryId || "default";
  const slug = model.slug || model.id;
  const dir = path.join(CONTENT_DIR, type, family);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, slug + ".yaml");
  fs.writeFileSync(filePath, yaml.dump(model, { lineWidth: -1 }), "utf-8");
  console.log("Wrote", path.relative(ROOT, filePath));
}

console.log("Done. You can rename or remove content/models/models.yaml .");
