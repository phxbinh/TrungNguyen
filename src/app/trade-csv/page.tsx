import React, { useState } from "react";

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
  const [data, setData] = useState<Candle[]>([]);

  const handleFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();

    const lines = text
      .split(/\r?\n/)
      .filter((line) => line.trim().length > 0);

    if (lines.length < 2) return;

    // Bỏ header
    const rows = lines.slice(1);

    const candles: Candle[] = rows.map((row) => {
      const [
        date,
        open,
        high,
        low,
        close,
        volume,
      ] = row.split(",");

      return {
        date: parseMtDate(date),
        open: Number(open),
        high: Number(high),
        low: Number(low),
        close: Number(close),
        volume: Number(volume),
      };
    });

    setData(candles);
    onLoaded?.(candles);
  };

  return (
    <div>
      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
      />

      <p>Loaded: {data.length} candles</p>

      <pre>
        {JSON.stringify(data.slice(0, 5), null, 2)}
      </pre>
    </div>
  );
}

function parseMtDate(value: string): Date {
  // 2004.06.11 07:18
  const [d, t] = value.trim().split(" ");

  const [year, month, day] = d.split(".").map(Number);
  const [hour, minute] = t.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute);
}