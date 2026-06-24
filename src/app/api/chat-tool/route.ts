import { google } from '@ai-sdk/google';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { NextRequest } from 'next/server';

const weatherTool = tool({
  description: 'Get the weather for a city.',
  inputSchema: z.object({ city: z.string() }),
  execute: async ({ city }) => `It is sunny in ${city}.`,
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const { text, toolCalls, usage } = await generateText({
      model: google('gemini-1.5-flash'), // sửa lại cho đúng
      tools: { getWeather: weatherTool },
      stopWhen: (stepCount) => stepCount >= 5,
      prompt: prompt || 'What is the weather in San Francisco right now?',
    });

    return Response.json({
      text,
      toolCalls,
      usage,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}