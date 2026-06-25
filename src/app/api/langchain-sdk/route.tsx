/* Chạy được
import { streamText, convertToModelMessages, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { DynamicTool } from "@langchain/core/tools";

const getTimeTool = new DynamicTool({
  name: "get_time",
  description: "Get current server time",
  func: async () => {
    return new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
  },
});

const getWeatherTool = new DynamicTool({
  name: "get_weather",
  description: "Get weather by city",
  func: async (city: string) => {
    return JSON.stringify({
      city,
      temperature: "31°C",
      condition: "Nắng nhẹ",
    });
  },
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),

    messages: await convertToModelMessages(messages),

    tools: {
      getTime: tool({
        description: "Lấy giờ hiện tại",
        inputSchema: z.object({}),
        execute: async () => {
          return await getTimeTool.invoke("");
        },
      }),

      getWeather: tool({
        description: "Lấy thời tiết",
        inputSchema: z.object({
          city: z.string(),
        }),
        execute: async ({ city }) => {
          return await getWeatherTool.invoke(city);
        },
      }),
    },

    system: `
Bạn là trợ lý hữu ích.
Nếu user hỏi giờ thì dùng getTime.
Nếu user hỏi thời tiết thì dùng getWeather.
`,
  });

  return result.toUIMessageStreamResponse();
}

*/

import {
  streamText,
  convertToModelMessages,
  tool,
} from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicTool } from "@langchain/core/tools";

// LangChain model
const lcModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey:
    process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

// LangChain tool
const productSearchTool = new DynamicTool({
  name: "search_products",
  description:
    "Search products by keyword",
  func: async (input: string) => {
    const products = [
      { id: 1, name: "iPhone 15" },
      { id: 2, name: "Samsung S24" },
    ];

    const matched = products.filter((p) =>
      p.name
        .toLowerCase()
        .includes(input.toLowerCase())
    );

    return JSON.stringify(matched);
  },
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),

    messages:
      await convertToModelMessages(messages),

    tools: {
      searchProducts: tool({
        description: "Search products",
        inputSchema: z.object({
          query: z.string(),
        }),

        execute: async ({ query }) => {
          return await productSearchTool.invoke(
            query
          );
        },
      }),

      askLangchain: tool({
        description:
          "Ask LangChain model directly",
        inputSchema: z.object({
          question: z.string(),
        }),

        execute: async ({
          question,
        }) => {
          const response =
            await lcModel.invoke(question);

          return response.content;
        },
      }),
    },

    system: `
Bạn là trợ lý bán hàng.
- Trả lời ngắn gọn
- Nếu cần tìm sản phẩm thì gọi searchProducts
- Nếu cần phân tích sâu thì dùng askLangchain
`,
  });

  return result.toUIMessageStreamResponse();
}




