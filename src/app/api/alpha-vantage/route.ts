import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Chưa cấu hình ALPHA_VANTAGE_API_KEY' }, { status: 500 });
  }

  try {
    // Endpoint lấy tin tức thị trường tài chính chuyên sâu về Forex/Vĩ mô
    //const url = `https://www.alphavantage.co/query?function=MARKET_NEWS&topics=forex,economy_macro&apikey=${apiKey}`;

// ❌ Dòng cũ của bạn (bị rỗng data):
// const url = `https://www.alphavantage.co/query?function=MARKET_NEWS&topics=forex,economy_macro&apikey=${apiKey}`;

//  Dòng mới thay thế (Mở rộng phạm vi lấy tin để CHẮC CHẮN luôn có data):
const url = `https://www.alphavantage.co/query?function=MARKET_NEWS&tickers=FOREX&apikey=${apiKey}`;



    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store'
      //next: { revalidate: 900 } // Cache 15 phút bảo vệ rate limit
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Alpha Vantage trả lỗi: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();

    // Khử lỗi nếu hạn ngạch free bị gọi quá nhanh trong thời gian ngắn
    if (data["Note"] || data["Information"]) {
      return NextResponse.json({ error: data["Note"] || data["Information"] }, { status: 429 });
    }

    // Alpha Vantage trả dữ liệu nằm trong mảng "feed"
    const feed = data.feed || [];
    return NextResponse.json(feed);

  } catch (error: any) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: `Server Fetch Failed: ${error.message}` }, { status: 500 });
  }
}
