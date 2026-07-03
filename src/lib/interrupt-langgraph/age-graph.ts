import {
  StateGraph,
  StateSchema,
  START,
  END,
  interrupt,
  Command,
  MemorySaver,
} from "@langchain/langgraph";
import * as z from "zod";

const FormState = new StateSchema({
  age: z.number().nullable(),
  pendingQuestion: z.string().nullable(),
});

const builder = new StateGraph(FormState)
  .addNode("collectAge", (state) => {
    const question =
      state.pendingQuestion ?? "What is your age?";

    const answer = interrupt(question);

    const parsed = Number(answer);

    if (!Number.isNaN(parsed) && parsed > 0) {
      return {
        age: parsed,
        pendingQuestion: null,
      };
    }

    return {
      age: null,
      pendingQuestion: `'${answer}' is not valid. Please enter a positive number.`,
    };
  })
  .addEdge(START, "collectAge")
  .addConditionalEdges("collectAge", (state) =>
    state.age !== null ? END : "collectAge"
  );

export const graph = builder.compile({
  checkpointer: new MemorySaver(),
});

export { Command };