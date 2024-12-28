import { useState, useEffect, useCallback } from "react";
import {
  fetchData,
  insertData,
  updateData,
  deleteData,
  QueryOptions,
} from "@/lib/supabase/service";

export function useSupabase<T>(
  table: string,
  initialOptions: QueryOptions = {}
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [options, setOptions] = useState<QueryOptions>(initialOptions);

  const fetchDataFromSupabase = useCallback(async () => {
    setLoading(true);
    const { data: fetchedData, error: fetchError } = await fetchData<T>(
      table,
      options
    );
    if (fetchError) {
      setError(fetchError);
    } else {
      setData(fetchedData);
      setError(null);
    }
    setLoading(false);
  }, [table, options]);

  useEffect(() => {
    fetchDataFromSupabase();
  }, [fetchDataFromSupabase]);

  const insert = async (newData: Partial<T>) => {
    const { data: insertedData, error: insertError } = await insertData<T>(
      table,
      newData
    );
    if (insertError) {
      setError(insertError);
    } else if (insertedData) {
      setData((prevData) =>
        prevData ? [...prevData, insertedData] : [insertedData]
      );
    }
    return { data: insertedData, error: insertError };
  };

  const update = async (id: number | string, updatedData: Partial<T>) => {
    const { data: updatedItem, error: updateError } = await updateData<T>(
      table,
      id,
      updatedData
    );
    if (updateError) {
      setError(updateError);
    } else if (updatedItem) {
      setData((prevData) =>
        prevData
          ? prevData.map((item) =>
              (item as any).id === id ? updatedItem : item
            )
          : [updatedItem]
      );
    }
    return { data: updatedItem, error: updateError };
  };

  const remove = async (id: number | string) => {
    const { success, error: deleteError } = await deleteData(table, id);
    if (deleteError) {
      setError(deleteError);
    } else if (success) {
      setData((prevData) =>
        prevData ? prevData.filter((item) => (item as any).id !== id) : null
      );
    }
    return { success, error: deleteError };
  };

  const setQueryOptions = (newOptions: QueryOptions) => {
    setOptions((prevOptions) => ({ ...prevOptions, ...newOptions }));
  };

  return {
    data,
    loading,
    error,
    insert,
    update,
    remove,
    setQueryOptions,
    refetch: fetchDataFromSupabase,
  };
}
