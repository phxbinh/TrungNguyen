"use client";

import { useState } from "react";

type NewsItem = {
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
};

export default function NewsPage() {
  const [query, setQuery] = useState(
    '(gold OR bullion OR "spot gold") NOT jewelry'
  );
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState("");

  async function handleSearch() {
    setLoading(true);
    setError("");

    try {
/*
      const res = await fetch("/api/gnews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          limit,
        }),
      });
*/

const res = await fetch("/api/gnews", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: '(gold OR bullion OR "spot gold") NOT jewelry',
    limit: 10,
  }),
});



      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Unknown error");
      }

      setNews(data.news);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        GNews API Test
      </h1>

      <div className="space-y-4 border rounded-lg p-4">
        <div>
          <label className="block font-medium mb-2">
            Search Query
          </label>

          <textarea
            rows={3}
            className="w-full border rounded p-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">
            Limit
          </label>

          <input
            type="number"
            min={1}
            max={20}
            className="border rounded p-2 w-32"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 rounded bg-black text-white"
        >
          {loading ? "Loading..." : "Search"}
        </button>

        {error && (
          <p className="text-red-600">{error}</p>
        )}
      </div>

      <div className="space-y-4">
        {news.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg p-4"
          >
            <h2 className="font-bold text-lg">
              {item.title}
            </h2>

            <p className="text-gray-600 text-sm mt-1">
              {item.source} •{" "}
              {new Date(item.publishedAt).toLocaleString()}
            </p>

            <p className="mt-3">
              {item.summary}
            </p>

            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mt-3 inline-block"
            >
              Read article →
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}