import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { getContentRoot } from "./content-paths";

export type TutorialNode = TutorialGroup | TutorialPage | TutorialLink;

export interface TutorialSeries {
  id: string;
  title: string;
  items: TutorialNode[];
}

export interface TutorialGroup {
  type: "group";
  id: string;
  title: string;
  items: TutorialNode[];
}

export interface TutorialPage {
  type: "page";
  id: string;
  title: string;
  path: string;
}

export interface TutorialLink {
  type: "link";
  id: string;
  title: string;
  url: string;
}

export interface TutorialBreadcrumb {
  id: string;
  title: string;
  path: string[];
  type: "series" | "group" | "page";
}

export interface TutorialPageContent {
  series: TutorialSeries;
  node: TutorialPage;
  breadcrumbs: TutorialBreadcrumb[];
  content: string;
}

let tutorialsCache: TutorialSeries[] | null = null;

export function getTutorialSeries(): TutorialSeries[] {
  if (tutorialsCache) return tutorialsCache;
  const tutorialsIndexPath = path.join(getContentRoot(), "tutorials", "index.yaml");
  const raw = fs.readFileSync(tutorialsIndexPath, "utf-8");
  const data = yaml.load(raw) as { series?: TutorialSeries[] };
  tutorialsCache = Array.isArray(data?.series) ? data.series : [];
  return tutorialsCache;
}

export function getSeriesDefaultSlug(series: TutorialSeries): string[] | null {
  const first = findFirstPage(series.items);
  if (!first) return null;
  return [series.id, ...first.path];
}

export function getDefaultTutorialSlug(): string[] | null {
  const series = getTutorialSeries();
  for (const s of series) {
    const slug = getSeriesDefaultSlug(s);
    if (slug) return slug;
  }
  return null;
}

export function getTutorialPage(slug: string[]): TutorialPageContent | null {
  if (!slug.length) return null;
  const [seriesId, ...nodePath] = slug;
  const series = getTutorialSeries().find((item) => item.id === seriesId);
  if (!series) return null;

  const defaultPage = findFirstPage(series.items);
  if (nodePath.length === 0) {
    if (!defaultPage) return null;
    return buildPageContent(series, defaultPage.node, defaultPage.breadcrumbs);
  }

  const match = findNode(series.items, nodePath);
  if (!match || match.node.type !== "page") return null;
  return buildPageContent(series, match.node, match.breadcrumbs);
}

function buildPageContent(
  series: TutorialSeries,
  node: TutorialPage,
  breadcrumbs: TutorialBreadcrumb[]
): TutorialPageContent {
  const contentPath = path.join(getContentRoot(), "tutorials", node.path);
  const content = fs.readFileSync(contentPath, "utf-8");
  return {
    series,
    node,
    breadcrumbs,
    content,
  };
}

function findNode(
  items: TutorialNode[],
  pathIds: string[],
  pathPrefix: string[] = [],
  breadcrumbs: TutorialBreadcrumb[] = []
): { node: TutorialNode; breadcrumbs: TutorialBreadcrumb[] } | null {
  if (!pathIds.length) return null;
  const [currentId, ...rest] = pathIds;
  const current = items.find((item) => item.id === currentId);
  if (!current) return null;

  const currentPath = [...pathPrefix, current.id];
  const nextBreadcrumbs: TutorialBreadcrumb[] = [
    ...breadcrumbs,
    {
      id: current.id,
      title: current.title,
      path: currentPath,
      type: current.type === "group" ? "group" : "page",
    },
  ];

  if (rest.length === 0) {
    return { node: current, breadcrumbs: nextBreadcrumbs };
  }

  if (current.type !== "group") return null;
  return findNode(current.items, rest, currentPath, nextBreadcrumbs);
}

function findFirstPage(
  items: TutorialNode[],
  path: string[] = [],
  breadcrumbs: TutorialBreadcrumb[] = []
): { node: TutorialPage; path: string[]; breadcrumbs: TutorialBreadcrumb[] } | null {
  for (const item of items) {
    if (item.type === "page") {
      return {
        node: item,
        path: [...path, item.id],
        breadcrumbs: [
          ...breadcrumbs,
          { id: item.id, title: item.title, path: [...path, item.id], type: "page" },
        ],
      };
    }
    if (item.type === "group") {
      const nextBreadcrumbs: TutorialBreadcrumb[] = [
        ...breadcrumbs,
        { id: item.id, title: item.title, path: [...path, item.id], type: "group" },
      ];
      const match = findFirstPage(item.items, [...path, item.id], nextBreadcrumbs);
      if (match) return match;
    }
  }
  return null;
}
