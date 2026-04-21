"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent, trackPageView } from "@/lib/ga";

function getCurrentPath(): string {
  if (typeof window === "undefined") return "/";
  return window.location.pathname + window.location.search;
}

function AnalyticsPageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = getCurrentPath();
    const title = document.title;

    trackPageView(path, title);
  }, [pathname]);

  return null;
}

function AnalyticsScrollTracker() {
  const firedThresholdsRef = useRef(new Set<number>());

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const thresholds = [25, 50, 75, 100];
    const firedThresholds = firedThresholdsRef.current;

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const viewportHeight = window.innerHeight || doc.clientHeight || 0;
      const scrollHeight = doc.scrollHeight || 0;

      if (!scrollHeight) return;

      const currentBottom = scrollTop + viewportHeight;
      const ratio = (currentBottom / scrollHeight) * 100;

      thresholds.forEach((threshold) => {
        if (ratio >= threshold && !firedThresholds.has(threshold)) {
          firedThresholds.add(threshold);
          trackEvent("scroll_depth", {
            percent_scrolled: threshold,
            page_path: getCurrentPath(),
          });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // 初次渲染时也计算一次，避免一进来就是深度位置时错过
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      firedThresholds.clear();
    };
  }, []);

  return null;
}

function AnalyticsClickTracker() {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const downloadExtensions = [".pdf", ".zip", ".tar.gz", ".gz", ".exe", ".dmg", ".pkg"];

    const getClosestElement = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element)) return null;
      return (
        target.closest("[data-analytics-id]") ||
        target.closest("a") ||
        target.closest("button")
      ) as HTMLElement | null;
    };

    const onClick = (event: MouseEvent) => {
      const element = getClosestElement(event.target);
      if (!element) return;

      const tagName = element.tagName.toLowerCase();
      const analyticsId = element.getAttribute("data-analytics-id") || undefined;
      const text = (element.textContent || "").trim().slice(0, 100);
      const pagePath = getCurrentPath();

      let eventName = "click_generic";
      const params: Record<string, unknown> = {
        element_tag: tagName,
        element_text: text,
        page_path: pagePath,
      };

      if (analyticsId) {
        params.element_id = analyticsId;
      }

      const isInNav = !!element.closest("nav");
      if (isInNav) {
        eventName = "click_nav";
      } else if (tagName === "button" || analyticsId) {
        eventName = "click_cta";
      }

      // 处理链接：外链 / 下载
      const anchor =
        element instanceof HTMLAnchorElement
          ? element
          : (element.closest("a") as HTMLAnchorElement | null);

      if (anchor && anchor.href) {
        try {
          const url = new URL(anchor.href);
          const currentHost = window.location.host;

          const isExternal = url.host && url.host !== currentHost;
          const path = url.pathname || "/";

          const lowerPath = path.toLowerCase();
          const isDownload = downloadExtensions.some((ext) =>
            lowerPath.endsWith(ext),
          );

          if (isExternal) {
            eventName = "outbound_click";
            params.destination_url = url.toString();
          } else if (isDownload) {
            eventName = "file_download";
            params.file_url = url.toString();
            params.file_extension =
              downloadExtensions.find((ext) => lowerPath.endsWith(ext)) || null;
          }
        } catch {
          // ignore URL parsing errors
        }
      }

      trackEvent(eventName, params);
    };

    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}

function AnalyticsEngagementTimer() {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const HEARTBEAT_SECONDS = 15;

    const tick = () => {
      if (document.visibilityState !== "visible") return;

      trackEvent("page_engagement", {
        engagement_time_sec: HEARTBEAT_SECONDS,
        page_path: getCurrentPath(),
      });
    };

    intervalRef.current = window.setInterval(tick, HEARTBEAT_SECONDS * 1000);

    const onVisibilityChange = () => {
      // 可见性变化时立刻打一条心跳，确保长时间隐藏 -> 再次可见 时有记录
      if (document.visibilityState === "visible") {
        tick();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return null;
}

export function AnalyticsRoot() {
  return (
    <>
      <AnalyticsPageViewTracker />
      <AnalyticsScrollTracker />
      <AnalyticsClickTracker />
      <AnalyticsEngagementTimer />
    </>
  );
}

