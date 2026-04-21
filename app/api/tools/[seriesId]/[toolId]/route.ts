import { NextResponse } from "next/server";
import { getToolBySlug } from "@/lib/tools";

export async function GET(
  _request: Request,
  context: { params: Promise<{ seriesId: string; toolId: string }> }
) {
  const { seriesId, toolId } = await context.params;
  const result = getToolBySlug(seriesId, toolId);
  if (!result) {
    return NextResponse.json(
      { error: "Tool not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({
    series: result.series,
    category: result.category,
    tool: result.tool,
    content: result.content,
  });
}
