import {
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { graph } from "@/lib/ai/graph";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastMessage = messages.at(-1)?.content ?? "";

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = await graph.invoke({
        input: lastMessage,
      });

      const answer = result.answer ?? "";

      writer.write({
        type: "text-delta",
        id: "assistant-message",
        delta: answer,
      });

      writer.write({
        type: "data-state",
        data: {
          answer,
          state: result,
        },
      });
    },
  });

  return createUIMessageStreamResponse({ stream });
}