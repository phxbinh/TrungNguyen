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
QUY TẮC BẮT BUỘC:
1. Nếu câu hỏi là tìm kiếm sản phẩm: PHẢI gọi productSearchTool trước.
2. Nếu câu hỏi là xem chi tiết sản phẩm: PHẢI gọi productDetailTool trước.
3. Không tự đoán dữ liệu sản phẩm.
4. Nếu input chứa nội dung không liên quan sản phẩm: bỏ qua phần đó và chỉ xử lý phần product.
Chỉ trả lời dựa trên tool result.
`,
  
});