import { model } from "../model";

export async function synthesize(state: any) {
  const res = await model.invoke(`
User: ${state.input}

Data:
${JSON.stringify({
  products: state.products,
  product: state.product,
  docs: state.docs,
  answer: state.answer,
})}

Generate final answer.
`);

  return {
    ...state,
    answer: String(res.content),
  };
}