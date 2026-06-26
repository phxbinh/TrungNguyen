// src/app/api/chat-langgraph-check/route.ts
import { createUIMessageStreamResponse } from 'ai';
import { toUIMessageStream } from '@ai-sdk/langchain';
import { graph } from "@/lib/ai/graph";
import { AgentState } from "@/lib/ai/state";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages?.length) {
      return new Response(JSON.stringify({ error: "Messages is required" }), { 
        status: 400 
      });
    }

    // Tạm thời convert thủ công (đơn giản & ổn định)
    const langchainMessages = messages.map((msg: any) => ({
      role: msg.role === 'user' ? 'human' : 'ai',
      content: msg.content || msg.text || '',
    }));

    // Stream từ LangGraph
    const stream = await graph.streamEvents(
      { 
        messages: langchainMessages 
      } as Partial<AgentState>,
      {
        version: "v2",
        streamMode: ["values", "messages", "updates"],
        configurable: {
          thread_id: "thread-" + Date.now(), // tạm thời, sau sẽ cải thiện
        },
      }
    );

    const uiStream = toUIMessageStream(stream);

    return createUIMessageStreamResponse({
      stream: uiStream,
    });

  } catch (error: any) {
    console.error("LangGraph streaming error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        message: error.message 
      }), 
      { status: 500 }
    );
  }
}