// app/api/fxstreet/calendar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface EconomicEvent {
  time: string;
  currency: string;
  event: string;
  impact: 'High' | 'Medium' | 'Low' | 'Unknown';
  actual?: string;
  forecast?: string;
  previous?: string;
  link?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    const { data } = await axios.get('https://www.fxstreet.com/economic-calendar', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);
    const events: EconomicEvent[] = [];

    // Các selector chính (có thể cần update theo thời gian)
    $('tr.economic-calendar__row, .calendar__row, tbody tr').each((_, el) => {
      const $el = $(el);

      const time = $el.find('.time, [data-time], .datetime').first().text().trim();
      const currency = $el.find('.currency-flag, .flag, .currency').first().text().trim() || 
                       $el.find('td:first-child').text().trim();
      const event = $el.find('.event-name, .name, .title, td.event').first().text().trim();
      const actual = $el.find('.actual, .act').first().text().trim();
      const forecast = $el.find('.forecast, .consensus').first().text().trim();
      const previous = $el.find('.previous').first().text().trim();

      // Xác định impact
      let impact: 'High' | 'Medium' | 'Low' | 'Unknown' = 'Unknown';
      const impactClass = $el.find('.impact, .volatility, .bullet').attr('class') || '';
      
      if (impactClass.includes('high') || impactClass.includes('red')) impact = 'High';
      else if (impactClass.includes('medium') || impactClass.includes('orange')) impact = 'Medium';
      else if (impactClass.includes('low') || impactClass.includes('green')) impact = 'Low';

      if (event && currency) {
        events.push({
          time,
          currency: currency.toUpperCase(),
          event,
          impact,
          actual: actual || undefined,
          forecast: forecast || undefined,
          previous: previous || undefined,
        });
      }
    });

    return NextResponse.json({
      success: true,
      date,
      count: events.length,
      events: events.slice(0, 100), // Giới hạn
    });

  } catch (error: any) {
    console.error('FXStreet scrape error:', error.message);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Có thể trang FXStreet thay đổi cấu trúc. Cần cập nhật selector.'
    }, { status: 500 });
  }
}