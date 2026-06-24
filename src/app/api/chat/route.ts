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

import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Chuyển đổi dữ liệu sang định dạng Core Message chuẩn
  const formattedMessages = messages.map((m: any) => {
    const textContent = m.parts
      ?.filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join('\n') || '';

    return {
      role: m.role,
      content: textContent,
    };
  });

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: formattedMessages,
    tools: {
      getWeather: {
        description: 'Lấy thông tin thời tiết hiện tại của một thành phố',
        // ĐỔI TỪ parameters THÀNH inputSchema THEO CHUẨN V6
        inputSchema: z.object({
          city: z.string().describe('Tên thành phố cần xem thời tiết, ví dụ: Hà Nội, Sài Gòn'),
        }),
        execute: async ({ city }) => {
          // Giả lập gọi API lấy thời tiết thực tế
          const temperature = Math.floor(Math.random() * (35 - 20 + 1)) + 20;
          return {
            location: city,
            temperature: `${temperature}°C`,
            condition: 'Có nắng nhẹ, gió mát',
          };
        },
      },
    },
  });

  return result.toUIMessageStreamResponse();
}








