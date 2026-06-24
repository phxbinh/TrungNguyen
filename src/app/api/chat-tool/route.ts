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
import { streamText, tool, stepCountIs } from 'ai';   // ← import stepCountIs
import { z } from 'zod';
import { NextRequest } from 'next/server';

const weatherTool = tool({
  description: 'Get the weather for a city.',
  inputSchema: z.object({ city: z.string() }),
  execute: async ({ city }) => `Thời tiết ở ${city} hiện đang rất sunny và đẹp trời.`,
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      tools: { getWeather: weatherTool },
      system: 'Bạn là trợ lý AI thân thiện, trả lời bằng tiếng Việt khi người dùng hỏi bằng tiếng Việt.',
      
      // ✅ Dùng cái này thay vì maxSteps
      stopWhen: stepCountIs(5),        // Tối đa 5 steps (tool call rounds)

      messages,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}




