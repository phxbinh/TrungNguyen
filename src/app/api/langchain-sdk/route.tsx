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