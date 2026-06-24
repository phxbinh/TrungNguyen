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
import { z } from 'zod'; // Dùng zod để định nghĩa schema cho tham số của tool

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(messages),
    // 1. KHAI BÁO CÁC TOOL Ở ĐÂY
    tools: {
      // Tool 1: Hỏi giờ hiện tại
      getCurrentTime: tool({
        description: 'Lấy thời gian và ngày hiện tại.',
        parameters: z.object({}), // Không cần tham số đầu vào
        execute: async () => {
          const now = new Date();
          return {
            time: now.toLocaleTimeString('vi-VN'),
            date: now.toLocaleDateString('vi-VN'),
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
          // Thực tế bạn sẽ gọi API thời tiết ở đây (ví dụ: OpenWeatherMap)
          // Dưới đây là dữ liệu giả lập (Mock data)
          const temperature = Math.floor(Math.random() * 15) + 20; // 20°C - 35°C
          return {
            location,
            temperature: `${temperature}°C`,
            condition: 'Nhiều mây, có lúc có mưa rào',
          };
        },
      }),
    },
    // Tùy chọn: Tự động chạy tool và trả kết quả về cho Model xử lý tiếp câu trả lời
    maxSteps: 5, 
  });

  return result.toUIMessageStreamResponse();
}
