import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Subscription {
  id: string;
  plan: string;
  status: string;
  expires_at: string | null;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSubscription(null);

    const fetchSubscription = async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Erro ao carregar assinatura:", error.message);
        setSubscription(null);
        setLoading(false);
        return;
      }

      setSubscription(data ?? null);
      setLoading(false);
    };

    fetchSubscription();
  }, [user]);

  const isActive = !!subscription && subscription.status === "active" &&
    (!subscription.expires_at || new Date(subscription.expires_at) > new Date());

  const createCheckout = async (amount: number, planName: string) => {
    const { data, error } = await supabase.functions.invoke("create-billing", {
      body: { amount, planName },
    });

    if (error) throw error;
    if (data?.checkoutUrl) {
      window.open(data.checkoutUrl, "_blank");
    }
    return data;
  };

  return { subscription, loading, isActive, createCheckout };
}
