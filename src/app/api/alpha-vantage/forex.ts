export interface EconomicEvent {
  title: string;
  time_published: string;
  summary: string;
  url: string;
  source: string;
  overall_sentiment_label: string; // Tình trạng tâm lý thị trường: "Bullish", "Bearish", "Neutral"
  banner_image?: string;
}
