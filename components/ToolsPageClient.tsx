"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import CodeBlock from "@/components/CodeBlock";
import BackToTop from "@/components/BackToTop";
import type { ToolSeries, ToolEntry } from "@/lib/tools";
import { withBasePath } from "@/lib/base-path";

type Props = {
  toolsCatalog: ToolSeries[];
};

type ToolDetailData = {
  series: ToolSeries;
  tool: ToolEntry;
  content: string;
};

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

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mt-6 mb-4 text-[28px] font-bold text-gray-900 first:mt-0 scroll-mt-[calc(var(--header-height)+16px)]">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-6 mb-3 text-[22px] font-bold text-gray-900 first:mt-0 scroll-mt-[calc(var(--header-height)+16px)]">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-4 mb-2 text-[18px] font-semibold text-gray-900 first:mt-0 scroll-mt-[calc(var(--header-height)+16px)]">
      {children}
    </h3>
  ),
  a: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal =
      href?.startsWith("http://") || href?.startsWith("https://");
    const resolvedHref = isExternal ? href : withBasePath(href);
    return (
      <a
        href={resolvedHref}
        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
        className="text-primary hover:underline"
        {...props}
      >
        {children}
      </a>
    );
  },
  pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  code: ({
    node,
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement> & { node?: unknown }) => {
    const hasLanguage =
      className != null && /language-/.test(String(className));
    const codeContent = String(children).replace(/\n$/, "");
    const isBlock = hasLanguage || /\n/.test(codeContent);
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
    return (
      <CodeBlock
        code={codeContent}
        language={lang || "text"}
        label={lang || "Code"}
        embedded
      />
    );
  },
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-gray-200">
      <table className="my-0 w-full min-w-[400px] border-collapse text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="border-b border-gray-200 bg-gray-100/80">
      {children}
    </thead>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="border-b border-gray-200 last:border-b-0">{children}</tr>
  ),
  th: ({
    children,
    node,
    className,
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement> & { node?: unknown }) => (
    <th
      {...(typeof node === "object" && node !== null && "properties" in node
        ? (node as { properties?: Record<string, unknown> }).properties
        : {})}
      {...props}
      className={`!border-b !border-r !border-gray-200 px-4 py-3 text-left font-semibold text-gray-800 last:!border-r-0 ${className ?? ""}`.trim()}
    >
      <TableCellContent>{children}</TableCellContent>
    </th>
  ),
  td: ({
    children,
    node,
    className,
    ...props
  }: React.TdHTMLAttributes<HTMLTableCellElement> & { node?: unknown }) => (
    <td
      {...(typeof node === "object" && node !== null && "properties" in node
        ? (node as { properties?: Record<string, unknown> }).properties
        : {})}
      {...props}
      className={`h-fit border-r border-gray-200 px-4 py-3 text-gray-700 last:border-r-0 ${className ?? ""}`.trim()}
    >
      <TableCellContent>{children}</TableCellContent>
    </td>
  ),
};

function ToolDetailInPlace({
  seriesId,
  toolId,
  onBack,
}: {
  seriesId: string;
  toolId: string;
  onBack: () => void;
}) {
  const [data, setData] = useState<ToolDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetch(
      withBasePath(
        `/api/tools/${encodeURIComponent(seriesId)}/${encodeURIComponent(toolId)}`
      )!
    )
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((json) => {
        if (!cancelled) {
          setData({
            series: json.series,
            tool: json.tool,
            content: json.content ?? "",
          });
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [seriesId, toolId]);

  if (loading) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-gray-500">加载中…</p>
      </section>
    );
  }
  if (error || !data) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-gray-500">未找到该工具或加载失败。</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-primary hover:underline"
        >
          Back to list
        </button>
      </section>
    );
  }

  const { series, tool, content } = data;

  return (
    <section className="min-w-0 rounded-lg border border-gray-200 bg-white overflow-hidden">
      <div className="bg-white px-6 pt-6 pb-6">
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 text-gray-500 hover:text-primary"
            aria-label="Back to Tools list"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">{series.title}</span>
        </nav>

        <header>
          <h2 className="text-xl font-bold text-gray-900">{tool.title}</h2>
          {tool.description && (
            <p className="mt-2 text-sm text-gray-600">{tool.description}</p>
          )}
        </header>
      </div>

      <hr className="border-0 border-t border-gray-200" />

      <div className="px-4 sm:px-6 lg:px-12 py-8 sm:py-10 lg:py-12 font-system prose prose-gray max-w-none text-gray-700 min-w-0">
        {content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <p className="text-gray-500">文档待补充。</p>
        )}
      </div>
      <BackToTop />
    </section>
  );
}

export default function ToolsPageClient({ toolsCatalog }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seriesIdFromUrl = searchParams.get("seriesId");
  const toolIdFromUrl = searchParams.get("toolId");
  const showDetail =
    Boolean(seriesIdFromUrl && toolIdFromUrl) &&
    toolsCatalog.some(
      (s) =>
        s.id === seriesIdFromUrl &&
        s.categories.some((c) =>
          c.items.some((t) => t.id === toolIdFromUrl)
        )
    );

  const [selectedSeriesId, setSelectedSeriesId] = useState(
    toolsCatalog[0]?.id ?? ""
  );

  useEffect(() => {
    if (showDetail && seriesIdFromUrl) {
      setSelectedSeriesId(seriesIdFromUrl);
    }
  }, [showDetail, seriesIdFromUrl]);

  const selectedSeries = useMemo(
    () => toolsCatalog.find((series) => series.id === selectedSeriesId),
    [selectedSeriesId, toolsCatalog]
  );

  const categories = selectedSeries?.categories ?? [];

  const goToTool = (seriesId: string, toolId: string) => {
    router.push(
      `/tools?seriesId=${encodeURIComponent(seriesId)}&toolId=${encodeURIComponent(
        toolId
      )}`
    );
  };

  const goBackToList = () => {
    router.push("/tools");
  };

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[240px_1fr]">
      <aside className="h-fit rounded-lg border border-gray-200 bg-white p-4 lg:sticky lg:top-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Series
        </p>
        <div className="mt-3 space-y-2">
          {toolsCatalog.map((series) => {
            const isActive = series.id === selectedSeriesId;
            return (
              <button
                key={series.id}
                type="button"
                onClick={() => setSelectedSeriesId(series.id)}
                className={`w-full rounded px-3 py-2 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                {series.title}
              </button>
            );
          })}
        </div>
      </aside>

      <main className="min-w-0">
        {showDetail && seriesIdFromUrl && toolIdFromUrl ? (
          <ToolDetailInPlace
            seriesId={seriesIdFromUrl}
            toolId={toolIdFromUrl}
            onBack={goBackToList}
          />
        ) : (
          <section className="rounded-lg border border-gray-200 bg-white overflow-hidden">
            <div className="bg-white px-6 pt-6 pb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedSeries?.title ?? "Tools"}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {selectedSeries?.description ?? "Tools list for the selected series."}
              </p>
            </div>

            <hr className="border-0 border-t border-gray-200" />

            <div className="p-6 space-y-6">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.id}>
                    <h3 className="text-base font-semibold text-gray-900">
                      {category.title}
                    </h3>
                    <div className="mt-3 space-y-3">
                      {(category.items ?? []).map((tool) => (
                        <button
                          key={tool.id}
                          type="button"
                          onClick={() =>
                            goToTool(selectedSeriesId, tool.id)
                          }
                          className="flex w-full flex-nowrap items-center justify-start gap-3 rounded-xl border border-gray-200 bg-[#fafafa] p-4 text-left transition hover:border-primary"
                        >
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-900">
                              {tool.title}
                            </h4>
                            {tool.description && (
                              <p className="mt-1 text-sm text-gray-600">
                                {tool.description}
                              </p>
                            )}
                          </div>
                          <svg
                            className="h-5 w-5 shrink-0 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">暂无可用工具。</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
