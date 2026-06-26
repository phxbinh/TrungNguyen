import { createUIMessageStreamResponse } from 'ai';
import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import { graph } from "@/lib/ai/graph";   // hoặc app tùy bạn export
import { AgentState } from "@/lib/ai/state"; // điều chỉnh path nếu cần

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();   // ← Dùng messages thay vì message (chuẩn Vercel AI)

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages is required" }), { 
        status: 400 
      });
    }

    // Chuyển Vercel messages → LangChain messages
    const langchainMessages = await toBaseMessages(messages);

    // Stream từ LangGraph (dùng streamEvents để tốt nhất với v6)
    const stream = await graph.streamEvents(
      { 
        messages: langchainMessages 
      } as Partial<AgentState>,
      {
        version: "v2",
        streamMode: ["values", "messages", "updates"],
        configurable: {
          thread_id: "default-thread", // TODO: sau thay bằng dynamic thread_id
        },
      }
    );

    // Chuyển stream LangGraph → Vercel UI Stream
    const uiStream = toUIMessageStream(stream);

    // Cách bạn muốn: return result.toUIMessageStreamResponse()
    return createUIMessageStreamResponse({
      stream: uiStream,
    });

  } catch (error) {
    console.error("Streaming error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error instanceof Error ? error.message : "Unknown error" 
      }), 
      { status: 500 }
    );
  }
}