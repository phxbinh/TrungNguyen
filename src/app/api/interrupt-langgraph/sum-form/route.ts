import { NextRequest, NextResponse } from "next/server";
import { graph, Command } from "@/lib/interrupt-langgraph/sum-graph";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const config = {
      configurable: {
        thread_id: body.threadId,
      },
    };

    let result;

    // Resume graph
    if (body.resume !== undefined) {
      result = await graph.invoke(
        new Command({
          resume: body.resume,
        }),
        config
      );
    } else {
      // Start graph
      result = await graph.invoke({}, config);
    }

    console.log("Graph result:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Route error:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}