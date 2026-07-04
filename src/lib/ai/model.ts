import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  //apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  apiKey: process.env.GOOGLE_GEMINI_KEY_API_LANGCHAIN!,
});

//gemini-2.5-flash
//-> 

//gemini-3.5-flash
//-> 

//gemini-3.1-flash-lite
//-> 

//gemma-4-31b-it
//-> Trả kết quà kém
