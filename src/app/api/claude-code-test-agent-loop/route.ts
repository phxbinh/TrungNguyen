import { StateGraph, END, Annotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, BaseMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { z } from "zod";

import { NextRequest, NextResponse } from "next/server";
//import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";

// ============================================================
// 1. SCHEMA - params agent được phép sinh ra
// ============================================================
/*
const searchProductsSchema = z.object({
  category: z.string().nullable().describe("Loại sản phẩm, vd: ao-thun"),
  price_min: z.number().nullable(),
  price_max: z.number().nullable(),
  color: z.string().nullable(),
});
*/
const searchProductsSchema = z.object({
  category: z.string().describe("Loại sản phẩm, vd: ao-thun").optional(),
  price_min: z.number().optional(),
  price_max: z.number().optional(),
  color: z.string().optional(),
});

// ============================================================
// 2. MOCK DB - lớp thực thi, KHÔNG để agent chạm vào query thật
// ============================================================
function queryDB(params: z.infer<typeof searchProductsSchema>) {
  const mockDB = [
    { id: "1", name: "Áo thun nam basic", price: 250000, category: "ao-thun", color: "trắng" },
    { id: "2", name: "Áo thun nam form rộng", price: 320000, category: "ao-thun", color: "đen" },
  ];

  return mockDB.filter((p) => {
    if (params.category && p.category !== params.category) return false;
    if (params.price_max && p.price > params.price_max) return false;
    if (params.color && p.color !== params.color) return false;
    return true;
  });
}

// ============================================================
// 3. TOOL - trả kèm "hint" để model tự đánh giá có nên thử lại không
// ============================================================
/*
const searchProductsTool = tool(
  async (params) => {
    const results = queryDB(params);
    const payload = {
      results,
      resultCount: results.length,
      hint:
        results.length === 0
          ? "Không có kết quả. Filter đang quá chặt. Hãy nới lỏng MỘT điều kiện ít quan trọng nhất rồi thử lại."
          : "Kết quả hợp lý, có thể trả lời người dùng.",
    };
    return JSON.stringify(payload);
  },
  {
    name: "search_products",
    description: "Tìm sản phẩm theo filter",
    schema: searchProductsSchema,
  }
);
*/

const searchProductsTool = tool(
  async (params: searchProductsSchema) => {
    const results = queryDB(params);

    return JSON.stringify({
      results,
      resultCount: results.length,
      hint:
        results.length === 0
          ? "Không có kết quả. Filter đang quá chặt. Hãy nới lỏng MỘT điều kiện ít quan trọng nhất rồi thử lại."
          : "Kết quả hợp lý, có thể trả lời người dùng.",
    });
  },
  {
    name: "search_products",
    description: "Tìm sản phẩm theo filter",
    schema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Loại sản phẩm, vd: ao-thun",
        },
        price_min: {
          type: "number",
        },
        price_max: {
          type: "number",
        },
        color: {
          type: "string",
        },
      },
    },
  }
);

const tools = [searchProductsTool];
const toolNode = new ToolNode(tools);

// ============================================================
// 4. MODEL - Gemini qua LangChain, bind tool vào model
// ============================================================
/*
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
}).bindTools(tools);
*/
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  temperature: 0,
}).bindTools(tools);

// ============================================================
// 5. STATE - thêm stepCount để giới hạn vòng lặp theo rate limit
// ============================================================
const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (curr, update) => curr.concat(update),
    default: () => [],
  }),
  stepCount: Annotation<number>({
    reducer: (_, update) => update,
    default: () => 0,
  }),
});

const SYSTEM_PROMPT = `Bạn là agent tìm sản phẩm.
- Đọc "hint" trong kết quả tool để quyết định có cần gọi lại tool với params khác không.
- KHÔNG lặp lại y hệt params đã thử.
- Nếu hết lượt cho phép mà chưa có kết quả tốt, trả lời trung thực,
  không bịa sản phẩm ngoài tool result.`;

// ============================================================
// 6. NODE: agent - gọi model suy luận bước tiếp theo
// ============================================================
async function agentNode(state: typeof AgentState.State) {
  const response = await model.invoke([
    { role: "system", content: SYSTEM_PROMPT },
    ...state.messages,
  ]);
  return {
    messages: [response],
    stepCount: state.stepCount + 1,
  };
}

// ============================================================
// 7. CONDITIONAL EDGE - đây là "vòng lặp" thật sự
// ============================================================
function shouldContinue(state: typeof AgentState.State) {
  const lastMessage = state.messages[state.messages.length - 1] as AIMessage;

  const MAX_STEPS = 3; // giới hạn theo rate limit
  if (state.stepCount >= MAX_STEPS) return END;

  // Model quyết định gọi tool tiếp -> đi tới node tools
  if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
    return "tools";
  }

  // Model không gọi tool nữa (đã tự thấy đủ) -> kết thúc
  return END;
}

// ============================================================
// 8. BUILD GRAPH
// ============================================================
const graph = new StateGraph(AgentState)
  .addNode("agent", agentNode)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue, {
    tools: "tools",
    [END]: END,
  })
  .addEdge("tools", "agent"); // sau khi có tool result, quay lại agent tự đánh giá tiếp

const app = graph.compile();

// ============================================================
// 9. CHẠY
// ============================================================
async function runProductSearchAgent(userInput: string) {
  const result = await app.invoke({
    messages: [new HumanMessage(userInput)],
  });

  console.log("Số bước đã dùng:", result.stepCount);
  return result.messages[result.messages.length - 1].content;
}

// runProductSearchAgent("áo thun nam dưới 200k màu đỏ");
// -> agent node gọi tool, thấy resultCount=0 -> quay lại agent -> tự nới filter -> gọi tool lại




// POST -> fetch
// app/api/product-search/route.ts
//import { NextRequest, NextResponse } from "next/server";
//import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
//import { app } from "@/lib/product-search-agent"; // file graph đã build ở trên

export async function POST(req: NextRequest) {
  const { input } = await req.json();

  const result = await app.invoke({
    messages: [new HumanMessage(input)],
  });

  // Bóc trace từng bước: params gửi đi + hint/result nhận về
  const trace: any[] = [];
  for (const msg of result.messages) {
    if (msg instanceof AIMessage && msg.tool_calls?.length) {
      msg.tool_calls.forEach((tc) => {
        trace.push({ type: "tool_call", name: tc.name, args: tc.args });
      });
    }
    if (msg instanceof ToolMessage) {
      trace.push({ type: "tool_result", content: JSON.parse(msg.content as string) });
    }
  }

  const finalMessage = result.messages[result.messages.length - 1];

  return NextResponse.json({
    finalAnswer: finalMessage.content,
    stepCount: result.stepCount,
    trace,
  });
}





