

## Test cho sử dụng LangGraph
```plaintext
src/
├── app/
│   ├── page.tsx
│   ├── api/
│   │   └── chat-langgraph/
│   │       └── route.ts
│
├── lib/
│   ├── ai/
│   │   ├── model.ts
│   │   ├── graph.ts
│   │   ├── state.ts
│   │   ├── router.ts
│   │   ├── nodes/
│   │   │   ├── detect-intent.ts
│   │   │   ├── product-search.ts
│   │   │   ├── product-detail.ts
│   │   │   ├── docs-rag.ts
│   │   │   ├── general-chat.ts
│   │   │   └── synthesize.ts
│
├── db/ -> Chưa thiết lập
│   ├── schema/
│   │   ├── products.ts
│   │   └── document_chunks.ts
│   ├── index.ts
```


## Cấu hình cho graph.ts
```typescript
const graph = new StateGraph(AgentState)

  // 1. Khai báo tất cả các Node trước
  .addNode("detectIntent", detectIntent)
  .addNode("extractParams", extractParams)
  .addNode("productSearch", productSearch)
  .addNode("productDetail", productDetail)
  .addNode("docsRag", docsRag)
  .addNode("generalChat", generalChat)
  .addNode("errorHandler", errorHandler)
  .addNode("finalizeResponse", finalizeResponse)

  // 2. Khai báo các Edge (routing)
  .addConditionalEdges("detectIntent", routeByIntent)

  .addEdge("extractParams", "productSearch")
  .addEdge("productSearch", "finalizeResponse")
  .addEdge("productDetail", "finalizeResponse")
  .addEdge("docsRag", "finalizeResponse")
  .addEdge("generalChat", "finalizeResponse")
  .addEdge("errorHandler", "finalizeResponse")

  // 3. Các edge conditional khác (nếu có)
  .addConditionalEdges("finalizeResponse", shouldContinue)

  // 4. Entry point
  .setEntryPoint("detectIntent");

export const app = graph.compile();
```


