import { ApiResponse } from "./../types/relation.types";
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
  token: string,
  { job_id }: { job_id: number },
  isOpen: boolean
) => {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.log("err", error);
    return data;
  }
  return data;
};

export async function addNewJob(
  token: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options = {},
  jobData: Partial<Jobs>
) {
  const supabase = await supabaseClient(token!);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Job");
  }

  return data;
}

// get my created jobs
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}

// Read Saved Jobs
export async function getSavedJobs(token: string | undefined | null) {
  const supabase = await supabaseClient(token!);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}
