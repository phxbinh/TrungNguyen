import { z } from "zod";
import { model } from "../model";

const ExtractSchema = z.object({
  keyword: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
});

export async function extractParams(state: any) {
  const structuredModel = model.withStructuredOutput(ExtractSchema);

  const params = await structuredModel.invoke(`
    Extract product search parameters from this query:

    "${state.input}"

    Return only structured data.
  `);

  return {
    answer: JSON.stringify(params, null, 2),
  };
}