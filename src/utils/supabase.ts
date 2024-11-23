import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase.types";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = async (jwtToken: string) => {
  const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    },
  });
  return supabase;
};

export default supabaseClient;
