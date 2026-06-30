

// Link web:
// https://docs.langchain.com/oss/javascript/langchain/overview

/*
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
    return Response.json({
      error: error instanceof Error ? error.message : "Unknown error"
    })
  }
}
*/



import { createAgent } from "langchain";
import { tool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import * as z from "zod";
import { NextRequest } from "next/server";

// Tool example
import {
  productSearchTool,
  productDetailTool,
  docsSearchTool,
} from "@/lib/agent-langgraph/tools";

const getWeather = tool(
  async ({ city }) => {
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1&language=vi`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        return `Không tìm thấy thông tin thời tiết cho thành phố "${city}".`;
      }

      const { latitude, longitude, name } = geoData.results[0];

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?` +
          `latitude=${latitude}&longitude=${longitude}` +
          `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
          `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
          `&timezone=Asia/Ho_Chi_Minh`
      );

      const weatherData = await weatherRes.json();
      const current = weatherData.current;
      const daily = weatherData.daily;

      const weatherCodeMap: { [key: number]: string } = {
        0: "Trời quang",
        1: "Chủ yếu quang",
        2: "Có mây",
        3: "Mây u ám",
        45: "Sương mù",
        51: "Mưa phùn nhẹ",
        61: "Mưa nhẹ",
        63: "Mưa vừa",
        65: "Mưa to",
        71: "Tuyết nhẹ",
        80: "Mưa rào",
        95: "Giông",
      };

      const code = Number(current.weather_code);
      const description = weatherCodeMap[code] || "Thời tiết thay đổi";

      return `
**Thời tiết tại ${name} (${city})**

🌡️ Nhiệt độ hiện tại: **${current.temperature_2m}°C**
☁️ Cảm giác như: ${current.apparent_temperature}°C
💧 Độ ẩm: ${current.relative_humidity_2m}%
🌬️ Gió: ${current.wind_speed_10m} km/h
⛅ Trạng thái: ${description}

**Dự báo:**
- Ngày mai: ${daily.temperature_2m_max[1]}°C / ${daily.temperature_2m_min[1]}°C
- Ngày kia: ${daily.temperature_2m_max[2]}°C / ${daily.temperature_2m_min[2]}°C
      `.trim();
    } catch (error) {
      console.error(error);
      return `Có lỗi khi lấy dữ liệu thời tiết cho "${city}". Vui lòng thử lại sau.`;
    }
  },
  {
    name: "get_weather",
    description: "Lấy thông tin thời tiết hiện tại và dự báo ngắn hạn",
    schema: z.object({
      city: z
        .string()
        .describe("Tên thành phố, ví dụ: Hà Nội, Hồ Chí Minh, Đà Nẵng"),
    }),
  }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return Response.json(
        { error: "messages must be an array" },
        { status: 400 }
      );
    }

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
      temperature: 0.3,
    });

    const agent = createAgent({
      model,
      tools: [getWeather, productSearchTool,
  productDetailTool,
  docsSearchTool],
      systemPrompt:
        "Bạn là trợ lý bán hàng thông minh, vui tính và chuyên nghiệp. Trả lời bằng tiếng Việt.",
    });

    const result = await agent.invoke({
      messages,
    });

    console.log(JSON.stringify(result, null, 2));

    return Response.json(result);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}




