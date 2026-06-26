import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver } from "@langchain/langgraph";
import { AgentState } from "./ai/state";

import { 
  productSearchTool, 
  productDetailTool, 
  docsSearchTool 
} from "./tools";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  temperature: 0.3,
}).bindTools([productSearchTool, productDetailTool, docsSearchTool]);

export const app = createReactAgent({
  llm: model,
  tools: [productSearchTool, productDetailTool, docsSearchTool],
  stateModifier: AgentState,
  checkpointSaver: new MemorySaver(),

  prompt: `Bạn là trợ lý bán hàng thông minh, vui tính và chuyên nghiệp.
Hãy sử dụng tool khi cần thiết để trả lời chính xác nhất.
Trả lời bằng tiếng Việt, ngắn gọn và dễ hiểu.`,
});