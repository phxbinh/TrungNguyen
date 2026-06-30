import { productAgent } from "./product-agent";

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