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
    ...state,
    productQuery: res.productQuery,
    docsQuery: res.docsQuery,
  };
}