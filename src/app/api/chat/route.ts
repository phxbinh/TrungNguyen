
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


import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import { NextRequest } from 'next/server';

// ======================
// Định nghĩa Tools (bạn có thể thêm nhiều tool)
// ======================

const weatherTool = tool({
  description: 'Lấy thông tin thời tiết cho một thành phố',
  parameters: z.object({
    city: z.string().describe('Tên thành phố, ví dụ: Hanoi, Ho Chi Minh, Da Nang'),
  }),
  execute: async ({ city }) => {
    // Thay bằng API thật (OpenWeather, Visual Crossing,...)
    // Ví dụ mock:
    const mockWeather = {
      Hanoi: { temp: 28, condition: 'Sunny' },
      'Ho Chi Minh': { temp: 32, condition: 'Cloudy' },
      'Da Nang': { temp: 30, condition: 'Rain' },
    }[city as keyof typeof mockWeather] || { temp: 25, condition: 'Unknown' };

    return {
      city,
      temperature: mockWeather.temp,
      condition: mockWeather.condition,
      timestamp: new Date().toISOString(),
    };
  },
});

// Thêm tool khác nếu cần (ví dụ: search, calculator, database query...)

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages is required', { status: 400 });
    }

    const result = streamText({
      model: google('gemini-2.5-flash'), // hoặc gemini-1.5-pro, gemini-2.0-flash-exp...
      // system prompt
      system: `Bạn là một chatbot hữu ích, trả lời bằng tiếng Việt một cách tự nhiên và lịch sự.
               Khi cần dùng tool, hãy sử dụng chúng để lấy thông tin chính xác.`,

      messages,
      tools: {
        getWeather: weatherTool,
        // thêm tool khác ở đây
      },

      maxRetries: 3,
      // experimental_continueSteps: true, // nếu muốn agent loop nhiều bước
    });

    // Stream về client (AI SDK UI sẽ xử lý đẹp)
    return result.toDataStreamResponse({
      // Tùy chọn
      sendUsage: true,           // gửi token usage
      sendReasoning: true,       // nếu model hỗ trợ reasoning
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}







