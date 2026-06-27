// lib/ai/run-graph.ts
import { createUIMessageStream } from "ai";
import { graph } from "@/lib/ai/graph";

export function runGraph(input: string) {
  return createUIMessageStream({
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
}