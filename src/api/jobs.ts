import { ApiResponse, SavedJobsResponse } from "./../types/relation.types";
import {
  JobQueryResponse,
  SingleJobQueryResponse,
} from "../types/relation.types";
import supabaseClient from "../utils/supabase";
import { Jobs, SavedJobs } from "../types/supabase.types";

export const fetchJobs = async (
  token: string | null | undefined,
  options?: { location?: string; company_id?: string; searchQuery?: string }
): Promise<ApiResponse<JobQueryResponse[]>> => {
  const supabase = await supabaseClient(token!);

  const { company_id, location, searchQuery } = options || {};

  let query = supabase
    .from("jobs")
    .select("*,saved: saved_jobs(id), company: companies(name,logo_url)");

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  const { data, error } = await query.returns<JobQueryResponse[]>();

  if (error) {
    console.log(error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
};

export const savedJobs = async (
  token: string | null | undefined,
  options?: { alreadySavedJob: boolean },
  saveJob?: Pick<SavedJobs, "job_id" | "user_id">
): Promise<ApiResponse<SavedJobs[] | string>> => {
  //
  //
  const supabase = await supabaseClient(token!);
  const { alreadySavedJob } = options || {};

  if (alreadySavedJob) {
    const { error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveJob!.job_id!);
    if (deleteError) {
      return { data: null, error: deleteError.message };
    }
    return { data: "deleted", error: null };
  } else {
    if (saveJob) {
      const { data, error: savedError } = await supabase
        .from("saved_jobs")
        .insert([saveJob])
        .select();

      if (savedError) {
        return { data: null, error: savedError.message };
      }
      if (typeof data === "object") {
        return { data, error: null };
      }
    }
  }
  return { data: null, error: "" };
};

export const getSingleJob = async (
  token: string | null | undefined,
  options?: { job_id: number }
): Promise<ApiResponse<SingleJobQueryResponse>> => {
  const supabase = await supabaseClient(token!);

  const { job_id } = options || {};

  const { data, error } = await supabase
    .from("jobs")
    .select("* , company: companies(name, logo_url) , applications(*)")
    .eq("id", job_id!)
    .returns<SingleJobQueryResponse>()
    .single();
  if (error) {
    console.log("err", error);
    return { data: null, error: error.message };
  }
  return { data: data, error: null };
};

export const updateJobHiringStatus = async (
  token: string | null | undefined,
  options?: { job_id: number },
  isOpen?: boolean
): Promise<ApiResponse<Jobs>> => {
  const supabase = await supabaseClient(token!);

  const { job_id } = options || {};

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id!)
    .select()
    .returns<Jobs>();

  if (error) {
    console.log("err", error);
    return { data: null, error: error.message };
  }
  return { data, error: null };
};

export async function addNewJob(
  token: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options = {},
  jobData?: Partial<Jobs>
): Promise<ApiResponse<Jobs>> {
  const supabase = await supabaseClient(token!);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData!])
    .select()
    .returns<Jobs>();

  if (error) {
    console.error(error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// get my created jobs
export async function getMyJobs(
  token: string | null | undefined,
  options?: { recruiter_id: string }
): Promise<ApiResponse<SingleJobQueryResponse[]>> {
  const supabase = await supabaseClient(token!);
  const { recruiter_id } = options || {};

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id!)
    .returns<SingleJobQueryResponse[]>();

  if (error) {
    console.error("Error fetching Jobs:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Delete job
export async function deleteJob(
  token: string | null | undefined,
  options?: { job_id: number }
): Promise<ApiResponse<Jobs>> {
  const supabase = await supabaseClient(token!);

  const { job_id } = options || {};

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id!)
    .select()
    .returns<Jobs>();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return { data: null, error: deleteError.message };
  }

  return { data: data, error: null };
}

// Read Saved Jobs
export async function getSavedJobs(
  token: string | undefined | null
): Promise<ApiResponse<SavedJobsResponse[]>> {
  const supabase = await supabaseClient(token!);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))")
    .returns<SavedJobsResponse[]>();

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
