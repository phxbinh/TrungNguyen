'use client';

import { useEffect, useState } from 'react';
import { EconomicEvent } from '../api/forex-new/forex';

export default function ForexCalendar() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
/*
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/forex-new?source=forexfactory&timeframe=today');
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);
*/
// Sửa lại đoạn useEffect trong Component của bạn
useEffect(() => {
  async function fetchNews() {
    try {
      const res = await fetch('/api/forex-new?source=forexfactory&timeframe=today');
      const rawData = await res.json();
      
      console.log("Dữ liệu thực tế từ API:", rawData); // <--- Bật F12 lên xem dòng này trả về cái gì

      // Nếu API trả về dạng { data: [...] } hoặc { news: [...] }
      if (Array.isArray(rawData)) {
        setEvents(rawData);
      } else if (rawData.data && Array.isArray(rawData.data)) {
        setEvents(rawData.data);
      } else if (rawData.news && Array.isArray(rawData.news)) {
        setEvents(rawData.news);
      } else {
        console.error("Cấu trúc data không đúng dạng Array mong muốn", rawData);
      }
    } catch (err) {
      console.error("Lỗi fetch:", err);
    } finally {
      setLoading(false);
    }
  }
  fetchNews();
}, []);




  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  if (loading) return <div className="text-center p-8 text-neutral-400">Đang tải lịch kinh tế...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-neutral-200 tracking-tight">Lịch Sự Kiện Kinh Tế</h2>
        <span className="text-xs text-neutral-500">Nguồn: Forex Factory via JBlanked</span>
      </div>

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
          <tbody className="divide-y divide-neutral-850">
            {events.map((event, index) => (
              <tr key={index} className="hover:bg-neutral-850/50 transition-colors">
                <td className="py-3.5 px-4 font-mono text-neutral-400">{event.time}</td>
                <td className="py-3.5 px-4 font-semibold text-neutral-200">{event.country}</td>
                <td className="py-3.5 px-4 max-w-xs truncate text-neutral-300" title={event.title}>
                  {event.title}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getImpactColor(event.impact)}`}>
                    {event.impact}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-neutral-400">{event.previous || '-'}</td>
                <td className="py-3.5 px-4 text-right font-mono text-neutral-400">{event.forecast || '-'}</td>
                <td className={`py-3.5 px-4 text-right font-mono font-medium ${event.actual ? 'text-emerald-400' : 'text-neutral-500'}`}>
                  {event.actual || '---'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
