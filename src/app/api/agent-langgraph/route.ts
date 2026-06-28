import { app } from "@/lib/agent-langgraph/graph";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";

//export 
async function Binh_POST__(req: Request) {
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


/*
import { app } from "@/lib/agent-langgraph/graph";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
*/
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // chỉ lấy message mới nhất
  const lastMessage = messages.at(-1);

  if (!lastMessage) {
    return new Response("No message provided", { status: 400 });
  }

  const userContent =
    lastMessage.parts
      ?.filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("") ?? "";

  const result = await app.stream(
    {
      messages: [
        {
          type: "human",
          content: userContent,
        },
      ],
    },
    {
      configurable: {
        thread_id: "test-thread-1",
      },
      streamMode: "messages",
    }
  );

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const textId = crypto.randomUUID();

      writer.write({
        type: "text-start",
        id: textId,
      });

      for await (const [message] of result) {
        // chỉ lấy AIMessage
        if (message._getType?.() !== "ai") continue;

        const content =
          typeof message.content === "string"
            ? message.content
            : Array.isArray(message.content)
            ? message.content.map((c: any) => c.text ?? "").join("")
            : "";

        if (!content) continue;

        writer.write({
          type: "text-delta",
          id: textId,
          delta: content,
        });
      }

      writer.write({
        type: "text-end",
        id: textId,
      });
    },
  });

  return createUIMessageStreamResponse({ stream });
}




