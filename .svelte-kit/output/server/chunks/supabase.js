import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://jifmfseygebetlbhjifm.backend.onspace.ai";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIwODI1MzcwMDUsImlhdCI6MTc2NzE3NzAwNSwiaXNzIjoib25zcGFjZSIsInJlZiI6ImppZm1mc2V5Z2ViZXRsYmhqaWZtIiwicm9sZSI6ImFub24ifQ.ady6qHlrFMFCoDPkY2P7zpCMk-1YR4BcgSyzEoXnNCo";
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: "pkce",
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
export {
  supabase as s
};
