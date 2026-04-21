"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function CodeBlock({
  code,
  language = "text",
  label,
  embedded,
}: {
  code: string;
  language?: string;
  label?: string;
  /** 嵌入在 wiki 等段落中：无上下 margin，背景与 section 一致 */
  embedded?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const highlightedLanguage = language || "text";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (embedded) {
    return (
      <div className="my-0 rounded-lg border border-gray-200 bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-700 px-3 py-2">
          {label && <span className="text-xs font-medium text-gray-400">{label}</span>}
          <button
            type="button"
            onClick={copy}
            className="rounded px-2 py-1 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <SyntaxHighlighter
          language={highlightedLanguage}
          style={oneDark}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: 1.625,
          }}
          codeTagProps={{ style: { background: "transparent" } }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-700 px-3 py-2">
        {label && <span className="text-xs font-medium text-gray-400">{label}</span>}
        <button
          type="button"
          onClick={copy}
          className="rounded px-2 py-1 text-xs font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <SyntaxHighlighter
        language={highlightedLanguage}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          background: "transparent",
          fontSize: "0.875rem",
          lineHeight: 1.625,
        }}
        codeTagProps={{ style: { background: "transparent" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
