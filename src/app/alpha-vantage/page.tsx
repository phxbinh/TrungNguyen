'use client';

import { useEffect, useState } from 'react';
import { EconomicEvent } from '../api/alpha-vantage/forex';

export default function ForexCalendar() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorLog, setErrorLog] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setErrorLog(null);
        const res = await fetch('/api/alpha-vantage');
        
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `HTTP Error! Status: ${res.status}`);
        }

        const rawData = await res.json();
        
        if (Array.isArray(rawData)) {
          setEvents(rawData);
        } else {
          throw new Error("Định dạng dữ liệu từ API không hợp lệ.");
        }
      } catch (err: any) {
        console.error("Lỗi:", err);
        setErrorLog(err.message || "Đã xảy ra lỗi kết nối.");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const getSentimentColor = (sentiment: string) => {
    const s = sentiment?.toLowerCase();
    if (s?.includes('bullish')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (s?.includes('bearish')) return 'bg-red-500/10 text-red-400 border-red-500/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  // Định dạng lại chuỗi thời gian của Alpha Vantage (YYYYMMDDTHHMMSS -> DD/MM HH:MM)
  const formatTime = (timeStr: string) => {
    if (!timeStr || timeStr.length < 12) return timeStr;
    const month = timeStr.substring(4, 6);
    const day = timeStr.substring(6, 8);
    const hour = timeStr.substring(9, 11);
    const minute = timeStr.substring(11, 13);
    return `${day}/${month} ${hour}:${minute}`;
  };

  if (loading) return <div className="text-center p-8 text-neutral-400">Đang tải tin tức thị trường...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl text-neutral-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium tracking-tight">Tin Tức Vĩ Mô & Forex</h2>
        <span className="text-xs text-neutral-500">Nguồn: Alpha Vantage API</span>
      </div>

      {errorLog && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-mono">
          <span className="font-semibold text-red-500 block mb-1">⚠️ Trạng thái:</span>
          {errorLog}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-300">
          <thead className="text-xs uppercase text-neutral-500 border-b border-neutral-800">
            <tr>
              <th className="py-3 px-4 font-normal w-32">Thời gian</th>
              <th className="py-3 px-4 font-normal">Nội dung bài báo / Sự kiện</th>
              <th className="py-3 px-4 font-normal w-32 text-center">Xu hướng</th>
              <th className="py-3 px-4 font-normal w-24 text-right">Nguồn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {events.length > 0 ? (
              events.map((event, index) => (
                <tr key={index} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-neutral-400 text-xs whitespace-nowrap">
                    {formatTime(event.time_published)}
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <a 
                      href={event.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-neutral-200 font-medium hover:text-amber-400 transition-colors block truncate mb-0.5"
                    >
                      {event.title}
                    </a>
                    <p className="text-neutral-500 text-xs line-clamp-1">{event.summary}</p>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${getSentimentColor(event.overall_sentiment_label)}`}>
                      {event.overall_sentiment_label || 'Neutral'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs text-neutral-400 font-mono">
                    {event.source}
                  </td>
                </tr>
              ))
            ) : (
              !errorLog && (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-neutral-500 italic">
                    Hiện tại chưa có tin tức mới.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
