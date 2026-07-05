export interface EconomicEvent {
  Name: string;       // Tên sự kiện (Ví dụ: Non-Farm Employment Change)
  Currency: string;   // Đồng tiền ảnh hưởng (USD, EUR...)
  Impact: 'High' | 'Medium' | 'Low' | 'None';
  Date: string;       // Ngày giờ diễn ra tin tức
  Actual?: string | number;
  Forecast?: string | number;
  Previous?: string | number;
  
  // Các trường bổ sung nếu bạn cần dùng sau này
  time?: string;      
  title?: string;
  country?: string;
  impact?: string;
  forecast?: string;
  previous?: string;
  actual?: string;
}
