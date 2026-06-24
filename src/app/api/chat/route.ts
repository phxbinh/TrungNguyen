import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages,
  });

  // Đổi thành toTextStreamResponse để khớp với định dạng TypeScript hiện tại
  return result.toTextStreamResponse();
}
