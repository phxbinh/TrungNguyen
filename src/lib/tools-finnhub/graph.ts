// lib/tools-finnhub/graph.ts
import { StateGraph, Annotation, END, START } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { fetchForexNews, filterNewsBySymbol, type NewsItem } from "./finnhub";
import { AnalysisOutputSchema, type AnalysisOutput } from "./schema";

const GraphState = Annotation.Root({
  symbol: Annotation<string>(),
  rawNews: Annotation<NewsItem[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  filteredNews: Annotation<NewsItem[]>({
    reducer: (_, next) => next,
    default: () => [],
  }),
  analysis: Annotation<AnalysisOutput | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  error: Annotation<string | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
});

// ---------- Node 1: Fetch data ----------
async function fetchNewsNode(state: typeof GraphState.State) {
  try {
    const news = await fetchForexNews();
    const filtered = filterNewsBySymbol(news, state.symbol);
    return { rawNews: news, filteredNews: filtered };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Lỗi fetch news" };
  }
}

// ---------- Node 2: Synthesis bằng Gemini ----------
async function synthesisNode(state: typeof GraphState.State) {
  if (state.error) return {};

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-3.1-flash-lite",
    temperature: 0.2,
    apiKey: process.env.GOOGLE_GEMINI_KEY_API_LANGCHAIN!,
  });

  const structuredModel = model.withStructuredOutput(AnalysisOutputSchema);

  const newsText =
    state.filteredNews.length > 0
      ? state.filteredNews
          .map((n, i) => `${i + 1}. [${n.source}] ${n.headline}\n${n.summary}`)
          .join("\n\n")
      : "Không có tin tức nào liên quan trực tiếp trong nguồn dữ liệu hiện có.";

  const prompt = `Bạn là một AI phân tích thị trường forex/vàng, CHỈ đưa ra nhận định tham khảo dựa trên tin tức, KHÔNG đưa ra khuyến nghị mua/bán trực tiếp.

Symbol cần phân tích: ${state.symbol}

Tin tức liên quan gần đây:
${newsText}

Hãy phân tích:
- Nhận định xu hướng (bullish/bearish/neutral/conflicted) dựa trên nội dung tin tức
- Mức độ tin cậy (0-1) — nếu tin tức ít hoặc không liên quan trực tiếp, confidence phải thấp
- Các yếu tố chính đang tác động
- Các rủi ro khiến nhận định này có thể sai (VD: tin tức cũ, thiếu dữ liệu kỹ thuật, sự kiện sắp tới chưa phản ánh...)

Nếu không có đủ tin tức liên quan, hãy trung thực báo trendBias là "neutral" và confidence thấp (dưới 0.3), không suy diễn.`;

  try {
    const result = await structuredModel.invoke(prompt);
    return { analysis: result };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Lỗi gọi Gemini" };
  }
}

// ---------- Build graph ----------
export function buildAnalysisGraph() {
  const graph = new StateGraph(GraphState)
    .addNode("fetchNews", fetchNewsNode)
    .addNode("synthesis", synthesisNode)
    .addEdge(START, "fetchNews")
    .addEdge("fetchNews", "synthesis")
    .addEdge("synthesis", END);

  return graph.compile();
}

export async function runAnalysis(symbol: string) {
  const app = buildAnalysisGraph();
  const result = await app.invoke({ symbol });
  return result;
}
