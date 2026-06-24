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
import { convertToModelMessages, streamText, CoreTool } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Định nghĩa cụm tools bằng kiểu CoreTool chuẩn của Vercel AI SDK
  const myTools: Record<string, CoreTool> = {
    getCurrentTime: {
      description: 'Lấy thời gian và ngày hiện tại.',
      parameters: z.object({
        timezone: z.string().optional().describe('Múi giờ, mặc định là Asia/Ho_Chi_Minh'),
      }),
      execute: async ({ timezone }: any) => {
        const tz = timezone || 'Asia/Ho_Chi_Minh';
        const now = new Date();
        return {
          time: now.toLocaleTimeString('vi-VN', { timeZone: tz }),
          date: now.toLocaleDateString('vi-VN', { timeZone: tz }),
        };
      },
    },
    getWeather: {
      description: 'Lấy thông tin thời tiết hiện tại của một địa điểm cụ thể.',
      parameters: z.object({
        location: z.string().describe('Tên thành phố hoặc quốc gia, ví dụ: Hà Nội, Tokyo'),
      }),
      execute: async ({ location }: any) => {
        const temperature = Math.floor(Math.random() * 15) + 20;
        return {
          location,
          temperature: `${temperature}°C`,
          condition: 'Nhiều mây, có lúc có mưa rào',
        };
      },
    },
  };

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(messages),
    tools: myTools, // Truyền trực tiếp vào đây, sạch sẽ hoàn toàn
    maxSteps: 5, 
  });

  return result.toUIMessageStreamResponse();
}





