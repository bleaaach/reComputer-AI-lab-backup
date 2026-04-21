declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: unknown[];
  }
}

export {};

export const GA_TRACKING_ID = "G-QKSP1JEZTY";

function isGaAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (!isGaAvailable()) return;
  window.gtag!("event", name, params);
}

export function trackPageView(path: string, title?: string): void {
  if (!isGaAvailable()) return;

  const url = path || window.location.pathname + window.location.search;
  const pageTitle = title || document.title;

  window.gtag!("event", "page_view", {
    page_path: url,
    page_title: pageTitle,
    language: navigator.language,
    screen_resolution: `${window.innerWidth}x${window.innerHeight}`,
  });
}

