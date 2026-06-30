import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import {
  productSearchTool,
  productDetailTool,
} from "../../agent-langgraph/tools";
import { model } from "../model";

/*
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
});
*/

export const productAgent = createReactAgent({
  llm: model,
  tools: [
    productSearchTool,
    productDetailTool,
  ],
  prompt: `
Bạn là product specialist.

Rules:
- Nếu user muốn tìm sản phẩm -> dùng productSearchTool
- Nếu user hỏi chi tiết sản phẩm -> dùng productDetailTool
- Không trả lời ngoài phạm vi product
`,
});