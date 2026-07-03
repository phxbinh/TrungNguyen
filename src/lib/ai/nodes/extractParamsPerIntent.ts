/*
import { z } from "zod";
import { model } from "../model";

const ExtractSchema = z.object({
  productQuery: z.string().optional(),
  docsQuery: z.string().optional(),
});

export async function extractParamsPerIntent(state: any) {
  const structuredModel =
    model.withStructuredOutput(ExtractSchema);

  const res = await structuredModel.invoke(`
User input:
${state.input}

Detected intents:
${JSON.stringify(state.intents)}

Extract separate payload for each intent.

Rules:
- productQuery: only product-related part
- docsQuery: only docs/policy/instruction-related part
`);

  return {
    //...state,
    productQuery: res.productQuery,
    docsQuery: res.docsQuery,
  };
}
*/


import { z } from "zod";
import { model } from "../model";

const ExtractSchema = z.object({
  productQuery: z.string().optional(),
  docsQuery: z.string().optional(),
});

export async function extractParamsPerIntent(state: any) {
  const structuredModel =
    model.withStructuredOutput(ExtractSchema);

  const res = await structuredModel.invoke(`
User input:
${state.input}

Detected intents:
${JSON.stringify(state.intents)}

Extract separate payload for each intent.

Rules:
1. Group entities by the action that governs them.
2. If multiple nouns are connected by "và", "," after one action,
   that action applies to all following nouns unless another action appears.
3. productQuery: only product-related part
4. docsQuery: only docs/policy/guide/instruction-related part

Examples:

Input:
"Tìm iPhone 16, hướng dẫn giặt áo sợi tre và quần jean"

Output:
{
  "productQuery": "iPhone 16",
  "docsQuery": "hướng dẫn giặt áo sợi tre, quần jean"
}

`);

  return {
    //...state,
    productQuery: res.productQuery,
    docsQuery: res.docsQuery,
  };
}









