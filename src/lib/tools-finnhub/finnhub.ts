// lib/tools-finnhub/finnhub.ts
//*
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

//*/


// lib/tools-finnhub/finnhub.ts
/*
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

// DEBUG: in toàn bộ raw response để xem thực tế Finnhub trả về gì
  //console.log(`[RAW FINNHUB] Tổng số item: ${Array.isArray(raw) ? raw.length : "không phải array"}`);
  //console.log(`[RAW FINNHUB] Full data:`, JSON.stringify(raw, null, 2));


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

// ---------- Keyword config: tách "strong" (chỉ cần 1 từ) và "weak" (cần >=2 từ) ----------
type SymbolKeywords = {
  strong: string[]; // từ đặc trưng riêng, khớp 1 từ là đủ chắc chắn
  weak: string[];   // từ chung chung, cần khớp >=2 từ (hoặc kết hợp với 1 strong) mới tính
};

const keywordMap: Record<string, SymbolKeywords> = {
  XAUUSD: {
    strong: ["gold", "bullion", "xau", "precious metal", "safe haven", "gold price"],
    weak: ["fed", "usd", "inflation", "interest rate", "dollar", "treasury", "yield", "federal reserve"],
  },
  XAGUSD: {
    strong: ["silver", "xag"],
    weak: ["fed", "usd", "inflation", "interest rate", "dollar", "industrial demand"],
  },
  EURUSD: {
    strong: ["euro", "eurozone", "ecb", "lagarde"],
    weak: ["fed", "usd", "dollar", "interest rate", "inflation"],
  },
  GBPUSD: {
    strong: ["pound", "sterling", "boe", "bank of england"],
    weak: ["fed", "usd", "dollar", "interest rate"],
  },
  USDJPY: {
    strong: ["yen", "boj", "bank of japan", "intervention"],
    weak: ["fed", "usd", "dollar", "interest rate"],
  },
};

// Fallback cho symbol chưa khai báo: tách currency pair thành strong keywords
function getKeywordsForSymbol(symbol: string): SymbolKeywords {
  const upper = symbol.toUpperCase();
  if (keywordMap[upper]) return keywordMap[upper];

  if (upper.length === 6) {
    const base = upper.slice(0, 3).toLowerCase();
    const quote = upper.slice(3).toLowerCase();
    // Coi cả 2 currency code là "strong" vì đây là fallback, không có context tốt hơn
    return { strong: [base, quote], weak: [] };
  }

  return { strong: [symbol.toLowerCase()], weak: [] };
}

// Logic relevance: khớp nếu có >=1 strong keyword, HOẶC >=2 weak keyword cùng xuất hiện
function isRelevant(text: string, kw: SymbolKeywords): boolean {
  const hasStrong = kw.strong.some((s) => text.includes(s));
  if (hasStrong) return true;

  const weakMatchCount = kw.weak.filter((w) => text.includes(w)).length;
  return weakMatchCount >= 2;
}

export function filterNewsBySymbol(news: NewsItem[], symbol: string): NewsItem[] {
  const kw = getKeywordsForSymbol(symbol);

  const result = news.filter((item) => {
    const text = (item.headline + " " + item.summary).toLowerCase();
    const matched = isRelevant(text, kw);
    
    // DEBUG LOG - xóa sau khi xong
    //console.log(`[FILTER] "${item.headline.slice(0, 60)}..." -> ${matched ? "MATCH" : "skip"}`);
    
    return matched;
  });

  //console.log(`[FILTER SUMMARY] ${symbol}: ${result.length}/${news.length} tin khớp`);
  return result;
}
//*/

/*
export function filterNewsBySymbol(news: NewsItem[], symbol: string): NewsItem[] {
  const kw = getKeywordsForSymbol(symbol);

  return news.filter((item) => {
    const text = (item.headline + " " + item.summary).toLowerCase();
    return isRelevant(text, kw);
  });
}
*/
//*/






