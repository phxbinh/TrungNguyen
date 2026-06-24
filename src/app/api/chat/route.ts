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
import { convertToModelMessages, streamText, tool } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(messages),
    tools: {
      // Tool 1: Hỏi giờ hiện tại (Đã fix lỗi Type bằng tham số dummy)
      getCurrentTime: tool({
        description: 'Lấy thời gian và ngày hiện tại.',
        parameters: z.object({
          timezone: z.string().optional().describe('Múi giờ, mặc định là Asia/Ho_Chi_Minh'),
        }),
        execute: async () => {
          const now = new Date();
          return {
            time: now.toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
            date: now.toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
          };
        },
      }),

      // Tool 2: Xem thời tiết
      getWeather: tool({
        description: 'Lấy thông tin thời tiết hiện tại của một địa điểm cụ thể.',
        parameters: z.object({
          location: z.string().describe('Tên thành phố hoặc quốc gia, ví dụ: Hà Nội, Tokyo'),
        }),
        execute: async ({ location }) => {
          // Thực tế bạn sẽ gọi API thời tiết (như OpenWeatherMap) ở đây
          const temperature = Math.floor(Math.random() * 15) + 20; // Ngẫu nhiên 20°C - 35°C
          return {
            location,
            temperature: `${temperature}°C`,
            condition: 'Nhiều mây, có lúc có mưa rào',
          };
        },
      }),
    },
    // Cho phép Model tự động chạy tool và phản hồi lại kết quả tối đa 5 bước liên tiếp
    maxSteps: 5, 
  });

  return result.toUIMessageStreamResponse();
}

