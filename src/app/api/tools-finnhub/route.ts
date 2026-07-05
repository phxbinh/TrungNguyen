// app/api/tools-finnhub/route.ts
import { NextRequest, NextResponse } from "next/server";
import { runAnalysis } from "@/lib/tools-finnhub/graph";

export async function POST(req: NextRequest) {
  try {
    const { symbol } = await req.json();

    if (!symbol || typeof symbol !== "string") {
      return NextResponse.json({ error: "Thiếu symbol" }, { status: 400 });
    }

    const result = await runAnalysis(symbol.toUpperCase());

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      analysis: result.analysis,
      newsUsed: result.filteredNews,
      totalNewsFetched: result.rawNews.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Lỗi không xác định" },
      { status: 500 }
    );
  }
}
