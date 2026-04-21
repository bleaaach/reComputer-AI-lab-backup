import { notFound } from "next/navigation";
import { getModelBySlug } from "@/lib/models-data.generated";
import ModelDetailView from "@/components/ModelDetailView";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getModelBySlug(slug);
  if (!model) return { title: "Model Not Found | reComputer AI Lab" };
  return {
    title: `${model.name} | reComputer AI Lab`,
    description: model.overview ?? `Model details for ${model.name}.`,
  };
}

export default async function ModelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = getModelBySlug(slug);
  if (!model) notFound();
  return <ModelDetailView model={model} />;
}
