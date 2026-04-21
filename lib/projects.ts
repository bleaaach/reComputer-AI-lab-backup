import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import type { ProjectItem, ProjectCover } from "./types";
import { getContentRoot } from "./content-paths";

let projectsCache: ProjectItem[] | null = null;

/** Raw entry from YAML (may have coverImage string or cover object) */
interface ProjectRow {
  id: string;
  title: string;
  summary: string;
  coverImage?: string;
  cover?: ProjectCover;
  sourceUrl: string;
  sourceLabel?: string;
  author?: string;
  publishedAt?: string;
  tags?: string[];
  featured?: boolean;
}

function normalizeCover(row: ProjectRow): ProjectItem["cover"] {
  if (row.cover?.type && row.cover?.url) return row.cover;
  if (row.coverImage) return { type: "image", url: row.coverImage };
  return undefined;
}

export function getProjects(): ProjectItem[] {
  // In development, skip cache so editing projects.yaml is reflected on refresh
  if (projectsCache && process.env.NODE_ENV === "production") return projectsCache;
  const projectsPath = path.join(getContentRoot(), "projects", "projects.yaml");
  const raw = fs.readFileSync(projectsPath, "utf-8");
  const data = yaml.load(raw) as { projects?: ProjectRow[] };
  const rows = Array.isArray(data?.projects) ? data.projects : [];
  const result = rows.map((row) => {
    const cover = normalizeCover(row);
    const item: ProjectItem = {
      id: row.id,
      title: row.title,
      summary: row.summary,
      sourceUrl: row.sourceUrl,
      sourceLabel: row.sourceLabel,
      author: row.author,
      publishedAt: row.publishedAt,
      tags: row.tags,
      featured: row.featured,
    };
    if (cover) item.cover = cover;
    if (row.coverImage) item.coverImage = row.coverImage;
    return item;
  });
  if (process.env.NODE_ENV === "production") projectsCache = result;
  return result;
}

export function getFeaturedProjects(): ProjectItem[] {
  return getProjects().filter((p) => p.featured === true);
}
