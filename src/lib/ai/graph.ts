
//✅ -> Gốc chạy được và không có extractParams
/*
import { StateGraph, END } from "@langchain/langgraph";
import { AgentState } from "./state";

import { detectIntent } from "./nodes/detect-intent";
import { productSearch } from "./nodes/product-search";
import { productDetail } from "./nodes/product-detail";
import { docsRag } from "./nodes/docs-rag";
import { generalChat } from "./nodes/general-chat";
import { synthesize } from "./nodes/synthesize";
import { routeIntent } from "./router";

export const graph = new StateGraph(AgentState)
  .addNode("detectIntent", detectIntent)
  .addNode("productSearch", productSearch)
  .addNode("productDetail", productDetail)
  .addNode("docsRag", docsRag)
  .addNode("generalChat", generalChat)
  .addNode("synthesize", synthesize)

  .addEdge("__start__", "detectIntent")

  .addConditionalEdges("detectIntent", routeIntent)

  .addEdge("productSearch", "synthesize")
  .addEdge("productDetail", "synthesize")
  .addEdge("docsRag", "synthesize")
  .addEdge("generalChat", "synthesize")

  .addEdge("synthesize", END)

  .compile();
//*/


//⛔️ -> Không thấy phản ứng gì
/*
import { StateGraph, END } from "@langchain/langgraph";
import { AgentState } from "./state";

import { detectIntent } from "./nodes/detect-intent";
import { productSearch } from "./nodes/product-search";
import { productDetail } from "./nodes/product-detail";
import { docsRag } from "./nodes/docs-rag";
import { generalChat } from "./nodes/general-chat";
import { synthesize } from "./nodes/synthesize";
import { extractParams } from "./nodes/extractParams";
import { routeIntent } from "./router";

export const graph = new StateGraph(AgentState)
  .addNode("detectIntent", detectIntent)
  .addNode("productSearch", productSearch)
  .addNode("productDetail", productDetail)
  .addNode("docsRag", docsRag)
  .addNode("generalChat", generalChat)
  .addNode("extractParams", extractParams)
  .addNode("synthesize", synthesize)

  .addEdge("__start__", "detectIntent")

  // không đi qua extactParams
  //.addConditionalEdges("detectIntent", routeIntent)

// Hai cái addConditionEdges bên dưới thay thế cho cái ở trên
.addConditionalEdges("detectIntent", (state) => {
  if (
    state.intent === "PRODUCT_SEARCH" ||
    state.intent === "PRODUCT_DETAIL"
  ) {
    return "extractParams";
  }
  return routeIntent(state);
})

.addConditionalEdges("extractParams", routeIntent)

  .addEdge("productSearch", "synthesize")
  .addEdge("productDetail", "synthesize")
  .addEdge("docsRag", "synthesize")
  .addEdge("generalChat", "synthesize")
  .addEdge("extractParams", "synthesize")

  .addEdge("synthesize", END)

  .compile();

//*/


import { StateGraph, END } from "@langchain/langgraph";
import { AgentState } from "./state";

import { detectIntent } from "./nodes/detect-intent";
import { productSearch } from "./nodes/product-search";
import { productDetail } from "./nodes/product-detail";
import { docsRag } from "./nodes/docs-rag";
import { generalChat } from "./nodes/general-chat";
import { synthesize } from "./nodes/synthesize";
import { extractParams } from "./nodes/extractParams";

function routeIntent(state: any) {
  switch (state.intent) {
    case "PRODUCT_SEARCH":
      return "productSearch";

    case "PRODUCT_DETAIL":
      return "productDetail";

    case "DOCS":
      return "docsRag";

    default:
      return "generalChat";
  }
}

// router riêng sau extract
function routeAfterExtract(state: any) {
  // extract xong nếu đủ để trả lời thì synthesize luôn
  if (state.skipTool) {
    return "synthesize";
  }

  // nếu chưa đủ thì đi tiếp theo intent
  return routeIntent(state);
}

export const graph = new StateGraph(AgentState)
  .addNode("detectIntent", detectIntent)
  .addNode("extractParams", extractParams)
  .addNode("productSearch", productSearch)
  .addNode("productDetail", productDetail)
  .addNode("docsRag", docsRag)
  .addNode("generalChat", generalChat)
  .addNode("synthesize", synthesize)

  .addEdge("__start__", "detectIntent")

  // nếu là product thì qua extract trước
  .addConditionalEdges("detectIntent", (state) => {
    if (
      state.intent === "PRODUCT_SEARCH" ||
      state.intent === "PRODUCT_DETAIL"
    ) {
      return "extractParams";
    }

    return routeIntent(state);
  })

  // sau extract quyết định tiếp
  .addConditionalEdges("extractParams", routeAfterExtract)

  .addEdge("productSearch", "synthesize")
  .addEdge("productDetail", "synthesize")
  .addEdge("docsRag", "synthesize")
  .addEdge("generalChat", "synthesize")

  .addEdge("synthesize", END)

  .compile();



