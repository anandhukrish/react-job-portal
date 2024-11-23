import { Application, Companies, Jobs, SavedJobs } from "./supabase.types";

export type JobQueryResponse = Jobs & {
  saved: Pick<SavedJobs, "id">[];
  company: Pick<Companies, "name" | "logo_url">;
};

export type SingleJobQueryResponse = Jobs & {
  saved: Pick<SavedJobs, "id">[];
  company: Pick<Companies, "name" | "logo_url">;
  applications: Application[];
};

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };
