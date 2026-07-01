import { StateGraph, END } from "@langchain/langgraph";
import { AgentState } from "./state-agent-child";

import { detectIntent } from "./product-agent/detect-intent";
import { productAgentNode } from "./product-agent/product-agent-node";
import { docsRag } from "./nodes/docs-rag";
import { generalChat } from "./nodes/general-chat";
import { synthesize } from "./nodes/synthesize";
import { routeIntent } from "./route-agent-child";

export const graph = new StateGraph(AgentState)
  .addNode("detectIntent", detectIntent)
  .addNode("productAgent", productAgentNode)
  .addNode("docsRag", docsRag)
  .addNode("generalChat", generalChat)
  .addNode("synthesize", synthesize)
  .addNode("extractParamsPerIntent", extractParamsPerIntent)

  .addEdge("__start__", "detectIntent")

  .addEdge("detectIntent", "extractParamsPerIntent")
  .addConditionalEdges(
    "extractParamsPerIntent",
    routeIntent
  )
  // Thay thế cho hai cái kế trên
  //.addConditionalEdges("detectIntent", routeIntent)

  .addEdge("productAgent", "synthesize")
  .addEdge("docsRag", "synthesize")
  .addEdge("generalChat", "synthesize")

  .addEdge("synthesize", END)
  .compile();