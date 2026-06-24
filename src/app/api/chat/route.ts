import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Ép chạy trên môi trường Edge Runtime để tối ưu tốc độ trên Vercel
export const runtime = 'edge';

export async function POST(req: Request) {
  // Lấy danh sách tin nhắn từ giao diện gửi lên
  const { messages } = await req.json();

  // Gọi mô hình Gemini để xử lý và trả về dạng stream (chữ chạy đến đâu hiển thị đến đấy)
  const result = streamText({
    model: google('gemini-2.5-flash'), // Sử dụng dòng chip Flash siêu nhanh của Google
    messages,
  });

  return result.toDataStreamResponse();
}
