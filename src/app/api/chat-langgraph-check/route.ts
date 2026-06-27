/*
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
*/



/*
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { graph } from "@/lib/ai/graph";

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

      const answer = result.answer ?? "";

      writer.write({
        type: "text-delta",
        id: "assistant-message",
        delta: answer,
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
*/




import { graph } from "@/lib/ai/graph";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = await graph.stream(
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

const stream = createUIMessageStream({
  execute: async ({ writer }) => {
    const textId = crypto.randomUUID();

    writer.write({
      type: "text-start",
      id: textId,
    });
// Lấy toàn bộ toolMessages
/*
    for await (const chunk of result) {
      const lastMessage = chunk.messages?.at(-1);
      if (!lastMessage) continue;

      const content =
        typeof lastMessage.content === "string"
          ? lastMessage.content
          : Array.isArray(lastMessage.content)
          ? lastMessage.content.map((c: any) => c.text ?? "").join("")
          : "";

      if (!content) continue;

      writer.write({
        type: "text-delta",
        id: textId,
        delta: content,
      });
    }
//*/

// Chỉ lấy AiMessage
//*
for await (const chunk of result) {
  const lastMessage = chunk.messages?.at(-1);

  if (!lastMessage) continue;

  // bỏ tool message
  if (lastMessage._getType?.() !== "ai") continue;

  const content =
    typeof lastMessage.content === "string"
      ? lastMessage.content
      : Array.isArray(lastMessage.content)
      ? lastMessage.content.map((c: any) => c.text ?? "").join("")
      : "";

  if (!content) continue;

  writer.write({
    type: "text-delta",
    id: textId,
    delta: content,
  });
}
//*/



    writer.write({
      type: "text-end",
      id: textId,
    });
  },
});

  return createUIMessageStreamResponse({ stream });
}






