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