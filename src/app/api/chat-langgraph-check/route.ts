import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { graph } from "@/lib/ai/graph";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastMessage = messages.at(-1)?.content ?? "";

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = await graph.invoke({
        input: lastMessage,
      });

      // stream text ra UI
      writer.write({
        type: "text-delta",
        textDelta: result.answer,
      });

      // giữ nguyên structure cũ
      writer.write({
        type: "data-state",
        data: {
          answer: result.answer,
          state: result,
        },
      });
    },
  });

  return createUIMessageStreamResponse({ stream });
}