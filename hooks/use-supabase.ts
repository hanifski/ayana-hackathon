"use client";

import { useState, useCallback } from "react";
import {
  fetchData,
  insertData,
  updateData,
  deleteData,
  QueryOptions,
  UpdateOptions,
  DeleteOptions,
} from "@/lib/supabase/service";


export function useSupabase<T>(table: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getList = useCallback(
    async (options: QueryOptions = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchData<T>(table, options);
        setLoading(false);
        return data;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        setLoading(false);
        return null;
      }
    },
    [table]
  );

  const insert = useCallback(
    async (newData: Partial<T>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await insertData<T>(table, newData);
        if (result.error) {
          setError(result.error);
          return { data: null, error: result.error };
        }
        return { data: result.data, error: null };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("An unknown error occurred");
        setError(error);
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  const update = useCallback(
    async (data: Partial<T>, options: UpdateOptions) => {
      setLoading(true);
      setError(null);
      try {
        const result = await updateData<T>(table, data, options);
        if (result.error) {
          setError(result.error);
          return { data: null, error: result.error };
        }
        return { data: result.data, error: null };
      } catch (err) {
        const error = err instanceof Error ? err : new Error("An unknown error occurred");
        setError(error);
        return { data: null, error };
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  const remove = useCallback(
    async (options: DeleteOptions) => {
      setLoading(true);
      setError(null);
      try {
        await deleteData(table, options);
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        setLoading(false);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  return {
    getList,
    insert,
    update,
    remove,
    loading,
    error,
  };
}
