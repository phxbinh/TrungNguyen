import { productAgent } from "./product-agent";


//* đang dùng
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
//*/

