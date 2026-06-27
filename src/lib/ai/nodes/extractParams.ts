/*
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
*/

/*
✳️ câu hỏi test: Tìm áo hoodie màu đen size M
*/

import { z } from "zod";
import { model } from "../model";

const ExtractSchema = z.object({
  query: z.string(),
  params: z.object({
    keyword: z.string().optional(),
    color: z.string().optional(),
    size: z.string().optional(),
    maxPrice: z.number().optional(),
  }),
});

export async function extractParams(state: any) {
  const structuredModel = model.withStructuredOutput(ExtractSchema);

  const result = await structuredModel.invoke(`
    User query: "${state.input}"

    Extract:
    1. A normalized search query
    2. Structured filters
  `);

  return result;
}


