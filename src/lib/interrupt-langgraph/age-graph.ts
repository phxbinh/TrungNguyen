import {
  Annotation,
  Command,
  END,
  interrupt,
  MemorySaver,
  START,
  StateGraph,
} from "@langchain/langgraph";

export const FormState = Annotation.Root({
  age: Annotation<number | null>({
    reducer: (_, right) => right,
    default: () => null,
  }),

  pendingQuestion: Annotation<string | null>({
    reducer: (_, right) => right,
    default: () => null,
  }),
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

  .addConditionalEdges("collectAge", (state) => {
    if (state.age !== null) {
      return END;
    }

    return "collectAge";
  });

export const graph = builder.compile({
  checkpointer: new MemorySaver(),
});

export { Command };