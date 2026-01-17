import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

let supabaseServerInstance: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseServer() {
  if (!supabaseServerInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    supabaseServerInstance = createClient<Database>(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          persistSession: false,
        },
      }
    );
  }

  return supabaseServerInstance;
}
