
/*
import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    // THÊM TỪ KHÓA await Ở ĐÂY để giải quyết lỗi Type 'Promise'
    messages: await convertToModelMessages(messages),
  });

  // Trả về luồng dữ liệu tương thích giao diện UI v6
  return result.toUIMessageStreamResponse();
}
*/
/*
import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NextRequest } from 'next/server';

// ======================
// Tool Definition
// ======================

const weatherTool = tool({
  description: 'Lấy thông tin thời tiết cho một thành phố',
  inputSchema: z.object({
    city: z.string().describe('Tên thành phố, ví dụ: Hanoi, Ho Chi Minh, Da Nang'),
  }),
  execute: async ({ city }) => {
    const mockWeather: Record<string, { temp: number; condition: string }> = {
      Hanoi: { temp: 28, condition: 'Sunny' },
      'Ho Chi Minh': { temp: 32, condition: 'Cloudy' },
      'Da Nang': { temp: 30, condition: 'Rain' },
    };

    const weather = mockWeather[city as keyof typeof mockWeather] || { 
      temp: 25, 
      condition: 'Unknown' 
    };

    return {
      city,
      temperature: weather.temp,
      condition: weather.condition,
      timestamp: new Date().toISOString(),
    };
  },
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    const result = streamText({
      model: google('gemini-2.5-flash'), // hoặc gemini-1.5-pro, gemini-2.0-flash-exp

      system: `Bạn là một chatbot thông minh, hữu ích và trả lời bằng tiếng Việt tự nhiên, lịch sự.`,

      messages,
      tools: {
        getWeather: weatherTool,
      },

      maxRetries: 3,
    });

    // ✅ Dùng toUIMessageStreamResponse() cho AI SDK v6 + useChat
    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
*/

import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NextRequest } from 'next/server';

// ======================
// Tool Definition
// ======================

const weatherTool = tool({
  description: 'Lấy thông tin thời tiết cho một thành phố',
  inputSchema: z.object({
    city: z.string().describe('Tên thành phố, ví dụ: Hanoi, Ho Chi Minh, Da Nang'),
  }),
  execute: async ({ city }) => {
    const mockWeather: Record<string, { temp: number; condition: string }> = {
      Hanoi: { temp: 28, condition: 'Sunny' },
      'Ho Chi Minh': { temp: 32, condition: 'Cloudy' },
      'Da Nang': { temp: 30, condition: 'Rain' },
    };

    const weather = mockWeather[city as keyof typeof mockWeather] || { 
      temp: 25, 
      condition: 'Unknown' 
    };

    return {
      city,
      temperature: weather.temp,
      condition: weather.condition,
      timestamp: new Date().toISOString(),
    };
  },
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    const result = streamText({
      model: google('gemini-1.5-flash'),

      system: `Bạn là một chatbot thông minh, hữu ích và trả lời bằng tiếng Việt tự nhiên, lịch sự.`,

      messages,
      tools: {
        getWeather: weatherTool,
      },

      maxRetries: 3,
    });

    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}


