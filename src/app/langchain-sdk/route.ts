import { streamText, convertToModelMessages, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicTool } from "@langchain/core/tools";

// LangChain model
const lcModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

// LangChain tool
const productSearchTool = new DynamicTool({
  name: "search_products",
  description: "Search products by keyword",
  func: async (input: string) => {
    // fake DB query
    const products = [
      { id: 1, name: "iPhone 15" },
      { id: 2, name: "Samsung S24" },
    ];

    const matched = products.filter((p) =>
      p.name.toLowerCase().includes(input.toLowerCase())
    );

    return JSON.stringify(matched);
  },
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  return streamText({
    model: google("gemini-2.5-flash"),

    messages: convertToModelMessages(messages),

    tools: {
      searchProducts: tool({
        description: "Search products",
        inputSchema: z.object({
          query: z.string(),
        }),

        execute: async ({ query }) => {
          // gọi LangChain tool
          const result = await productSearchTool.invoke(query);
          return result;
        },
      }),

      askLangchain: tool({
        description: "Ask LangChain model directly",
        inputSchema: z.object({
          question: z.string(),
        }),

        execute: async ({ question }) => {
          const response = await lcModel.invoke(question);
          return response.content;
        },
      }),
    },

    system: `
Bạn là trợ lý bán hàng.
- Trả lời ngắn gọn
- Nếu cần tìm sản phẩm thì gọi tool
- Nếu cần phân tích sâu thì dùng askLangchain
`,
  });
}