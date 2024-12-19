import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, instructions, model } = body;

    // Create the assistant in OpenAI
    const assistant = await openai.beta.assistants.create({
      name,
      instructions,
      model,
      tools: [{ type: "file_search" }],
    });

    // Log the assistant response for debugging
    console.log("Assistant created:", assistant);

    // Check if the assistant creation was successful
    if (!assistant || !assistant.id) {
      throw new Error("Assistant creation failed, no ID returned.");
    }

    return NextResponse.json(assistant);
  } catch (error) {
    console.error("Error creating assistant:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to create assistant",
      },
      { status: 500 }
    );
  }
}
