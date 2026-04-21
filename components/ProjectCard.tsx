"use client";

import type { ProjectItem } from "@/lib/types";

/** 16:9 aspect ratio for cover */
const COVER_ASPECT = "aspect-video";

/** Extract YouTube video ID from watch URL, youtu.be, or raw ID */
export function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return null;
}

function ProjectCover({ project }: { project: ProjectItem }) {
  const cover = project.cover ?? (project.coverImage ? { type: "image" as const, url: project.coverImage } : null);
  if (!cover?.url) {
    return <div className={`w-full ${COVER_ASPECT} bg-gray-100`} />;
  }

  switch (cover.type) {
    case "video":
      return (
        <video
          src={cover.url}
          muted
          loop
          playsInline
          className={`w-full ${COVER_ASPECT} object-cover`}
          aria-hidden
        />
      );
    case "youtube": {
      const videoId = getYoutubeVideoId(cover.url);
      if (!videoId) return <div className={`w-full ${COVER_ASPECT} bg-gray-100`} />;
      return (
        <div className={`relative w-full overflow-hidden bg-black ${COVER_ASPECT}`}>
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      );
    }
    case "gif":
    case "image":
    default:
      return (
        <div className={`relative w-full overflow-hidden bg-gray-100 ${COVER_ASPECT}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- external cover URLs; Next/Image would require remotePatterns per domain */}
          <img
            src={cover.url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const wrap = e.currentTarget.parentElement;
              if (wrap && !wrap.querySelector(".project-cover-fallback")) {
                const fallback = document.createElement("div");
                fallback.className =
                  "project-cover-fallback absolute inset-0 flex items-center justify-center bg-gray-200 text-sm text-gray-500";
                fallback.textContent = "Cover";
                wrap.appendChild(fallback);
              }
            }}
          />
        </div>
      );
  }
}

export interface ProjectCardProps {
  project: ProjectItem;
  /** If true, summary may be truncated (e.g. on homepage) */
  compact?: boolean;
}

export default function ProjectCard({ project, compact }: ProjectCardProps) {
  const hasMeta = project.author || project.publishedAt;

  return (
    <a
      href={project.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-primary"
    >
      <ProjectCover project={project} />
      <div className="flex flex-1 flex-col p-4">
        {hasMeta && (
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500">
            <span>{project.author ?? "\u00A0"}</span>
            <span>{project.publishedAt ?? "\u00A0"}</span>
          </div>
        )}
        <h2 className="mt-1 line-clamp-2 font-semibold text-gray-900">{project.title}</h2>
        <p className={`mt-2 text-sm text-gray-600 ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
          {project.summary}
        </p>
        <div className="mt-auto flex flex-col gap-2 pt-3">
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-end">
            <span className="text-sm font-medium text-primary">
              {project.sourceLabel ?? "View project"} →
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}
