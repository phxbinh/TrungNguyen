import { graph } from "@/lib/ai/graph";

export async function POST(req: Request) {
  const { message } = await req.json();

  const result = await graph.invoke({
    input: message,
  });

  return Response.json({
    answer: result.answer,
    state: result,
  });
}