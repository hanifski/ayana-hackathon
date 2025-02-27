"use server";

import OpenAI from "openai";
import { AssistantInput } from "../validations/assistant";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });

// Function to create assistant to OpenAI
export async function createAssistant(input: AssistantInput) {
  try {
    // Create assistant in OpenAI
    const assistant = await openai.beta.assistants.create(input);
    // Return assistant to client
    return assistant.id;
  } catch (error: any) {
    // Throw error if creation fails
    if (error instanceof Error) throw error;
    throw new Error("Failed to create assistant");
  }
}


// Function to create assistant to OpenAI
export async function _createAssistant(input: {
  assistant_id?: string;
  model: string;
  name: string;
  instructions?: string;
  vector_store_id?: string;
}) {
  const assistantConfig: any = {
    model: input.model,
    name: input.name,
  };

  // Add optional parameters if they exist
  if (input.instructions) {
    assistantConfig.instructions = input.instructions;
  }

  if (input.vector_store_id) {
    assistantConfig.tools = [{ type: "file_search" }];
    assistantConfig.tool_resources = {
      file_search: {
        vector_store_ids: [input.vector_store_id],
      },
    };
  }

  const output = await openai.beta.assistants.create(assistantConfig);
  return output.id;
}

export async function updateAssistantInstruction(input: any) {
  const output = await openai.beta.assistants.update(input.assistant_id, {
    instructions: input.instructions,
  });
  return output.description;
}

// Function to create assistant to OpenAI without file
export async function _createAssistantWithoutFile(input: any) {
  const output = await openai.beta.assistants.create({
    model: input.model,
    name: input.name,
    instructions: input.instructions,
    tools: [{ type: "file_search" }],
  });

  return output.id;
}
