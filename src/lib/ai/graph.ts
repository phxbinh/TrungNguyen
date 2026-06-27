import { StateGraph, END } from "@langchain/langgraph";
import { AgentState } from "./state";

import { detectIntent } from "./nodes/detect-intent";
import { productSearch } from "./nodes/product-search";
import { productDetail } from "./nodes/product-detail";
import { docsRag } from "./nodes/docs-rag";
import { generalChat } from "./nodes/general-chat";
import { synthesize } from "./nodes/synthesize";
import { synthesize } from "./nodes/synthesize";
import { extractParams } from "./nodes/extractParams";

export const graph = new StateGraph(AgentState)
  .addNode("detectIntent", detectIntent)
  .addNode("productSearch", productSearch)
  .addNode("productDetail", productDetail)
  .addNode("docsRag", docsRag)
  .addNode("generalChat", generalChat)
  .addNode("extractParams", extractParams)
  .addNode("synthesize", synthesize)

  .addEdge("__start__", "detectIntent")

  .addConditionalEdges("detectIntent", routeIntent)

  .addEdge("productSearch", "synthesize")
  .addEdge("productDetail", "synthesize")
  .addEdge("docsRag", "synthesize")
  .addEdge("generalChat", "synthesize")
  .addEdge("extractParams", "synthesize")

  .addEdge("synthesize", END)

  .compile();