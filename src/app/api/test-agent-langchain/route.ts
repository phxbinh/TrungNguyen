

// Link web:
// https://docs.langchain.com/oss/javascript/langchain/overview

// app/api/agent/route.ts
import { createAgent, tool } from "langchain";  // Kiểm tra lại import chính xác
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as z from "zod";
import { NextRequest } from "next/server";

// Tool ví dụ
const getWeather = tool(
  (input) => `Thời tiết tại ${input.city} đang rất sunny! ☀️`,
  {
    name: "get_weather",
    description: "Lấy thông tin thời tiết cho một thành phố",
    schema: z.object({
      city: z.string().describe("Tên thành phố cần xem thời tiết"),
    }),
  }
);


export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      temperature: 0.3,
    });

    const agent = createAgent({
      model,
      tools: [getWeather],
      // systemPrompt thay vì prompt (tùy phiên bản)
      systemPrompt: "Bạn là trợ lý bán hàng thông minh, vui tính và chuyên nghiệp. Trả lời bằng tiếng Việt.",
    });

    const result = await agent.invoke({
      messages,
    });


console.log(JSON.stringify(result, null, 2));




    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
}