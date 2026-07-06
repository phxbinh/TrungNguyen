import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchNews } from "./gnews";

const BodySchema = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(20).default(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = BodySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { query, limit } = parsed.data;

    const news = await fetchNews(query, limit);

    return NextResponse.json({
      success: true,
      total: news.length,
      news,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}