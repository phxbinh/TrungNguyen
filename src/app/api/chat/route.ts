import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    // Thêm hàm convertToModelMessages để chuyển đổi cấu trúc UIMessage mới của v6 sang dạng model đọc được
    messages: convertToModelMessages(messages),
  });

  // Đổi hàm này thành toUIMessageStreamResponse chuẩn AI SDK v6
  return result.toUIMessageStreamResponse();
}
