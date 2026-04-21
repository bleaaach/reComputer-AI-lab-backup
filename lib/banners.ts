import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { getContentRoot } from "./content-paths";

export interface BannerItem {
  id: string;
  imageUrl: string;
  link?: string;
  alt?: string;
  /** 可选：排序权重，越小越靠前 */
  sortOrder?: number;
}

let bannersCache: BannerItem[] | null = null;

/** Raw entry from YAML */
interface BannerRow {
  id: string;
  imageUrl: string;
  link?: string;
  alt?: string;
  sortOrder?: number;
}

export function getHomeBanners(): BannerItem[] {
  if (bannersCache && process.env.NODE_ENV === "production") return bannersCache;
  try {
    const bannersPath = path.join(getContentRoot(), "banners", "banners.yaml");
    const raw = fs.readFileSync(bannersPath, "utf-8");
    const data = yaml.load(raw) as { banners?: BannerRow[] };
    const rows = Array.isArray(data?.banners) ? data.banners : [];
    const result = rows
      .map((row) => ({
        id: row.id,
        imageUrl: row.imageUrl,
        link: row.link,
        alt: row.alt,
        sortOrder: row.sortOrder,
      }))
      .sort((a, b) => {
        const orderA = a.sortOrder ?? 999;
        const orderB = b.sortOrder ?? 999;
        return orderA - orderB;
      });
    if (process.env.NODE_ENV === "production") bannersCache = result;
    return result;
  } catch {
    return [];
  }
}
