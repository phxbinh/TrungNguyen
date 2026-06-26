import { app } from "@/lib/agent-langgraph/graph";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await app.stream(
    {
      messages: messages.map((m) => ({
        type: m.role,
        content:
          m.parts
            ?.filter((p) => p.type === "text")
            .map((p) => p.text)
            .join("") ?? "",
      })),
    },
    {
      configurable: {
        thread_id: "test-thread-1",
      },
      streamMode: "values",
    }
  );
/*
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      for await (const chunk of result) {
        const lastMessage = chunk.messages?.at(-1);

        if (!lastMessage) continue;

        const content =
          typeof lastMessage.content === "string"
            ? lastMessage.content
            : Array.isArray(lastMessage.content)
            ? lastMessage.content
                .map((c: any) => c.text ?? "")
                .join("")
            : "";

        if (!content) continue;

        writer.write({
          type: "text-delta",
          id: lastMessage.id ?? crypto.randomUUID(),
          delta: content,
        });
      }
    },
  });
*/


const stream = createUIMessageStream({
  execute: async ({ writer }) => {
    for await (const chunk of result) {
      const lastMessage = chunk.messages?.at(-1);

      if (!lastMessage) continue;

      const content =
        typeof lastMessage.content === "string"
          ? lastMessage.content
          : Array.isArray(lastMessage.content)
          ? lastMessage.content
              .map((c: any) => c.text ?? "")
              .join("")
          : "";

      if (!content) continue;

      writer.write({
        type: "text",
        id: lastMessage.id ?? crypto.randomUUID(),
        text: content,
      });
    }
  },
});

  return createUIMessageStreamResponse({ stream });
}