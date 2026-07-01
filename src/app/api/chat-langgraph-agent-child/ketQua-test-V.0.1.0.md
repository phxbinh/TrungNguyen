

# AI AGENT Combine GRAPH + createReactAgent
## Mô tả Agent
### Chức năng
Ai agent được thiết kế theo graph: luồng làm việc được xác định sẵn.
kết hợp với một ai agent cho phép tự động gọi tool phù hợp nhất với yêu cầu

### Kiến trúc

## Packages và AI Api key
### Packages
#### Packages được install (npm install ...)
```json
{
    "ai": "^6.0.0",
    "@ai-sdk/google": "^3.0.0",
    "@ai-sdk/react": "^3.0.0",
    
    "zod": "^3.23.8",
    
    "langchain": "^1.5.0",
    "@langchain/google-genai": "^2.2.0",
    "@langchain/core": "^1.2.0",
    "@langchain/community": "^1.1.0",
    "@ai-sdk/langchain": "^1.x",
    "@langchain/langgraph": "^1.x",
    "@langchain/langgraph-checkpoint-postgres": "^1.0.3",
}
```

#### import api của package
```typescript
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
```

### AI Api key
Sử dụng api key của gemini.
* Gemini: gemini-2.5-flash
* Name: LangchainLanggraphVercel
* Project name: projects/378791152913
* Project number: 378791152913
* Project id: gen-lang-client-0616907835

## Cấu trúc folders/files

## Url để kiểm tra hoạt động của Ai agent
* Full url: https://trung-nguyen-ruddy.vercel.app/chat-langgraph-agent-child
    ** Domain: https://trung-nguyen-ruddy.vercel.app
    ** route: /chat-langgraph-agent-child

## Kết quả kiểm thử
- user: Tìm iphone 16 pro
- ai: Đã tìm thấy một số sản phẩm phù hợp với "iphone 16 pro".
Sản phẩm: iPhone 16 Pro, giá: 28.990.000, danh mục: Điện thoại.
----
```plaintext
Detect Intent: PRODUCT_SEARCH
```
----
Full Agent state
```json
{
  "input": "Tìm iphone 16 pro",
  "intent": "PRODUCT_SEARCH",
  "answer": "Đã tìm thấy một số sản phẩm phù hợp với \"iphone 16 pro\".\nSản phẩm: iPhone 16 Pro, giá: 28.990.000, danh mục: Điện thoại."
}
```

