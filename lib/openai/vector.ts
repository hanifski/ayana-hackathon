"use server";

import OpenAI from "openai";
import { VectorCreate, VectorUpdate } from "@/interfaces/openai.interface";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });

// Function to create vector store
export async function _createVectorStore(input: VectorCreate) {
  const output = await openai.beta.vectorStores.create({
    name: input.name,
  });

  return output.id;
}

export async function _updateVectorStore(input: VectorUpdate) {
  const output = await openai.beta.vectorStores.fileBatches.createAndPoll(
    input.vector_store_id,
    {
      file_ids: input.file_ids,
    }
  );

  return output.id;
}
