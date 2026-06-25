import {
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai';
import { xai } from '@ai-sdk/google';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } =
    await req.json();

  const result = streamText({
    model: google('gemini-2.5-flash'),

    system: `
Use tools when needed.
Always ask for confirmation before using getLocation.
`,

    messages: convertToModelMessages(messages),

    tools: {
      getWeather: {
        description: 'Get weather for a city',
        inputSchema: z.object({
          city: z.string(),
        }),
        execute: async ({ city }) => {
          const weatherOptions = [
            'sunny',
            'cloudy',
            'rainy',
            'snowy',
            'windy',
          ];

          return {
            city,
            weather:
              weatherOptions[
                Math.floor(
                  Math.random() * weatherOptions.length
                )
              ],
          };
        },
      },

      askConfirmation: {
        description: 'Ask user for confirmation',
        inputSchema: z.object({
          message: z.string(),
        }),
      },

      getLocation: {
        description: 'Get user location',
        inputSchema: z.object({}),
      },
    },
  });

  return result.toUIMessageStreamResponse();
}