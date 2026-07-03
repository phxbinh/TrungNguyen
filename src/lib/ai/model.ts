import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  //apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  apiKey: process.env.GOOGLE_GEMINI_KEY_API_LANGCHAIN!,
});