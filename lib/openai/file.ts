"use server";

import OpenAI from "openai";
import { FileUpload } from "@/interfaces/openai.interface";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY as string });

// Function to upload file to OpenAI
export async function _uploadFile(input: FileUpload) {
  // Convert url to buffer and then convert back to file object
  const file = await fetch(input.file_url);
  const fileBuffer = await file.arrayBuffer();
  const fileObject = new File([fileBuffer], input.file_name, {
    type: input.file_type,
  });
  // Upload file to OpenAI
  const output = await openai.files.create({
    file: fileObject,
    purpose: "assistants",
  });

  return output.id;
}
