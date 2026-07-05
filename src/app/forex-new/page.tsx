'use client';

import { useEffect, useState } from 'react';
import { EconomicEvent } from '../api/forex-new/forex';

export default function ForexCalendar() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorLog, setErrorLog] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setErrorLog(null);
        // source truyền vào khớp với định dạng url mới của JBlanked: forex-factory
        //const res = await fetch('/api/forex-new?source=forex-factory&timeframe=today');
       
//  Đổi thành (lấy tin cả tuần):
const res = await fetch('/api/forex-new?source=forex-factory&timeframe=week');

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || `HTTP Error! Status: ${res.status}`);
        }

        const rawData = await res.json();
        console.log("Dữ liệu thực tế từ API:", rawData); 

        if (Array.isArray(rawData)) {
          setEvents(rawData);
        } else if (rawData && typeof rawData === 'object') {
          if (rawData.data && Array.isArray(rawData.data)) {
            setEvents(rawData.data);
          } else if (rawData.news && Array.isArray(rawData.news)) {
            setEvents(rawData.news);
          } else {
            throw new Error("Không tìm thấy mảng dữ liệu trong Response.");
          }
        } else {
          throw new Error("Định dạng dữ liệu không hợp lệ.");
        }
      } catch (err: any) {
        console.error("Lỗi fetch:", err);
        setErrorLog(err.message || "Đã xảy ra lỗi kết nối.");
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const getImpactColor = (impact: string) => {
    const cleanImpact = impact?.toLowerCase();
    if (cleanImpact === 'high') return 'bg-red-500/10 text-red-400 border-red-500/20';
    if (cleanImpact === 'medium') return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  };

  if (loading) return <div className="text-center p-8 text-neutral-400">Đang tải lịch kinh tế...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl text-neutral-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium tracking-tight">Lịch Sự Kiện Kinh Tế</h2>
        <span className="text-xs text-neutral-500">Nguồn: JBlanked API</span>
      </div>

      {errorLog && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-mono">
          <span className="font-semibold text-red-500 block mb-1">⚠️ Lỗi hệ thống:</span>
          {errorLog}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-neutral-300">
          <thead className="text-xs uppercase text-neutral-500 border-b border-neutral-800">
            <tr>
              <th className="py-3 px-4 font-normal">Thời gian</th>
              <th className="py-3 px-4 font-normal">Đồng tiền</th>
              <th className="py-3 px-4 font-normal">Sự kiện</th>
              <th className="py-3 px-4 font-normal text-center">Tác động</th>
              <th className="py-3 px-4 font-normal text-right">Kỳ trước</th>
              <th className="py-3 px-4 font-normal text-right">Dự báo</th>
              <th className="py-3 px-4 font-normal text-right">Thực tế</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {events.length > 0 ? (
              events.map((event, index) => {
                // Khử lỗi sai lệch chữ Hoa/Thường từ các phiên bản API cũ-mới
                const eventTime = event.Date || event.time || '-';
                const currency = event.Currency || event.country || '-';
                const title = event.Name || event.title || '-';
                const impact = event.Impact || event.impact || 'Low';
                const previous = event.Previous ?? event.previous ?? '-';
                const forecast = event.Forecast ?? event.forecast ?? '-';
                const actual = event.Actual ?? event.actual ?? '---';

                return (
                  <tr key={index} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-neutral-400 text-xs">{eventTime}</td>
                    <td className="py-3.5 px-4 font-semibold text-neutral-100">{currency}</td>
                    <td className="py-3.5 px-4 max-w-xs truncate text-neutral-200" title={title}>
                      {title}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getImpactColor(impact)}`}>
                        {impact}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-neutral-400">{previous}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-neutral-400">{forecast}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-emerald-400">
                      {actual}
                    </td>
                  </tr>
                );
              })
            ) : (
              !errorLog && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-neutral-500 italic">
                    Hôm nay hiện tại chưa có tin kinh tế nào được cập nhật.
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
