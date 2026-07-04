import {
  Annotation,
  Command,
  END,
  interrupt,
  MemorySaver,
  START,
  StateGraph,
} from "@langchain/langgraph";

export const SumState = Annotation.Root({
  sum: Annotation<number>({
    reducer: (left, right) => right ?? left,
    default: () => 0,
  }),

  pendingQuestion: Annotation<string | null>({
    reducer: (left, right) => right ?? left,
    default: () => null,
  }),

  stopped: Annotation<boolean>({
    reducer: (left, right) => right ?? left,
    default: () => false,
  }),
});

function createStepNode(stepNumber: number) {
  return (state: typeof SumState.State) => {
    const question =
      state.pendingQuestion ??
      `Step ${stepNumber}: Enter a number (or type "stop")`;

    const payload = interrupt(question);

    const answer =
      typeof payload === "object" && payload !== null
        ? payload.value
        : payload;

    // Stop workflow
    if (
      typeof answer === "string" &&
      answer.trim().toLowerCase() === "stop"
    ) {
      return {
        stopped: true,
      };
    }

    const parsed = Number(answer);

    // Invalid input -> retry same step
    if (Number.isNaN(parsed)) {
      return {
        pendingQuestion: `'${answer}' is invalid. Enter a valid number or "stop".`,
      };
    }

    return {
      sum: state.sum + parsed,
      pendingQuestion: null,
    };
  };
}

const builder = new StateGraph(SumState)
  .addNode("step1", createStepNode(1))
  .addNode("step2", createStepNode(2))
  .addNode("step3", createStepNode(3))

  .addEdge(START, "step1")

  .addConditionalEdges("step1", (state) => {
    if (state.stopped) return END;

    if (state.pendingQuestion !== null) {
      return "step1";
    }

    return "step2";
  })

  .addConditionalEdges("step2", (state) => {
    if (state.stopped) return END;

    if (state.pendingQuestion !== null) {
      return "step2";
    }

    return "step3";
  })

  .addConditionalEdges("step3", (state) => {
    if (state.stopped) return END;

    if (state.pendingQuestion !== null) {
      return "step3";
    }

    return END;
  });

export const graph = builder.compile({
  checkpointer: new MemorySaver(),
});

export { Command };