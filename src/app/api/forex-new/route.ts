import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('source') || 'forex-factory'; // Theo docs mới: 'forex-factory', 'mql5', hoặc 'fxstreet'
  const timeframe = searchParams.get('timeframe') || 'today';   // 'today' hoặc 'week'

  const apiKey = process.env.JBLANKED_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Chưa cấu hình JBLANKED_API_KEY trong file .env.local' }, { status: 500 });
  }

  try {
    // 1. Cấu hình đúng URL chuẩn từ tài liệu JBlanked
    const url = `https://www.jblanked.com/news/api/${source}/calendar/${timeframe}/`;

    // 2. Gọi fetch với Header Authorization theo đúng chuẩn "Api-Key ..." của hệ thống mới
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${apiKey}`, 
      },
      next: { revalidate: 900 } // Cache 15 phút tránh tốn request
    });

    if (!response.ok) {
      // Nếu API trả lỗi (Ví dụ: 401 do sai Key), đọc text lỗi gửi về Client
      const errText = await response.text();
      return NextResponse.json({ error: `JBlanked API Error (${response.status}): ${errText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Fetch forex news error:', error);
    return NextResponse.json({ error: `Server Fetch Failed: ${error.message}` }, { status: 500 });
  }
}
