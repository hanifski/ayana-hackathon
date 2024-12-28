import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, instructions, model } = body;

    // Hardcode file URLs
    const dummyFiles = [
      "https://pdfobject.com/pdf/sample.pdf",
      "https://pdfobject.com/pdf/sample.pdf",
    ];

    // Validate input
    if (!name || !instructions || !model) {
      throw new Error("Missing required fields: name, instructions, or model.");
    }

    // Create vector store
    const vectorStore = await openai.beta.vectorStores.create({
      name: `${name} Vector Store`,
    });

    // Prepare dummy file streams (simulated for URLs)
    const fileStreams = dummyFiles.map((filePath) =>
      Buffer.from(`Simulated content of ${filePath}`)
    );

    // Upload files to the vector store and wait for processing
    await openai.beta.vectorStores.fileBatches.uploadAndPoll(
      vectorStore.id,
      fileStreams
    );

    // Create the assistant with vector store reference
    const assistant = await openai.beta.assistants.create({
      name,
      instructions,
      model,
      tools: [{ type: "file_search" }],
      tool_resources: {
        file_search: {
          vector_store_ids: [vectorStore.id],
        },
      },
    });

    if (!assistant || !assistant.id) {
      throw new Error("Assistant creation failed, no ID returned.");
    }

    // Return assistant details
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
