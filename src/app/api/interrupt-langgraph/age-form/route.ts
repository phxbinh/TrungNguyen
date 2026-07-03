import { NextRequest, NextResponse } from "next/server";
import { graph, Command } from "@/lib/interrupt-langgraph/age-graph";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const threadId = body.threadId;

  const config = {
    configurable: {
      thread_id: threadId,
    },
  };

  let result;

  if (body.resume !== undefined) {
    result = await graph.invoke(
      new Command({
        resume: body.resume,
      }),
      config
    );
  } else {
    result = await graph.invoke(
      {
        age: null,
        pendingQuestion: null,
      },
      config
    );
  }

  return NextResponse.json(result);
}