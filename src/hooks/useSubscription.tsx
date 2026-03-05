import { useState, useEffect, useCallback } from "react";
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

  // FIX #6: Extrair fetch em função reutilizável para poder chamar manualmente (polling)
  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

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
  }, [user]);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSubscription(null);
    fetchSubscription();
  }, [user, fetchSubscription]);

  const isActive =
    !!subscription &&
    subscription.status === "active" &&
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

  // Expor refetch para uso externo (ex: polling no PaymentPage)
  const refetch = useCallback(async () => {
    await fetchSubscription();
  }, [fetchSubscription]);

  return { subscription, loading, isActive, createCheckout, refetch };
}
