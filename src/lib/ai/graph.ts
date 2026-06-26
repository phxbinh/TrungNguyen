import { StateGraph, END } from "@langchain/langgraph";
import { detectIntent } from "./nodes/detect-intent";
import { productSearch } from "./nodes/product-search";
import { productDetail } from "./nodes/product-detail";
import { docsRag } from "./nodes/docs-rag";
import { generalChat } from "./nodes/general-chat";
import { synthesize } from "./nodes/synthesize";
import { routeIntent } from "./router";

export const graph = new StateGraph<any>()
  .addNode("detectIntent", detectIntent)
  .addNode("productSearch", productSearch)
  .addNode("productDetail", productDetail)
  .addNode("docsRag", docsRag)
  .addNode("generalChat", generalChat)
  .addNode("synthesize", synthesize)

  .setEntryPoint("detectIntent")

  .addConditionalEdges("detectIntent", routeIntent)

  .addEdge("productSearch", "synthesize")
  .addEdge("productDetail", "synthesize")
  .addEdge("docsRag", "synthesize")
  .addEdge("generalChat", "synthesize")

  .addEdge("synthesize", END)

  .compile();