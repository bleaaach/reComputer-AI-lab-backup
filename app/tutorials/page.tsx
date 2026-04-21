import { redirect } from "next/navigation";
import { getDefaultTutorialSlug } from "@/lib/tutorials";

export const metadata = {
  title: "Tutorials | reComputer AI Lab",
  description: "Getting started, burn-in, tools, and model deployment guides.",
};

export default function TutorialsPage() {
  const slug = getDefaultTutorialSlug();
  if (!slug) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Tutorials</h1>
        <p className="mt-2 text-gray-600">No tutorials available yet.</p>
      </div>
    );
  }
  redirect(`/tutorials/${slug.join("/")}`);
}
