import {
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { graph } from "@/lib/parent-child-agent/graph-agent-child";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const input =
    messages.at(-1)?.parts
      ?.filter((p: any) => p.type === "text")
      ?.map((p: any) => p.text)
      ?.join("") ?? "";

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const result = await graph.invoke({ input });

      writer.write({
        type: "text-start",
        id: "assistant-message",
      });

      writer.write({
        type: "text-delta",
        id: "assistant-message",
        delta: result.answer ?? "",
      });

      writer.write({
        type: "text-end",
        id: "assistant-message",
      });

      writer.write({
        type: "data-state",
        data: {
          state: result,
        },
      });
    },
  });

  return createUIMessageStreamResponse({ stream });
}