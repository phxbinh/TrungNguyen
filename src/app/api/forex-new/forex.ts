export interface EconomicEvent {
  title: string;
  country: string; // Ví dụ: "USD", "EUR"
  date: string;    // ISO string hoặc định dạng ngày từ API
  time: string;    // Giờ diễn ra tin tức
  impact: 'High' | 'Medium' | 'Low' | 'Holiday';
  forecast: string;
  previous: string;
  actual: string;
}

export type NewsSource = 'forexfactory' | 'mql5' | 'fxstreet';
