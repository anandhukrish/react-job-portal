import { useSession } from "@clerk/clerk-react";
import { useState } from "react";
import { ApiResponse } from "../types/relation.types";

type FetchCallback<
  TData,
  TOptions = undefined,
  Targs extends unknown[] = []
> = TOptions extends undefined
  ? (
      token: string | null | undefined,
      ...args: Targs
    ) => Promise<ApiResponse<TData>>
  : (
      token: string | null | undefined,
      options?: TOptions,
      ...args: Targs
    ) => Promise<ApiResponse<TData>>;

interface UseFetchResult<TData, TArgs extends unknown[] = []> {
  data: TData | null;
  isLoading: boolean;
  error: string | null;
  fn: (...args: TArgs) => Promise<void>;
}

export const useFetch = <
  TData,
  TOptions = undefined,
  Targs extends unknown[] = []
>(
  cb: FetchCallback<TData, TOptions, Targs>,
  options?: TOptions
): UseFetchResult<TData, Targs> => {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>("");

  const { session } = useSession();

  const fn = async (...args: Targs) => {
    setIsLoading(true);
    setError("");

    try {
      const token = await session?.getToken({ template: "supabase" });

      const response = await cb(token, options, ...args);

      if (response.error) {
        setError(response.error);
        setData(null);
      } else {
        setData(response.data);
        setError(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return { fn, data, isLoading, error };
};
