
/*
checkpointSaver sử dụng MemorySaver của thư viện
@langchain/langgraph -> lưu lịch sử chát trên RAM
khi thoát chát và refresh là mất lịch sử chát
*/
/*
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver } from "@langchain/langgraph";

import {
  productSearchTool,
  productDetailTool,
  docsSearchTool,
} from "./tools";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  temperature: 0.3,
});

export const app = createReactAgent({
  llm: model,
  tools: [
    productSearchTool,
    productDetailTool,
    docsSearchTool,
  ],
  checkpointSaver: new MemorySaver(),

  prompt: `Bạn là trợ lý bán hàng thông minh, vui tính và chuyên nghiệp.
Hãy sử dụng tool khi cần thiết để trả lời chính xác nhất.
Trả lời bằng tiếng Việt, ngắn gọn và dễ hiểu.`,
});
//*/




/*
checkpointSaver sử dụng PostgresSaver của thư viện
@langchain/langgraph-checkpoint-postgres -> lưu lịch sử chát trên DN neon
Khi thoát chát và refresh thì lịch sử chát vẫn được lưu lại
*/
//*
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { Pool } from "pg";

import {
  productSearchTool,
  productDetailTool,
  docsSearchTool,
} from "./tools";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  temperature: 0.3,
});

// PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

// tạo checkpointer
const checkpointer = new PostgresSaver(pool);

// setup bảng checkpoint (chạy 1 lần khi app boot)
await checkpointer.setup();

export const app = createReactAgent({
  llm: model,
  tools: [
    productSearchTool,
    productDetailTool,
    docsSearchTool,
  ],
  checkpointSaver: checkpointer,

  prompt: `Bạn là trợ lý bán hàng thông minh, vui tính và chuyên nghiệp.
Hãy sử dụng tool khi cần thiết để trả lời chính xác nhất.
Trả lời bằng tiếng Việt, ngắn gọn và dễ hiểu.`,
});
//*/
