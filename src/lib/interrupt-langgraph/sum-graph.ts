import {
  Annotation,
  Command,
  END,
  interrupt,
  MemorySaver,
  START,
  StateGraph,
} from "@langchain/langgraph";

/*
export const SumState = Annotation.Root({
  sum: Annotation<number>({
    reducer: (_, right) => right,
    default: () => 0,
  }),

  currentStep: Annotation<number>({
    reducer: (_, right) => right,
    default: () => 1,
  }),

  pendingQuestion: Annotation<string | null>({
    reducer: (_, right) => right,
    default: () => null,
  }),

  stopped: Annotation<boolean>({
    reducer: (_, right) => right,
    default: () => false,
  }),
});

function createStepNode(stepNumber: number) {
  return (state: typeof SumState.State) => {
    const question =
      state.pendingQuestion ??
      `Step ${stepNumber}: Enter a number (or type 'stop')`;

    const answer = interrupt(question);

    // User muốn dừng
    if (
      typeof answer === "string" &&
      answer.toLowerCase().trim() === "stop"
    ) {
      return {
        stopped: true,
      };
    }

    const parsed = Number(answer);

    // Validate
    if (Number.isNaN(parsed)) {
      return {
        pendingQuestion: `'${answer}' is invalid. Please enter a number or 'stop'.`,
      };
    }

    return {
      sum: state.sum + parsed,
      currentStep: stepNumber + 1,
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
    if (state.currentStep === 2) return "step2";
    return "step1";
  })

  .addConditionalEdges("step2", (state) => {
    if (state.stopped) return END;
    if (state.currentStep === 3) return "step3";
    return "step2";
  })

  .addConditionalEdges("step3", (state) => {
    if (state.stopped) {
      return END;
    }
  
    // valid thì end
    if (state.pendingQuestion === null) {
      return END;
    }
  
    // invalid thì retry step3
    return "step3";
  });


export const graph = builder.compile({
  checkpointer: new MemorySaver(),
});

export { Command };
*/


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

  valid: Annotation<boolean>({
    reducer: (_, right) => right,
    default: () => false,
  }),
});

function createStepNode(stepNumber: number) {
  return (state: typeof SumState.State) => {
    const question =
      state.pendingQuestion ??
      `Step ${stepNumber}: Enter a number (or 'stop')`;

    const payload = interrupt(question);

    const answer =
      typeof payload === "object" && payload !== null
        ? payload.value
        : payload;

    if (
      typeof answer === "string" &&
      answer.trim().toLowerCase() === "stop"
    ) {
      return {
        stopped: true,
        valid: false,
      };
    }

    const parsed = Number(answer);

    if (Number.isNaN(parsed)) {
      return {
        pendingQuestion: `'${answer}' is invalid. Enter a number.`,
        valid: false,
      };
    }

    return {
      sum: state.sum + parsed,
      pendingQuestion: null,
      valid: true,
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
  if (state.valid) return "step2";
  return "step1";
})

.addConditionalEdges("step2", (state) => {
  if (state.stopped) return END;
  if (state.valid) return "step3";
  return "step2";
})

.addConditionalEdges("step3", (state) => {
  if (state.stopped) return END;
  if (state.valid) return END;
  return "step3";
});
/*
  .addConditionalEdges("step1", (state) => {
    if (state.stopped) return END;
    if (state.currentStep === 2) return "step2";
    return "step1";
  })

  .addConditionalEdges("step2", (state) => {
    if (state.stopped) return END;
    if (state.currentStep === 3) return "step3";
    return "step2";
  })

  .addConditionalEdges("step3", (state) => {
    if (state.stopped) {
      return END;
    }
  
    // valid thì end
    if (state.pendingQuestion === null) {
      return END;
    }
  
    // invalid thì retry step3
    return "step3";
  });
*/


export const graph = builder.compile({
  checkpointer: new MemorySaver(),
});

export { Command };





