import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Pings Supabase every 5 minutes to keep the project active
 * and prevent it from pausing due to inactivity.
 */
export function useSupabaseKeepAlive() {
  useEffect(() => {
    const ping = async () => {
      try {
        await supabase.from("announcements").select("id").limit(1);
      } catch {
        // Silent fail — this is just a keep-alive
      }
    };

    // Ping immediately on mount
    ping();

    // Then every 5 minutes
    const interval = setInterval(ping, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
}
