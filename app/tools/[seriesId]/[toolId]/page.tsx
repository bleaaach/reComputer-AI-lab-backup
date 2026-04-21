import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ seriesId: string; toolId: string }>;
};

export default async function ToolDetailRedirectPage({ params }: PageProps) {
  const { seriesId, toolId } = await params;
  redirect(`/tools?seriesId=${encodeURIComponent(seriesId)}&toolId=${encodeURIComponent(toolId)}`);
}
