/*
import { model } from "../model";

export async function detectIntent(state: any) {
  const res = await model.invoke(`
Classify:
- PRODUCT_SEARCH
- PRODUCT_DETAIL
- DOCS
- GENERAL

Input: ${state.input}
Only return intent.
`);

  return {
    ...state,
    intent: String(res.content).trim(),
  };
}
*/


/* // -> Chạy được (nhưng bị lỗi với câu hỏi không có chấm phẩy rỏ ràng
import { z } from "zod";
import { model } from "../model";

const IntentSchema = z.object({
  intents: z.array(
    z.enum([
      "PRODUCT_SEARCH",
      "PRODUCT_DETAIL",
      "DOCS",
      "GENERAL",
    ])
  ),
});

export async function detectIntent(state: any) {
  const structuredModel =
    model.withStructuredOutput(IntentSchema);

  const res = await structuredModel.invoke(`
Classify the user input.

Return ALL matching intents.

Available intents:
- PRODUCT_SEARCH
- PRODUCT_DETAIL
- DOCS
- GENERAL

User input:
${state.input}
`);

  return {
    //...state,
    intents: res.intents,
  };
}

*/


import { z } from "zod";
import { model } from "../model";
import { ChatPromptTemplate } from "@langchain/core/prompts"; // Hoặc từ gói tương đương bạn đang dùng

const IntentSchema = z.object({
  intents: z.array(
    z.enum([
      "PRODUCT_SEARCH",
      "PRODUCT_DETAIL",
      "DOCS",
      "GENERAL",
    ])
  ).min(1, "At least one intent must be detected"), // Ép buộc phải chọn ít nhất 1 intent, hoặc bỏ nếu bạn chấp nhận mảng rỗng
});

// Định nghĩa prompt rõ ràng
const intentPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Classify the user input into one or more of the following intents:
- PRODUCT_SEARCH
- PRODUCT_DETAIL
- DOCS
- GENERAL

Return ALL matching intents based on the context. If nothing matches, default to GENERAL.`
  ],
  ["human", "{input}"],
]);

export async function detectIntent(state: { input: string }) {
  // Đảm bảo có input hợp lệ
  if (!state?.input) {
    return { intents: ["GENERAL"] };
  }

  // Kết hợp prompt với model có structured output
  const structuredModel = model.withStructuredOutput(IntentSchema);
  const chain = intentPrompt.pipe(structuredModel);

  try {
    const res = await chain.invoke({
      input: state.input,
    });

    return {
      intents: res.intents,
    };
  } catch (error) {
    console.error("Failed to detect intent:", error);
    // Fallback an toàn khi LLM lỗi hoặc không tuân thủ schema
    return {
      intents: ["GENERAL"],
    };
  }
}



