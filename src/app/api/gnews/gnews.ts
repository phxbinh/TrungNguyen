import { z } from "zod";

const GNEWS_BASE_URL = "https://gnews.io/api/v4";
const API_KEY = process.env.GNEWS_API_KEY!;

export const NewsItemSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.string(),
  image: z.string().nullable().optional(),
  publishedAt: z.string(),
  source: z.object({
    name: z.string(),
    url: z.string().optional(),
  }),
});

const SearchResponseSchema = z.object({
  totalArticles: z.number(),
  articles: z.array(NewsItemSchema),
});

export type NewsItem = {
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
};

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchNews(
  query: string,
  limit = 10
): Promise<NewsItem[]> {
  const url =
    `${GNEWS_BASE_URL}/search` +
    `?q=${encodeURIComponent(query)}` +
    `&lang=en` +
    `&sortby=publishedAt` +
    `&max=${limit}` +
    `&apikey=${API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `GNews fetch failed: ${res.status} ${res.statusText}`
    );
  }

  const raw = await res.json();

  const parsed = SearchResponseSchema.safeParse(raw);

  if (!parsed.success) {
    console.error(parsed.error.format());
    throw new Error("Invalid GNews response");
  }

  return parsed.data.articles.map((article) => ({
    title: article.title,
    summary: stripHtml(
      article.description ??
        article.content ??
        ""
    ).slice(0, 500),
    source: article.source.name,
    publishedAt: article.publishedAt,
    url: article.url,
  }));
}