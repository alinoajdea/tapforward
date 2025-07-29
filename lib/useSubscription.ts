import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useAuth } from "./AuthContext";

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<{ plan: string; status: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No user, no subscription
    if (!user) {
      setSubscription({ plan: "free", status: "active" });
      setLoading(false);
      return;
    }

    setLoading(true);

    // Use an async function inside useEffect
    const fetchSubscription = async () => {
      try {
        const { data } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();
        setSubscription(data || { plan: "free", status: "active" });
      } catch (e) {
        setSubscription({ plan: "free", status: "active" });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  return { subscription, loading };
}
