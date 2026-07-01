import { productAgent } from "./product-agent";

/* Không dùng 
export async function productAgentNode(state: any) {
  const result = await productAgent.invoke({
    messages: [
      {
        role: "user",
        content: state.input,
      },
    ],
  });

  const finalMessage =
    result.messages[result.messages.length - 1];

  return {
    ...state,
    answer: finalMessage.content,
  };
}
*/

/* đang dùng
export async function runProductAgent(input: string) {
  const result = await productAgent.invoke({
    messages: [{ role: "user", content: input }],
  });

  const final = result.messages
    .filter((m) => m.getType() === "ai")
    .at(-1);

  return {
    answer: final?.content,
    trace: result.messages,
  };
}

export async function productAgentNode(state: any) {
  const { answer } = await runProductAgent(state.input);

  return {
    ...state,
    answer,
  };
}
*/

// Thay thế: đang dùng
export async function runProductAgent(
  productQuery: string
) {
  const result = await productAgent.invoke({
    messages: [
      {
        role: "user",
        content: productQuery,
      },
    ],
  });

  const final = result.messages
    .filter((m) => m.getType() === "ai")
    .at(-1);

  return {
    answer: String(final?.content ?? ""),
    trace: result.messages,
  };
}


export async function productAgentNode(state: any) {
  if (!state.productQuery) {
    return {
      ...state,
    };
  }

  const { answer } = await runProductAgent(
    state.productQuery
  );

  return {
    ...state,
    answer,
  };
}

