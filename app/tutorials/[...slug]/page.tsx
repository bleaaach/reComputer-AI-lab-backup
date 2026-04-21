import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import CodeBlock from "@/components/CodeBlock";
import TutorialSidebarSeries from "@/components/TutorialSidebarSeries";
import BackToTop from "@/components/BackToTop";

/** Render table cell content; if plain text contains markdown (e.g. **bold**), parse it. */
function TableCellContent({ children }: { children: React.ReactNode }) {
  const str =
    typeof children === "string"
      ? children
      : Array.isArray(children) &&
        children.length === 1 &&
        typeof children[0] === "string"
        ? children[0]
        : null;
  if (str !== null && /[*_`]/.test(str)) {
    return (
      <ReactMarkdown
        components={{ p: ({ children: c }) => <>{c}</> }}
        remarkPlugins={[remarkGfm]}
      >
        {str}
      </ReactMarkdown>
    );
  }
  return <>{children}</>;
}
import {
  getTutorialPage,
  getTutorialSeries,
  getSeriesDefaultSlug,
  type TutorialNode,
} from "@/lib/tutorials";

type PageProps = {
  params: {
    slug: string[];
  };
};

type TocEntry = { level: 1 | 2 | 3; text: string; id: string };

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, "");
}

function getTocFromMarkdown(md: string): TocEntry[] {
  const lines = md.split(/\r?\n/);
  const entries: TocEntry[] = [];
  const idCount = new Map<string, number>();
  let inFence = false;
  let fenceChar: "`" | "~" | null = null;
  let fenceLen = 0;
  for (const line of lines) {
    // Ignore headings inside fenced code blocks (``` / ~~~).
    // Markdown allows up to 3 leading spaces before a fence.
    const fenceMatch = line.match(/^\s{0,3}((`{3,})|(~{3,}))(.*)$/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      const char = marker[0] as "`" | "~";
      const len = marker.length;
      if (!inFence) {
        inFence = true;
        fenceChar = char;
        fenceLen = len;
        continue;
      }
      // Close fence only if it matches the opening fence type and length.
      if (fenceChar === char && len >= fenceLen) {
        inFence = false;
        fenceChar = null;
        fenceLen = 0;
        continue;
      }
    }
    if (inFence) continue;

    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length as 1 | 2 | 3;
      const text = match[2].trim();
      let id = slugify(text);
      const count = (idCount.get(id) ?? 0) + 1;
      idCount.set(id, count);
      if (count > 1) id = `${id}-${count}`;
      entries.push({ level, text, id });
    }
  }
  return entries;
}

const isActivePath = (active: string[], target: string[]) =>
  target.every((seg, index) => active[index] === seg);

const renderSidebarItems = (
  items: TutorialNode[],
  seriesId: string,
  parentPath: string[],
  activePath: string[]
) => {
  if (!items.length) {
    return <p className="mt-2 text-xs text-gray-400">Coming soon.</p>;
  }

  return (
    <ul className="mt-2 space-y-1 border-l border-gray-200 pl-3">
      {items.map((item) => {
        const itemPath = [...parentPath, item.id];
        const fullPath = [seriesId, ...itemPath];

        if (item.type === "group") {
          const isOpen = isActivePath(activePath, fullPath);
          return (
            <li key={fullPath.join("/")}>
              <details open={isOpen} className="group">
                <summary className="cursor-pointer select-none text-sm font-semibold text-gray-700 hover:text-primary">
                  {item.title}
                </summary>
                <div className="mt-2">
                  {renderSidebarItems(item.items, seriesId, itemPath, activePath)}
                </div>
              </details>
            </li>
          );
        }

        if (item.type === "link") {
          return (
            <li key={fullPath.join("/")}>
              <a
                className="block rounded px-2 py-1 text-sm text-gray-600 hover:text-primary"
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                {item.title}
              </a>
            </li>
          );
        }

        const href = `/tutorials/${fullPath.join("/")}`;
        const isActive = activePath.join("/") === fullPath.join("/");
        return (
          <li key={fullPath.join("/")}>
            <Link
              className={`block rounded px-2 py-1 text-sm transition ${
                isActive
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-gray-600 hover:text-primary"
              }`}
              href={href}
            >
              {item.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default function TutorialsDocPage({ params }: PageProps) {
  const page = getTutorialPage(params.slug);
  if (!page) notFound();

  const seriesList = getTutorialSeries();
  const activeSeriesId = params.slug[0];
  const toc = getTocFromMarkdown(page.content);
  let tocIndex = 0;

  const seriesDefaultSlug = getSeriesDefaultSlug(page.series);
  const seriesHref = seriesDefaultSlug
    ? `/tutorials/${seriesDefaultSlug.join("/")}`
    : "/tutorials";

  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <aside className="sticky top-[var(--header-height)] flex h-[calc(100vh-var(--header-height))] w-[260px] shrink-0 flex-col overflow-y-auto border-r border-gray-200 bg-white">
        <div className="sticky top-0 border-b border-gray-200 bg-white px-4 py-3">
          <h1 className="text-lg font-bold text-gray-900">Tutorials</h1>
        </div>
        <div className="space-y-6 p-4">
          {seriesList.map((series) => {
            const defaultSlug = getSeriesDefaultSlug(series);
            const href = defaultSlug
              ? `/tutorials/${defaultSlug.join("/")}`
              : "/tutorials";
            const isActiveSeries = activeSeriesId === series.id;
            return (
              <TutorialSidebarSeries
                key={series.id}
                title={series.title}
                href={href}
                isActive={isActiveSeries}
              >
                {renderSidebarItems(
                  series.items,
                  series.id,
                  [],
                  params.slug
                )}
              </TutorialSidebarSeries>
            );
          })}
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 bg-white">
        <div className="flex-1 py-8 px-8 relative">
          <nav className="mx-auto mb-6 max-w-4xl text-sm text-gray-500">
            <Link href="/tutorials" className="hover:text-primary">
              Tutorials
            </Link>
            <span className="px-2">/</span>
            <Link href={seriesHref} className="hover:text-primary">
              {page.series.title}
            </Link>
            {page.breadcrumbs.length > 0 && (
              <>
                <span className="px-2">/</span>
                <span className="text-gray-700">{page.node.title}</span>
              </>
            )}
          </nav>

          <div className="mx-auto max-w-4xl font-system prose prose-gray text-gray-700">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ children }) => {
                    const id = toc[tocIndex++]?.id;
                    return (
                      <h1
                        id={id}
                        className="mt-6 mb-4 text-[28px] font-bold text-gray-900 first:mt-0 scroll-mt-[calc(var(--header-height)+16px)]"
                      >
                        {children}
                      </h1>
                    );
                  },
                  h2: ({ children }) => {
                    const id = toc[tocIndex++]?.id;
                    return (
                      <h2
                        id={id}
                        className="mt-6 mb-3 text-[22px] font-bold text-gray-900 first:mt-0 scroll-mt-[calc(var(--header-height)+16px)]"
                      >
                        {children}
                      </h2>
                    );
                  },
                  h3: ({ children }) => {
                    const id = toc[tocIndex++]?.id;
                    return (
                      <h3
                        id={id}
                        className="mt-4 mb-2 text-[18px] font-semibold text-gray-900 first:mt-0 scroll-mt-[calc(var(--header-height)+16px)]"
                      >
                        {children}
                      </h3>
                    );
                  },
                  a: ({ href, children, ...props }) => {
                    const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
                    return (
                      <a
                        href={href}
                        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                        className="text-primary hover:underline"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  pre({ children }) {
                    return <>{children}</>;
                  },
                  code({ node, className, children, ...props }) {
                    const hasLanguage =
                      className != null && /language-/.test(String(className));
                    const content = String(children).replace(/\n$/, "");
                    const isBlock = hasLanguage || /\n/.test(content);
                    if (!isBlock) {
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                    const lang = className
                      ? String(className).replace(/^language-/, "")
                      : undefined;
                    return <CodeBlock code={content} label={lang || "Code"} embedded />;
                  },
                  table: ({ children }) => (
                    <div className="my-3 overflow-x-auto rounded-lg border border-gray-200">
                      <table className="my-0 w-full min-w-[400px] border-collapse text-sm">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="border-b border-gray-200 bg-gray-100/80">{children}</thead>
                  ),
                  tr: ({ children }) => (
                    <tr className="border-b border-gray-200 last:border-b-0">{children}</tr>
                  ),
                  th: ({ children, node, className, ...props }) => (
                    <th
                      {...(node?.properties ?? {})}
                      {...props}
                      className={`!border-b !border-r !border-gray-200 px-4 py-3 text-left font-semibold text-gray-800 last:!border-r-0 ${className ?? ""}`.trim()}
                    >
                      <TableCellContent>{children}</TableCellContent>
                    </th>
                  ),
                  td: ({ children, node, className, ...props }) => (
                    <td
                      {...(node?.properties ?? {})}
                      {...props}
                      className={`h-fit border-r border-gray-200 px-4 py-3 text-gray-700 last:border-r-0 ${className ?? ""}`.trim()}
                    >
                      <TableCellContent>{children}</TableCellContent>
                    </td>
                  ),
                }}
              >
                {page.content}
              </ReactMarkdown>
            </div>
            <BackToTop />
          </div>

          {toc.length > 0 && (
            <nav className="sticky top-[var(--header-height)] h-[calc(100vh-var(--header-height))] w-[240px] shrink-0 overflow-y-auto border-l border-gray-200 py-3 px-4">
              <div className="sticky top-0 bg-white mb-1 text-[15px] font-bold text-black z-10 py-1">
                On this page
              </div>
              <ul className="flex flex-col gap-[2px] pl-[2px]" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                {toc.map((entry) => (
                  <li
                    key={entry.id}
                    className={
                      entry.level === 1
                        ? "pl-0"
                        : entry.level === 2
                          ? "pl-[12px]"
                          : "pl-[24px]"
                    }
                  >
                    <a
                      href={`#${entry.id}`}
                      className="block py-1 text-[13px] leading-snug text-gray-600 hover:text-primary transition-colors"
                    >
                      {entry.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
      </main>
    </div>
  );
}
