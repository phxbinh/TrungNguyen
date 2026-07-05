// lib/tools-finnhub/finnhub.ts
import { z } from "zod";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";
const API_KEY = process.env.FINNHUB_API_KEY!;

const NewsItemSchema = z.object({
  category: z.string(),
  datetime: z.number(),
  headline: z.string(),
  id: z.number(),
  image: z.string().optional(),
  related: z.string().optional(),
  source: z.string(),
  summary: z.string(),
  url: z.string(),
});

export type NewsItem = z.infer<typeof NewsItemSchema>;

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchForexNews(): Promise<NewsItem[]> {
  const res = await fetch(
    `${FINNHUB_BASE_URL}/news?category=forex&token=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error(`Finnhub news fetch failed: ${res.status} ${res.statusText}`);
  }

  const raw = await res.json();
  const parsed = z.array(NewsItemSchema).safeParse(raw);

  if (!parsed.success) {
    console.error("News schema mismatch:", parsed.error.format());
    return raw;
  }

  return parsed.data.map((item) => ({
    ...item,
    summary: stripHtml(item.summary).slice(0, 500),
  }));
}

// Keyword map cho các symbol phổ biến — ưu tiên tra map này trước
const keywordMap: Record<string, string[]> = {
  XAUUSD: ["gold", "fed", "usd", "inflation", "interest rate", "dollar", "treasury", "yield"],
  EURUSD: ["euro", "ecb", "usd", "fed", "eurozone", "dollar"],
  GBPUSD: ["pound", "sterling", "boe", "bank of england", "usd", "dollar"],
  USDJPY: ["yen", "boj", "bank of japan", "usd", "dollar"],
};

// Fallback: nếu symbol không có trong map, tách 6 ký tự thành 2 currency code
// (VD: BTCUSD -> "btc", "usd") thay vì dùng nguyên "btcusd" (gần như không bao giờ khớp)
function getKeywordsForSymbol(symbol: string): string[] {
  const upper = symbol.toUpperCase();
  if (keywordMap[upper]) return keywordMap[upper];

  if (upper.length === 6) {
    const base = upper.slice(0, 3).toLowerCase();
    const quote = upper.slice(3).toLowerCase();
    return [base, quote];
  }

  return [symbol.toLowerCase()];
}

export function filterNewsBySymbol(news: NewsItem[], symbol: string): NewsItem[] {
  const keywords = getKeywordsForSymbol(symbol);

  return news.filter((item) => {
    const text = (item.headline + " " + item.summary).toLowerCase();
    return keywords.some((kw) => text.includes(kw));
  });
}
