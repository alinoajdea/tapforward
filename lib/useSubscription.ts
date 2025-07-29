import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<{ plan: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return setLoading(false);
    setLoading(true);
    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle()
      .then(({ data }) => setSubscription(data || { plan: "free", status: "active" }))
      .finally(() => setLoading(false));
  }, [user]);

  return { subscription, loading };
}
