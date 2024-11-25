import supabaseClient, { supabaseUrl } from "../utils/supabase";
import { Application, StatusEnum } from "../types/supabase.types";
import { ApiResponse, ApplicationResponse } from "../types/relation.types";
type FileBody = File | Blob | Buffer;

export interface ApplyJob
  extends Omit<Application, "resume" | "id" | "created_at"> {
  resume: FileBody;
}

export async function applyToJob(
  token: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options = {},
  jobData?: Partial<ApplyJob>
) {
  const supabase = await supabaseClient(token!);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData!.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData!.resume!);

  if (storageError) return { data: null, error: "error in storage" };

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select()
    .returns<Application>();

  if (error) {
    console.error(error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateApplicationStatus(
  token: string | null | undefined,
  options?: { job_id: number },
  status?: StatusEnum
): Promise<ApiResponse<Application>> {
  //
  //

  const supabase = await supabaseClient(token!);
  const { job_id } = options! || {};

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("job", job_id)
    .select()
    .returns<Application>();

  if (error) {
    console.error("Error Updating Application Status:", error);
    return { data: null, error: error?.message };
  }

  return { data, error: null };
}

export async function getApplications(
  token: string | null | undefined,
  options?: { user_id: string }
): Promise<ApiResponse<ApplicationResponse[]>> {
  const supabase = await supabaseClient(token!);

  const { user_id } = options || {};

  const { data, error } = await supabase
    .from("applications")
    .select("*, job_details:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id!)
    .returns<ApplicationResponse[]>();

  if (error) {
    console.error("Error fetching Applications:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
