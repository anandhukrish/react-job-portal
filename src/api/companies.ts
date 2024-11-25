import { CompanySchema } from "../components/add-company-drawer";
import { ApiResponse } from "../types/relation.types";
import { Companies } from "../types/supabase.types";
import supabaseClient, { supabaseUrl } from "../utils/supabase";

// Fetch Companies
export async function getCompanies(
  token: string | null | undefined,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options = {}
): Promise<ApiResponse<Companies[]>> {
  const supabase = await supabaseClient(token!);
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .returns<Companies[]>();

  if (error) {
    console.error("Error fetching Companies:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Add Company
export async function addNewCompany(
  token: string | undefined | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options = {},
  companyData?: CompanySchema
): Promise<ApiResponse<Companies>> {
  const supabase = await supabaseClient(token!);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData?.name}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData?.logo);

  if (storageError)
    return { data: null, error: "Error uploading Company Logo" };

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData?.name,
        logo_url: logo_url,
      },
    ])
    .select()
    .returns<Companies>();

  if (error) {
    console.error(error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
