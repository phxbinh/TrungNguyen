

# AI AGENT Combine GRAPH + createReactAgent
## 1. Mô tả Agent
### 1.1 Chức năng
- Tìm kiếm các sản phẩm
- Tìm kiếm chi tiết sản phẩm
- Tìm kiếm docRag
- Hội thoại thông thường được prompt giới hạn trong phạm vi kiến thức
    -- Chỉ tìm kiếm sản phẩm của shop
    -- Trả lời với docRag chỉ trong phạm vi docRag

### 1.2 Kiến trúc
Có hai Agent được sử dụng:
- **Agent cha** sử dụng Graph để intent và điều phối thông qua:
    -- Luống làm việc được xác định sẵn khi nào thì gọi tool nào, bằng intent và detectRouter
    -- addNode và addEdge
    -- Sử dụng invoke để trả kết quả
- **Agent con** được thiết kế với
    -- createReactAgent cho phép tự chọn lựa việc gọi tool phù hợp nhất.
    -- Được gọi thông qua việc tạo node trung gian và được dùng addNode với addEdge để gọi
----
## 2. Packages và AI Api key
### 2.1 Packages
#### 2.1.1 Packages được install (npm install ...)
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

#### 2.1.2 import api của package
```typescript
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
```

### 2.2 AI Api key
Sử dụng api key của gemini.
* Gemini: gemini-2.5-flash
* Name: LangchainLanggraphVercel
* Project name: projects/378791152913
* Project number: 378791152913
* Project id: gen-lang-client-0616907835
----
## 3. Cấu trúc folders/files


----
## 4. Url để kiểm tra hoạt động của Ai agent
* Full url: https://trung-nguyen-ruddy.vercel.app/chat-langgraph-agent-child
    ** Domain: https://trung-nguyen-ruddy.vercel.app
    ** route: /chat-langgraph-agent-child

----
## 5. Kết quả kiểm thử
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

