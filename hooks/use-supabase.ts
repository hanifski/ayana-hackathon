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
import { toast } from "sonner";

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
        const data = await insertData<T>(table, newData);
        return { data, error: false };
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        return { data: null, error: true, message: err };
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
        const updatedData = await updateData<T>(table, data, options);
        return updatedData;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
        setLoading(false);
        return null;
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
