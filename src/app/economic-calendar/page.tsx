'use client';

import React, { useState, useEffect } from 'react';

interface EconomicEvent {
  time: string;
  currency: string;
  event: string;
  impact: 'High' | 'Medium' | 'Low' | 'Unknown';
  actual?: string;
  forecast?: string;
  previous?: string;
}

export default function EconomicCalendar() {
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');
  const [currencyFilter, setCurrencyFilter] = useState<string>('All');

  useEffect(() => {
    fetchCalendar();
  }, []);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/fxstreet/calendar');
      const data = await res.json();

      if (data.success) {
        setEvents(data.events);
      } else {
        setError(data.message || 'Lỗi khi lấy dữ liệu');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events
    .filter(e => filter === 'All' || e.impact === filter)
    .filter(e => currencyFilter === 'All' || e.currency === currencyFilter);

  const uniqueCurrencies = Array.from(new Set(events.map(e => e.currency))).sort();

  const getImpactColor = (impact: string) => {
    if (impact === 'High') return 'bg-red-500 text-white';
    if (impact === 'Medium') return 'bg-orange-500 text-white';
    if (impact === 'Low') return 'bg-green-500 text-white';
    return 'bg-gray-500 text-white';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Economic Calendar</h1>
            <p className="text-gray-600 mt-2">Dữ liệu từ FXStreet • Cập nhật realtime</p>
          </div>
          <button
            onClick={fetchCalendar}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            ↻ Làm mới
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 bg-white p-6 rounded-2xl shadow">
          <div>
            <label className="block text-sm font-medium mb-2">Impact</label>
            <div className="flex gap-2">
              {(['All', 'High', 'Medium', 'Low'] as const).map(level => (
                <button
                  key={level}
                  onClick={() => setFilter(level)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition ${
                    filter === level 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Tất cả</option>
              {uniqueCurrencies.map(cur => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <p className="text-center py-12 text-lg">Đang tải lịch kinh tế...</p>}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl">
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-5 text-left">Thời gian</th>
                <th className="px-6 py-5 text-left">Tiền tệ</th>
                <th className="px-6 py-5 text-left">Sự kiện</th>
                <th className="px-6 py-5 text-center">Impact</th>
                <th className="px-6 py-5 text-center">Actual</th>
                <th className="px-6 py-5 text-center">Forecast</th>
                <th className="px-6 py-5 text-center">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredEvents.map((event, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-5 font-medium">{event.time}</td>
                  <td className="px-6 py-5 font-semibold">{event.currency}</td>
                  <td className="px-6 py-5 max-w-md">{event.event}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getImpactColor(event.impact)}`}>
                      {event.impact}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center font-medium text-green-600">
                    {event.actual || '-'}
                  </td>
                  <td className="px-6 py-5 text-center font-medium">
                    {event.forecast || '-'}
                  </td>
                  <td className="px-6 py-5 text-center font-medium text-gray-500">
                    {event.previous || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredEvents.length === 0 && !loading && (
            <p className="text-center py-12 text-gray-500">Không có sự kiện nào khớp filter</p>
          )}
        </div>
      </div>
    </div>
  );
}