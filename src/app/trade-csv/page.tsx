"use client";

import React, { useState } from "react";
import Papa from "papaparse";

export interface Candle {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CsvReaderProps {
  onLoaded?: (data: Candle[]) => void;
}

export default function CsvReader({
  onLoaded,
}: CsvReaderProps) {
  const [count, setCount] = useState(0);
  const [preview, setPreview] = useState<Candle[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setCount(0);
    setPreview([]);

    const candles: Candle[] = [];
    let total = 0;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,

      step: (result) => {
        const row = result.data as Record<string, string>;

        const candle: Candle = {
          date: parseMtDate(row.Date),
          open: Number(row.Open),
          high: Number(row.High),
          low: Number(row.Low),
          close: Number(row.Close),
          volume: Number(row.Volume),
        };

        total++;

        // Chỉ giữ 5 dòng đầu để preview
        if (preview.length < 5) {
          candles.push(candle);
        }

        // Cập nhật UI mỗi 10.000 dòng
        if (total % 10000 === 0) {
          setCount(total);
        }
      },

      complete: () => {
        setPreview(candles);
        setCount(total);
        setLoading(false);

        // Chỉ trả preview.
        // Nếu muốn trả toàn bộ dữ liệu thì xem lưu ý bên dưới.
        onLoaded?.(candles);
      },

      error: (err) => {
        console.error(err);
        setLoading(false);
      },
    });
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
      />

      <p>
        {loading
          ? `Processing ${count.toLocaleString()} rows...`
          : `Processed ${count.toLocaleString()} rows`}
      </p>

      <pre>{JSON.stringify(preview, null, 2)}</pre>
    </div>
  );
}

function parseMtDate(value: string): Date {
  const [d, t] = value.trim().split(" ");

  // Hỗ trợ cả 2004.06.11 và 2004-06-11
  const parts = d.includes(".")
    ? d.split(".")
    : d.split("-");

  const [year, month, day] = parts.map(Number);

  const [hour, minute, second = "0"] = t.split(":");

  return new Date(
    year,
    month - 1,
    day,
    Number(hour),
    Number(minute),
    Number(second)
  );
}