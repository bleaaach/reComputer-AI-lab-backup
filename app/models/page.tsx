import ModelsPageClient from "@/components/ModelsPageClient";
import {
  featuredModels,
  familiesByTab,
} from "@/lib/models-data.generated";

export const metadata = {
  title: "Models | reComputer AI Lab",
  description: "AI models optimized for reComputer. Run locally at the edge.",
};

export default function ModelsPage() {
  return (
    <ModelsPageClient
      featuredModels={featuredModels}
      familiesByTab={familiesByTab}
    />
  );
}
