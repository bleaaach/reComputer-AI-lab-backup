/**
 * Build-time content paths. Used by build-models.js so that the models content
 * root can be changed in one place (e.g. for future per-locale model data or
 * wiki paths like content/models/wikis/<locale>/).
 */
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

/** Directory containing models YAML and wikis (defaults.yaml, cv|llm|vlm/*.yaml, wikis/*.md). */
const MODELS_CONTENT_DIR = path.join(ROOT, "content", "models");

module.exports = {
  ROOT,
  MODELS_CONTENT_DIR,
};
