

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




