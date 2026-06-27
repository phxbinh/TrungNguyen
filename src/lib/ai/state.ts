import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
  input: Annotation<string>,
  intent: Annotation<string | undefined>,
  query: Annotation<string | undefined>, // normalized query
  params: Annotation<Record<string, any> | undefined>, // structured params
  products: Annotation<any[] | undefined>,
  product: Annotation<any | undefined>,
  docs: Annotation<any[] | undefined>,
  answer: Annotation<string | undefined>,
});

export type AgentStateType = typeof AgentState.State;