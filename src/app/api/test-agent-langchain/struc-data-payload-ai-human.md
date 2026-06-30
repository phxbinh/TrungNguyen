

## Payload có data thật từ POST
```ts
const logs = {
  messages: [
    {
      lc: 1,
      type: "constructor",
      id: ["langchain_core", "messages", "HumanMessage"],
      kwargs: {
        content: "Hello",
        additional_kwargs: {},
        response_metadata: {},
        id: "6daf85a3-7771-485e-bc6f-64dee2bed948",
      },
    },
    {
      lc: 1,
      type: "constructor",
      id: ["langchain_core", "messages", "AIMessage"],
      kwargs: {
        content:
          "Chào bạn! Tôi là trợ lý bán hàng thông minh, vui tính và chuyên nghiệp đây. Rất vui được giúp đỡ bạn. Bạn cần tìm hiểu gì hôm nay? 😊\n",
        tool_calls: [],
        additional_kwargs: {
          finishReason: "STOP",
          index: 0,
          __gemini_function_call_thought_signatures__: {},
        },
        usage_metadata: {
          input_tokens: 74,
          output_tokens: 36,
          total_tokens: 110,
        },
        invalid_tool_calls: [],
        response_metadata: {
          tokenUsage: {
            promptTokens: 74,
            completionTokens: 36,
            totalTokens: 110,
          },
          finishReason: "STOP",
          index: 0,
        },
        name: "model",
        id: "b13d52ad-97bf-484f-ad51-3e126d46f67e",
      },
    },
  ],
} as const;
```

## Cấu trúc data của payload
### Typescript 
```ts
type BaseMessage = {
  lc: number;
  type: "constructor";
  id: string[];
  kwargs: {
    content: string;
    additional_kwargs: Record<string, unknown>;
    response_metadata: Record<string, unknown>;
    id: string;
  };
};

type HumanMessage = BaseMessage & {
  id: ["langchain_core", "messages", "HumanMessage"];
};

type AIMessage = {
  lc: number;
  type: "constructor";
  id: ["langchain_core", "messages", "AIMessage"];
  kwargs: {
    content: string;
    tool_calls: unknown[];
    additional_kwargs: {
      finishReason: string;
      index: number;
      __gemini_function_call_thought_signatures__: Record<string, unknown>;
    };
    usage_metadata: {
      input_tokens: number;
      output_tokens: number;
      total_tokens: number;
    };
    invalid_tool_calls: unknown[];
    response_metadata: {
      tokenUsage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
      };
      finishReason: string;
      index: number;
    };
    name: string;
    id: string;
  };
};

export type AgentLogPayload = {
  messages: (HumanMessage | AIMessage)[];
};
```
### Zod
```ts
import { z } from "zod";

const HumanMessageSchema = z.object({
  lc: z.number(),
  type: z.literal("constructor"),
  id: z.tuple([
    z.literal("langchain_core"),
    z.literal("messages"),
    z.literal("HumanMessage"),
  ]),
  kwargs: z.object({
    content: z.string(),
    additional_kwargs: z.record(z.string(), z.unknown()),
    response_metadata: z.record(z.string(), z.unknown()),
    id: z.string(),
  }),
});

const AIMessageSchema = z.object({
  lc: z.number(),
  type: z.literal("constructor"),
  id: z.tuple([
    z.literal("langchain_core"),
    z.literal("messages"),
    z.literal("AIMessage"),
  ]),
  kwargs: z.object({
    content: z.string(),
    tool_calls: z.array(z.unknown()),
    additional_kwargs: z.object({
      finishReason: z.string(),
      index: z.number(),
      __gemini_function_call_thought_signatures__: z.record(
        z.string(),
        z.unknown()
      ),
    }),
    usage_metadata: z.object({
      input_tokens: z.number(),
      output_tokens: z.number(),
      total_tokens: z.number(),
    }),
    invalid_tool_calls: z.array(z.unknown()),
    response_metadata: z.object({
      tokenUsage: z.object({
        promptTokens: z.number(),
        completionTokens: z.number(),
        totalTokens: z.number(),
      }),
      finishReason: z.string(),
      index: z.number(),
    }),
    name: z.string(),
    id: z.string(),
  }),
});

export const AgentLogPayloadSchema = z.object({
  messages: z.array(
    z.discriminatedUnion("id", [HumanMessageSchema, AIMessageSchema])
  ),
});

export type AgentLogPayload = z.infer<typeof AgentLogPayloadSchema>;
```

Vì sao input_tokens nhiều hơn dù user chỉ gửi "Hello"?

Khi nhìn log:

{
  "usage_metadata": {
    "input_tokens": 74,
    "output_tokens": 36,
    "total_tokens": 110
  }
}

Dễ nghĩ rằng:

User input = "Hello"
=> chỉ vài token
=> sao lại thành 74?

Nhưng thực tế input_tokens không chỉ là message của user.

⸻

Input tokens gồm những gì?

1. User message

Ví dụ:

Hello

Phần này thường chỉ ~1–3 tokens.

⸻

2. System Prompt

Đây thường là phần tốn token nhất.

Ví dụ:

systemPrompt: `
Bạn là trợ lý bán hàng.
Luôn trả lời lịch sự.
Ưu tiên tư vấn sản phẩm.
...`

Model luôn nhận phần này trước message user.

Có thể chiếm:

30–300+ tokens

⸻

3. Tool definitions

Nếu dùng agent có tools:

tools: [
  productSearchTool,
  docsSearchTool
]

LangChain sẽ serialize toàn bộ:

* tool name
* description
* schema
* parameters

Ví dụ:

{
  name: "product_search",
  description: "Tìm sản phẩm",
  parameters: {...}
}

Phần này có thể thêm:

20–200+ tokens/tool

⸻

4. Conversation history

Nếu có memory:

checkpointer: new MemorySaver()

Model sẽ nhận lại:

* HumanMessage cũ
* AIMessage cũ
* ToolMessage cũ

=> token tăng dần theo số lượt chat.

⸻

5. Provider wrappers (internal formatting)

Ví dụ với Gemini/OpenAI:

Model thường wrap thành dạng:

System:
...
Tools:
...
User:
Hello

Kèm:

* role metadata
* tool call protocol
* safety formatting

Phần này cũng tiêu token.

⸻

Ví dụ breakdown thực tế

User chỉ gửi:

Hello

Nhưng model thực nhận:

System prompt         ~40
Tool schemas          ~25
Role formatting       ~5
User message          ~2
--------------------------
Total                 ~74

=> hoàn toàn khớp log:

{
  "input_tokens": 74
}

⸻

Công thức tổng quát

input_tokens =
system_prompt
+ tool_definitions
+ conversation_history
+ provider_wrappers
+ current_user_message

⸻

Kết luận

input_tokens = toàn bộ prompt gửi vào model

Không phải chỉ là:

user.content

Cho nên:

User = "Hello"
Input tokens = 74

là hoàn toàn bình thường.


