import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { Message } from "@/interfaces/chat";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
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
    prompt: messages.map((message: any) => message.content).join("\n"),
  });

  const responseContent = await response.toDataStreamResponse();

  const assistantMessage: Message = {
    id: nanoid(),
    role: "assistant",
    content: await responseContent.text(),
    modelId: "claude-3-sonnet",
    createdAt: new Date(),
  };

  return response.toDataStreamResponse();
}
