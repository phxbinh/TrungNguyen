import { model } from "../model";

export async function* synthesizeStream(state: any) {
  const stream = await model.stream(`
Bạn là trợ lý chính thức của công ty.

Ngữ cảnh user:
${state.input}

Dữ liệu hệ thống:
${JSON.stringify({
  products: state.products?.slice(0, 3)?.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
  })),
  product: state.product
    ? {
        id: state.product.id,
        name: state.product.name,
        price: state.product.price,
      }
    : undefined,
  docs: state.docs?.slice(0, 2),
})}
`);

  let finalAnswer = "";

  for await (const chunk of stream) {
    const text = String(chunk.content ?? "");
    finalAnswer += text;
    yield text;
  }

  return {
    input: state.input,
    answer: finalAnswer,
  };
}