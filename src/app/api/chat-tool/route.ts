/*
import { google } from '@ai-sdk/google';
import { generateText, tool, stepCountIs } from 'ai';   // ← thêm stepCountIs
import { z } from 'zod';
import { NextRequest } from 'next/server';

const weatherTool = tool({
  description: 'Get the weather for a city.',
  inputSchema: z.object({ city: z.string() }),
  execute: async ({ city }) => `It is sunny in ${city}.`,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const { text, toolCalls, steps, usage } = await generateText({
      model: google('gemini-2.5-flash'),
      tools: { getWeather: weatherTool },
      
      // ✅ Cách đúng
      stopWhen: stepCountIs(5),        // Dừng tối đa sau 5 steps

      // Hoặc kết hợp nhiều điều kiện:
      // stopWhen: [stepCountIs(5), hasToolCall('getWeather')],

      prompt: prompt || 'What is the weather in San Francisco right now?',
    });

    return Response.json({
      text,
      toolCalls,
      steps,      // optional: để debug multi-step
      usage,
    });
  } catch (error: any) {
    console.error(error);
    return Response.json({ 
      error: 'Something went wrong', 
      message: error.message 
    }, { status: 500 });
  }
}
*/


// src/app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const weatherTool = tool({
  description: 'Get the weather for a city.',
  inputSchema: z.object({ city: z.string() }),
  execute: async ({ city }) => `Thời tiết hiện tại ở ${city} rất đẹp và sunny.`,
});

//import { tool } from 'ai';
//import { z } from 'zod';

const getCurrentTime = tool({
  description: 'Lấy giờ hiện tại',
  inputSchema: z.object({}),

  execute: async () => {
    const now = new Date();

    return {
      time: now.toLocaleTimeString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
      }),
      date: now.toLocaleDateString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
      }),
      timezone: 'Asia/Ho_Chi_Minh',
      iso: now.toISOString(),
      timestamp: now.getTime(),
    };
  },
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const result = await streamText({   // ← giữ await
      model: google('gemini-2.5-flash'),
      tools: {
        getWeather: ưeatherTool,
        getCurrentTime: getCurrentTime
      },
      system: `Bạn là trợ lý AI thân thiện, trả lời bằng tiếng Việt.
- Nếu hỏi về thời tiết của thành phố thì gọi tool getWeather.
- Nếu không thì trả lời bằng kiến thức của mình.
`,
      
      stopWhen: stepCountIs(5),

      messages: await convertToModelMessages(messages),
    });

    // ✅ Dùng toDataStreamResponse (phù hợp với useChat + tools)
    //return result.toDataStreamResponse();
    
    // Nếu vẫn lỗi type, thử dòng này thay thế:
    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}



