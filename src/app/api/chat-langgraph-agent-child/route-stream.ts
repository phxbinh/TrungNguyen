import {
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { graph } from "@/lib/ai/graph-agent-child";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const input =
    messages.at(-1)?.parts
      ?.filter((p: any) => p.type === "text")
      ?.map((p: any) => p.text)
      ?.join("") ?? "";

  const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        const state = await graph.invoke(
          { input },
          { interruptBefore: ["synthesize"] }
        );
    
        writer.write({
          type: "text-start",
          id: "assistant-message",
        });
    
        let finalAnswer = "";
    
        for await (const chunk of synthesizeStream(state)) {
          finalAnswer += chunk;
    
          writer.write({
            type: "text-delta",
            id: "assistant-message",
            delta: chunk,
          });
        }
    
        writer.write({
          type: "text-end",
          id: "assistant-message",
        });
    
        writer.write({
          type: "data-state",
          data: {
            state: {
              input,
              answer: finalAnswer,
            },
          },
        });
      },
    });

  return createUIMessageStreamResponse({ stream });
}