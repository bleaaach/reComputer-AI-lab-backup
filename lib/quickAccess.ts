import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { getContentRoot } from "./content-paths";

function iconFromCardId(id: string): string {
  switch (id) {
    case "models":
      return "mingcute:brain-fill";
    case "tools":
      return "mingcute:tool-fill";
    case "tutorials":
      return "mingcute:book-2-fill";
    case "projects":
      return "mingcute:rocket-2-fill";
    default:
      return "mingcute:rocket-fill";
  }
}

export interface QuickAccessCard {
  id: string;
  icon?: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

export interface QuickAccessSection {
  title: string;
  description: string;
  cards: QuickAccessCard[];
}

const defaultSection: QuickAccessSection = {
  title: "Quick Access",
  description: "Jump straight to what you need",
  cards: [
    {
      id: "models",
      icon: "mingcute:brain-fill",
      title: "Explore Models",
      description:
        "LLMs, VLMs, and vision models ready to run on reComputer.",
      buttonText: "Browse all models →",
      href: "/models",
    },
    {
      id: "tutorials",
      icon: "mingcute:book-2-fill",
      title: "Tutorials",
      description:
        "Step-by-step guides for setup, burn-in, and model deployment.",
      buttonText: "Browse all tutorials →",
      href: "/tutorials",
    },
    {
      id: "tools",
      icon: "mingcute:tool-fill",
      title: "Tools",
      description:
        "Flashing, model conversion, and platform-specific toolchains.",
      buttonText: "Browse tools →",
      href: "/tools",
    },
    {
      id: "projects",
      icon: "mingcute:rocket-2-fill",
      title: "Community Projects",
      description: "See what the community is building with reComputer.",
      buttonText: "View all projects →",
      href: "/projects",
    },
  ],
};

let quickAccessCache: QuickAccessSection | null = null;

export function getQuickAccess(): QuickAccessSection {
  if (quickAccessCache && process.env.NODE_ENV === "production")
    return quickAccessCache;
  try {
    const quickAccessPath = path.join(getContentRoot(), "home", "quick-access.yaml");
    const raw = fs.readFileSync(quickAccessPath, "utf-8");
    const data = yaml.load(raw) as {
      title?: string;
      description?: string;
      cards?: Array<{
        id?: string;
        icon?: string;
        title?: string;
        description?: string;
        buttonText?: string;
        href?: string;
      }>;
    };
    const cards = Array.isArray(data?.cards)
      ? data.cards
          .filter(
            (c) =>
              c &&
              typeof c.id === "string" &&
              typeof c.href === "string"
          )
          .map((c) => ({
            id: String(c.id),
            icon:
              typeof c.icon === "string"
                ? c.icon
                : iconFromCardId(String(c.id)),
            title: typeof c.title === "string" ? c.title : "",
            description: typeof c.description === "string" ? c.description : "",
            buttonText: typeof c.buttonText === "string" ? c.buttonText : "",
            href: String(c.href),
          }))
      : [];
    const result: QuickAccessSection = {
      title: typeof data?.title === "string" ? data.title : defaultSection.title,
      description:
        typeof data?.description === "string"
          ? data.description
          : defaultSection.description,
      cards: cards.length > 0 ? cards : defaultSection.cards,
    };
    if (process.env.NODE_ENV === "production") quickAccessCache = result;
    return result;
  } catch {
    return defaultSection;
  }
}
