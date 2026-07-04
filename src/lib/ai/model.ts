import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  //apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  apiKey: process.env.GOOGLE_GEMINI_KEY_API_LANGCHAIN!,
});
//Gemini 3.1 Flash Lite