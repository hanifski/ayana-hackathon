"use server";

import OpenAI from "openai";
import { AssistantCreate } from "@/interfaces/openai.interface";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });

// Function to create assistant to OpenAI
// export async function _createAssistant(input: any) {
//   const output = await openai.beta.assistants.create({
//     model: input.model,
//     name: input.name,
//     instructions: input.instructions,
//     tools: [{ type: "file_search" }],
//     tool_resources: {
//       file_search: {
//         vector_store_ids: [input.vector_store_id],
//       },
//     },
//   });

//   return output.id;
// }

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

export async function _updateAssistantInstruction(input: any) {
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
