/*
import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
  input: Annotation<string>,

  // từ single -> multi intent
  intents: Annotation<string[] | undefined>,

  query: Annotation<string | undefined>,
  params: Annotation<Record<string, any> | undefined>,

  products: Annotation<any[] | undefined>,
  product: Annotation<any | undefined>,
  docs: Annotation<any[] | undefined>,

  answer: Annotation<string | undefined>,
});

export type AgentStateType = typeof AgentState.State;
*/


import { Annotation } from "@langchain/langgraph";

export const AgentState = Annotation.Root({
  input: Annotation<string>,
  intents: Annotation<string[] | undefined>,

  productQuery: Annotation<string | undefined>,
  docsQuery: Annotation<string | undefined>,

  products: Annotation<any[] | undefined>,
  product: Annotation<any | undefined>,
  docs: Annotation<any[] | undefined>,

  answer: Annotation<string | undefined>,
});

export type AgentStateType = typeof AgentState.State;



