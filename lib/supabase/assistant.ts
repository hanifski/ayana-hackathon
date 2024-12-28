"use client";

import { Assistant } from "@/interfaces/assistant";
import { createClient } from "@/lib/supabase/supabase-client";

const supabase = createClient();

export function assistantService() {
  const create = async (
    assistantId: string,
    assistantName: string,
    assistantModel: string
  ) => {
    try {
      const { data: assistant, error } = await supabase
        .from("assistant")
        .insert([
          {
            assistant_id: assistantId,
            name: assistantName,
            model: assistantModel,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: assistant,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while creating assistant",
      };
    }
  };

  const get = async (assistantId: string) => {
    try {
      const { data: assistant, error } = await supabase
        .from("assistant")
        .select("*")
        .eq("id", assistantId)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: assistant,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching assistant",
      };
    }
  };

  const update = async (assistantId: string, data: Partial<Assistant>) => {
    try {
      const { data: assistant, error } = await supabase
        .from("assistant")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", assistantId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: assistant,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while updating assistant",
      };
    }
  };

  const getAll = async () => {
    try {
      const { data: assistants, error } = await supabase
        .from("assistant")
        .select("*");

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: assistants as Assistant[],
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching assistants",
      };
    }
  };

  return {
    create,
    get,
    update,
    getAll,
  };
}
