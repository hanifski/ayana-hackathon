"use server";

import { createClient } from "./client-server";

// Initialize Supabase client

type FilterOperator =
  | "eq" // '=' (equal to)
  | "neq" // '!=' (not equal to)
  | "gt" // '>' (greater than)
  | "gte" // '>=' (greater than or equal to)
  | "lt" // '<' (less than) less than
  | "lte" // '<=' (less than or equal to)
  | "like" // 'like' (case-sensitive)
  | "ilike" // 'like' (case-insensitive)
  | "is"; // 'is' (used for null checks)

type OrderDirection = "asc" | "desc";

export interface QueryOptions {
  filters?: { column: string; operator: FilterOperator; value: any }[];
  sort?: { column: string; direction: OrderDirection };
  limit?: number;
  offset?: number;
}

export async function fetchData<T>(
  table: string,
  options: QueryOptions = {}
): Promise<{ data: T[] | null; error: Error | null }> {
  const supabase = await createClient();
  let query: any = supabase.from(table).select("*");

  // Apply filters
  options.filters?.forEach((filter) => {
    query = query.filter(filter.column, filter.operator, filter.value);
  });

  // Apply sorting
  if (options.sort) {
    query = query.order(options.sort.column, {
      ascending: options.sort.direction === "asc",
    });
  }

  // Apply pagination
  if (options.limit) {
    query = query.limit(options.limit);
  }
  if (options.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 0) - 1
    );
  }

  const { data, error } = await query;

  return { data, error };
}

export async function insertData<T>(
  table: string,
  data: Partial<T>
): Promise<{ data: T | null; error: Error | null }> {
  const supabase = await createClient();
  const { data: insertedData, error } = await supabase
    .from(table)
    .insert(data)
    .single();

  return { data: insertedData, error };
}

export async function updateData<T>(
  table: string,
  id: number | string,
  data: Partial<T>
): Promise<{ data: T | null; error: Error | null }> {
  const supabase = await createClient();
  const { data: updatedData, error } = await supabase
    .from(table)
    .update(data)
    .eq("id", id)
    .single();

  return { data: updatedData, error };
}

export async function deleteData(
  table: string,
  id: number | string
): Promise<{ success: boolean; error: Error | null }> {
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);

  return { success: !error, error };
}
