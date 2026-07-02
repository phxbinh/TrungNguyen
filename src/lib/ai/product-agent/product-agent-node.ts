
/*
import { productAgent } from "./product-agent";

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



*/

import { productAgent } from "./product-agent";

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

  let products = [];
  let product = null;
  let answer = "";

  for (const msg of result.messages) {
    if (msg.getType() === "tool") {
      const content =
        typeof msg.content === "string"
          ? JSON.parse(msg.content)
          : msg.content;

      if (content.products) {
        products = content.products;
      }

      if (content.product) {
        product = content.product;
      }
    }

    if (msg.getType() === "ai") {
      answer = String(msg.content ?? "");
    }
  }

  return {
    products,
    product,
    answer,
    trace: result.messages,
  };
}

export async function productAgentNode(state: any) {
  if (!state.productQuery) {
    return {
      ...state,
    };
  }

  const {
    products,
    product,
    answer,
  } = await runProductAgent(
    state.productQuery
  );

  return {
    ...state,
    products,
    product,
    answer,
  };
}



