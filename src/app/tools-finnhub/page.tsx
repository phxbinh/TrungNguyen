// app/page.tsx
"use client";

import { useState } from "react";

type AnalysisResult = {
  symbol: string;
  trendBias: "bullish" | "bearish" | "neutral" | "conflicted";
  confidence: number;
  newsSummary: string;
  keyDrivers: string[];
  risks: string[];
  disclaimer: string;
};

type NewsItem = {
  headline: string;
  source: string;
  summary: string;
  url: string;
};

const biasColor: Record<string, string> = {
  bullish: "text-green-600 bg-green-50",
  bearish: "text-red-600 bg-red-50",
  neutral: "text-gray-600 bg-gray-50",
  conflicted: "text-amber-600 bg-amber-50",
};

const biasLabel: Record<string, string> = {
  bullish: "Tăng",
  bearish: "Giảm",
  neutral: "Trung lập",
  conflicted: "Mâu thuẫn",
};

export default function Home() {
  const [symbol, setSymbol] = useState("XAUUSD");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [newsUsed, setNewsUsed] = useState<NewsItem[]>([]);
  const [totalFetched, setTotalFetched] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/tools-finnhub", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Lỗi không xác định");
        return;
      }

      setResult(data.analysis);
      setNewsUsed(data.newsUsed ?? []);
      setTotalFetched(data.totalNewsFetched ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi khi gọi API");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">AI Market Analysis (Test)</h1>

      <div className="flex gap-2">
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="VD: XAUUSD, EURUSD..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Đang phân tích..." : "Phân tích"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>
      )}

      {result && (
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">{result.symbol}</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${biasColor[result.trendBias]}`}
            >
              {biasLabel[result.trendBias]}
            </span>
          </div>

          <div>
            <span className="text-sm text-gray-500">Độ tin cậy: </span>
            <span className="font-medium">{Math.round(result.confidence * 100)}%</span>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-1">Tóm tắt tin tức</h3>
            <p className="text-sm">{result.newsSummary}</p>
          </div>

          {result.keyDrivers.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-1">Yếu tố chính</h3>
              <ul className="text-sm list-disc list-inside space-y-1">
                {result.keyDrivers.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}

          {result.risks.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-1">Rủi ro cần lưu ý</h3>
              <ul className="text-sm list-disc list-inside space-y-1 text-amber-700">
                {result.risks.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-gray-400 italic pt-2 border-t">
            {result.disclaimer}
          </p>
        </div>
      )}

      {newsUsed.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-sm text-gray-700">
            Tin tức đã dùng ({newsUsed.length}/{totalFetched} tin fetch được)
          </h3>
          {newsUsed.map((n, i) => (
            <a
              key={i}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border rounded p-2 text-sm hover:bg-gray-50"
            >
              <div className="font-medium">{n.headline}</div>
              <div className="text-gray-400 text-xs">{n.source}</div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
