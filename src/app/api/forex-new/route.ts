import { NextResponse } from 'next/server';
import { EconomicEvent, NewsSource } from './forex';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Mặc định lấy nguồn từ Forex Factory và xem lịch theo Tuần (week) hoặc Hôm nay (today)
  const source = (searchParams.get('source') as NewsSource) || 'forexfactory';
  const timeframe = searchParams.get('timeframe') || 'week'; // 'today' hoặc 'week'

  const apiKey = process.env.JBLANKED_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  try {
    // Endpoint chuẩn của JBlanked: https://api.jblanked.com/v1/news
/*
    const response = await fetch(
      `https://api.jblanked.com/v1/news?source=${source}&timeframe=${timeframe}`,
      {
        method: 'GET',
        headers: {
          'x-api-key': apiKey, // Truyền key qua header theo tài liệu của JBlanked
          'Content-Type': 'application/json',
        },
        next: { revalidate: 900 } // Cache dữ liệu trong 15 phút để tối ưu hiệu năng (Core Web Vitals)
      }
    );
*/
// Thay vì endpoint chung, hãy thử endpoint tường minh này:
const response = await fetch(
  `https://api.jblanked.com/v1/forexfactory/today`, // Gọi trực tiếp nguồn/timeframe trên URL
  {
    method: 'GET',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
  }
);




    if (!response.ok) {
      throw new Error(`JBlanked API responded with status: ${response.status}`);
    }

    const data: EconomicEvent[] = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Fetch forex news error:', error);
    return NextResponse.json({ error: 'Failed to fetch forex news' }, { status: 500 });
  }
}
