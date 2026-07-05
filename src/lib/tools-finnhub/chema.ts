// lib/tools-finnhub/schema.ts
import { z } from "zod";

export const AnalysisOutputSchema = z.object({
  symbol: z.string(),
  trendBias: z.enum(["bullish", "bearish", "neutral", "conflicted"]),
  confidence: z.number().min(0).max(1),
  newsSummary: z
    .string()
    .describe("Tóm tắt ngắn gọn các tin tức liên quan và tác động tới symbol"),
  keyDrivers: z
    .array(z.string())
    .describe("Các yếu tố chính (tin tức/sự kiện) ảnh hưởng tới nhận định"),
  risks: z
    .array(z.string())
    .describe("Các yếu tố có thể khiến nhận định này sai"),
  disclaimer: z
    .literal(
      "Đây là phân tích tham khảo dựa trên tin tức, không phải khuyến nghị đầu tư. Quyết định vào lệnh do người dùng tự chịu trách nhiệm."
    )
    .describe("Luôn giữ nguyên câu này"),
});

export type AnalysisOutput = z.infer<typeof AnalysisOutputSchema>;
