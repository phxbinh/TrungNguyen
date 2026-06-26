import { app } from "@/lib/agent-langgraph/graph";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await app.stream(
    {
      messages: await convertToModelMessages(messages),
    },
    {
      configurable: {
        thread_id: "test-thread-1",
      },
      streamMode: "values",
    }
  );

  return createUIMessageStreamResponse({
    execute: async ({ writer }) => {
      for await (const chunk of result) {
        const lastMessage = chunk.messages?.at(-1);

        if (!lastMessage) continue;

        if (lastMessage.content) {
          writer.write({
            type: "text-delta",
            id: lastMessage.id ?? crypto.randomUUID(),
            delta:
              typeof lastMessage.content === "string"
                ? lastMessage.content
                : JSON.stringify(lastMessage.content),
          });
        }
      }
    },
  });
}