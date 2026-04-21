import { Suspense } from "react";
import ToolsPageClient from "@/components/ToolsPageClient";
import { getToolsCatalog } from "@/lib/tools";

export const metadata = {
  title: "Tools | reComputer AI Lab",
  description: "Hardware platform tools: flashing, model conversion, optimization.",
};

export default function ToolsPage() {
  const toolsCatalog = getToolsCatalog();
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Tools</h1>
        <Suspense fallback={<div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 text-gray-500">加载中…</div>}>
          <ToolsPageClient toolsCatalog={toolsCatalog} />
        </Suspense>
      </div>
    </div>
  );
}
