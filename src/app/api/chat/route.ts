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

// 1. Chỉ khai báo Description và Parameters (Tuyệt đối không có 'execute' ở đây để tránh lỗi Type)
const getCurrentTimeTool = tool({
  description: 'Lấy thời gian và ngày hiện tại.',
  parameters: z.object({
    timezone: z.string().optional().describe('Múi giờ, mặc định là Asia/Ho_Chi_Minh'),
  }),
});

const getWeatherTool = tool({
  description: 'Lấy thông tin thời tiết hiện tại của một địa điểm cụ thể.',
  parameters: z.object({
    location: z.string().describe('Tên thành phố hoặc quốc gia, ví dụ: Hà Nội, Tokyo'),
  }),
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: await convertToModelMessages(messages),
    tools: {
      getCurrentTime: getCurrentTimeTool,
      getWeather: getWeatherTool,
    },
    // 2. Chuyển toàn bộ logic chạy hàm vào onToolCall. 
    // Đây là cách duy nhất hoạt động độc lập không phụ thuộc vào Type cấu hình của Model Provider.
    onToolCall: async ({ toolCalls }) => {
      const results = [];

      for (const call of toolCalls) {
        if (call.toolName === 'getCurrentTime') {
          const args = call.args as { timezone?: string };
          const tz = args.timezone || 'Asia/Ho_Chi_Minh';
          const now = new Date();
          
          results.push({
            toolCallId: call.toolCallId,
            result: {
              time: now.toLocaleTimeString('vi-VN', { timeZone: tz }),
              date: now.toLocaleDateString('vi-VN', { timeZone: tz }),
            },
          });
        } 
        
        else if (call.toolName === 'getWeather') {
          const args = call.args as { location: string };
          const temperature = Math.floor(Math.random() * 15) + 20;
          
          results.push({
            toolCallId: call.toolCallId,
            result: {
              location: args.location,
              temperature: `${temperature}°C`,
              condition: 'Nhiều mây, có lúc có mưa rào',
            },
          });
        }
      }

      return results;
    },
    maxSteps: 5, 
  });

  return result.toUIMessageStreamResponse();
}




