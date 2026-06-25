// src/app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, tool, stepCountIs } from 'ai';
import { z } from 'zod';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const weatherTool = tool({
  description: 'Get the weather for a city.',
  inputSchema: z.object({ city: z.string() }),
  execute: async ({ city }) => `Thời tiết hiện tại ở ${city} rất đẹp và sunny.`,
});

const getCurrentTime = tool({
  description: 'Lấy giờ hiện tại',
  inputSchema: z.object({}),

  execute: async () => {
    const now = new Date();

    return {
      time: now.toLocaleTimeString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
      }),
      date: now.toLocaleDateString('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
      }),
      timezone: 'Asia/Ho_Chi_Minh',
      iso: now.toISOString(),
      timestamp: now.getTime(),
    };
  },
});

const buildProductQuery = tool({
  description:
    'Phân tích câu hỏi người dùng về sản phẩm và tạo object filter để tìm kiếm.',

  inputSchema: z.object({
    keyword: z
      .string()
      .describe('Tên hoặc từ khóa sản phẩm'),

    category: z
      .string()
      .optional()
      .describe('Danh mục sản phẩm'),

    color: z
      .string()
      .optional()
      .describe('Màu sắc mong muốn'),

    size: z
      .string()
      .optional()
      .describe('Kích thước mong muốn'),

    maxPrice: z
      .number()
      .optional()
      .describe('Giá tối đa user muốn trả'),
  }),

  execute: async ({
    keyword,
    category,
    color,
    size,
    maxPrice,
  }) => {
    return {
      success: true,

      query: {
        keyword,
        category: category || null,
        color: color || null,
        size: size || null,
        maxPrice: maxPrice || null,
      },

      message:
        'Đã phân tích yêu cầu sản phẩm, sẵn sàng tìm trong database.',
    };
  },
});


const getTodos = tool({
  description:
    'Lấy danh sách công việc từ bảng todosnew.',

  inputSchema: z.object({
    completed: z
      .boolean()
      .optional()
      .describe('Lọc theo trạng thái hoàn thành'),

    keyword: z
      .string()
      .optional()
      .describe('Từ khóa tìm trong title'),

    limit: z
      .number()
      .optional()
      .describe('Số lượng tối đa'),
  }),

  execute: async ({
    completed,
    keyword,
    limit = 10,
  }) => {
    // Mock data
    const todos = [
      {
        id: 1,
        title: 'Học AI SDK',
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        title: 'Làm UI Todo',
        completed: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        title: 'Viết tool query DB',
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    let filtered = todos;

    if (typeof completed === 'boolean') {
      filtered = filtered.filter(
        (t) => t.completed === completed
      );
    }

    if (keyword) {
      filtered = filtered.filter((t) =>
        t.title
          .toLowerCase()
          .includes(keyword.toLowerCase())
      );
    }

    filtered = filtered.slice(0, limit);

    return {
      total: filtered.length,
      todos: filtered,
    };
  },
});




export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const result = await streamText({   // ← giữ await
      model: google('gemini-2.5-flash'),
      tools: {
        getWeather: weatherTool,
        getCurrentTime: getCurrentTime,
        buildProductQuery,
        getTodos
      },
      system: `Bạn là trợ lý AI thân thiện, trả lời bằng tiếng Việt.
- Nếu hỏi về thời tiết của thành phố thì gọi tool getWeather.
- Nếu hỏi về thời gian hiện tại thì gọi tool getCurrentTime.
- Nếu hỏi về công việc, danh sách công việc thì gọi tool getTodos.
- Nếu không thì trả lời bằng kiến thức của mình.
`,
      
      stopWhen: stepCountIs(5),

      messages: await convertToModelMessages(messages),
    });

    // ✅ Dùng toDataStreamResponse (phù hợp với useChat + tools)
    //return result.toDataStreamResponse();
    
    // Nếu vẫn lỗi type, thử dòng này thay thế:
    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

