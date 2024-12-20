import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { Message } from "@/interfaces/chat";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log("API Keys loaded:", {
      anthropic: !!process.env.ANTHROPIC_API_KEY,
    });

    const { messages, model } = await req.json();

    const response = streamText({
      model: anthropic(model, {
        cacheControl: true,
      }),
      maxTokens: 512,
      temperature: 0.3,
      maxRetries: 5,
      messages: messages.map((message: Message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    return response.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
