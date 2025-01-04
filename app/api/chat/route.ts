import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    tools: {
      weather: tool({
        description: "Get the weather in a location (fahrenheit)",
        parameters: z.object({
          location: z.string().describe("The location to get the weather for"),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: "Convert a temperature in fahrenheit to celsius",
        parameters: z.object({
          temperature: z
            .number()
            .describe("The temperature in fahrenheit to convert"),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}

// import { anthropic } from "@ai-sdk/anthropic";
// import { streamText } from "ai";
// import { Message } from "@/interfaces/chat";

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   try {
//     console.log("API Keys loaded:", {
//       anthropic: !!process.env.ANTHROPIC_API_KEY,
//     });

//     const { messages, model } = await req.json();

//     const response = streamText({
//       model: anthropic(model, {
//         cacheControl: true,
//       }),
//       maxTokens: 512,
//       temperature: 0.3,
//       maxRetries: 5,
//       messages: messages.map((message: Message) => ({
//         role: message.role,
//         content: message.content,
//       })),
//     });

//     return response.toDataStreamResponse();
//   } catch (error) {
//     console.error("Error in chat API:", error);
//     return new Response(JSON.stringify({ error: "An error occurred" }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }
