// app/api/fxstreet/calendar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface EconomicEvent {
  time: string;
  currency: string;
  event: string;
  impact: 'High' | 'Medium' | 'Low' | 'Unknown';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export async function GET() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    await page.goto('https://www.fxstreet.com/economic-calendar', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // Đợi bảng load
    await page.waitForSelector('table, .economic-calendar, .calendar-events', { timeout: 15000 });

    const events = await page.evaluate(() => {
      const rows = document.querySelectorAll('tr, .event-row, .calendar-row');
      const result: EconomicEvent[] = [];

      rows.forEach((row) => {
        const timeEl = row.querySelector('.time, .datetime, [data-time], td:first-child');
        const currencyEl = row.querySelector('.currency, .flag, .ccy');
        const eventEl = row.querySelector('.event, .name, .title, .event-name');
        const actualEl = row.querySelector('.actual, .act');
        const forecastEl = row.querySelector('.forecast, .cons');
        const previousEl = row.querySelector('.previous');
        const impactEl = row.querySelector('.impact, .volatility, .sentiment');

        const time = timeEl?.textContent?.trim() || '';
        const currency = currencyEl?.textContent?.trim() || '';
        const event = eventEl?.textContent?.trim() || '';

        if (!event || !currency) return;

        let impact: 'High' | 'Medium' | 'Low' | 'Unknown' = 'Unknown';
        const impactText = (impactEl?.textContent || impactEl?.className || '').toLowerCase();
        
        if (impactText.includes('high') || impactText.includes('3')) impact = 'High';
        else if (impactText.includes('medium') || impactText.includes('2')) impact = 'Medium';
        else if (impactText.includes('low') || impactText.includes('1')) impact = 'Low';

        result.push({
          time,
          currency: currency.toUpperCase(),
          event,
          impact,
          actual: actualEl?.textContent?.trim() || undefined,
          forecast: forecastEl?.textContent?.trim() || undefined,
          previous: previousEl?.textContent?.trim() || undefined,
        });
      });

      return result;
    });

    return NextResponse.json({
      success: true,
      count: events.length,
      events: events.slice(0, 100),
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Puppeteer scrape thất bại. Có thể trang web đang chặn hoặc thay đổi lớn.'
    }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
