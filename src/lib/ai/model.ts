import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model_ = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  //apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  apiKey: process.env.GOOGLE_GEMINI_KEY_API_LANGCHAIN!,
});

//gemini-2.5-flash
//-> 

//gemini-3.5-flash
//-> 

//gemini-3.1-flash-lite
//-> Cài đặt thinkBudget: 2048 -> Cho kết quả chính xác hơn so với
// thinkBudget: 0 và gemini-2.5-flash, gemini-3.5-flash

//gemma-4-31b-it
//-> Trả kết quà có cấu trúc khác với các model Gemini


export const model = new ChatGoogleGenerativeAI({
  // aistudio.google.com -> project: Gemini Langchain Langgraph 2
  model: "gemini-3.1-flash-lite",
  //apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  apiKey: process.env.GOOGLE_GEMINI_KEY_API_LANGCHAIN!,
  temperature: 0,
  thinkingConfig: {
    thinkingBudget: 2048, // <--- ĐÂY LÀ CHÌA KHÓA TIẾT KIỆM TOKEN
  },
});


// 256 512 1024 2048 3072
// Các con số trên được lựa chọn dựa trên phần cứng
// để tối ưu tính toán và hiệu suất sử dụng phần cứng.


