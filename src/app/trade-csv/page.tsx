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
  onCandle?: (candle: Candle) => void;
  onComplete?: (count: number) => void;
}

export default function CsvReader({
  onCandle,
  onComplete,
}: CsvReaderProps) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setCount(0);

    let total = 0;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      dynamicTyping: true,

      step({ data }) {
        const row = data as any;

        onCandle?.({
          date: parseMtDate(row.Date),
          open: row.Open,
          high: row.High,
          low: row.Low,
          close: row.Close,
          volume: row.Volume,
        });

        total++;

        // Chỉ update UI mỗi 50.000 dòng
        if (total % 500 === 0) {
          setCount(total);
        }
      },

      complete() {
        setCount(total);
        setLoading(false);
        onComplete?.(total);
      },

      error(err) {
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
          ? `Reading ${count.toLocaleString()} rows...`
          : `Finished ${count.toLocaleString()} rows`}
      </p>
    </div>
  );
}

function parseMtDate(value: string): Date {
  const [d, t] = value.trim().split(" ");

  const [y, m, day] =
    d.indexOf(".") >= 0
      ? d.split(".").map(Number)
      : d.split("-").map(Number);

  const [h, min, s = "0"] = t.split(":");

  return new Date(
    y,
    m - 1,
    day,
    Number(h),
    Number(min),
    Number(s)
  );
}