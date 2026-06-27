import { model } from "../model";

export async function detectIntent(state: any) {
  const res = await model.invoke(`
Classify:
- PRODUCT_SEARCH
- PRODUCT_DETAIL
- DOCS
- GENERAL
- EXTRACT_PARAMS

Input: ${state.input}
Only return intent.
`);

  return {
    ...state,
    intent: String(res.content).trim(),
  };
}