import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, Loader2, Crown, RefreshCw } from "lucide-react";

const PLANS = [
  {
    id: "mensal",
    name: "Mensal",
    price: 1990, // R$ 19,90 em centavos
    label: "R$ 19,90/mês",
    features: ["Geração ilimitada de jogos", "Conferência automática", "Modelos de estratégia", "Suporte prioritário"],
  },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isActive, subscription, createCheckout, loading, refetch } = useSubscription();
  const [processing, setProcessing] = useState(false);
  // FIX #6: Polling para detectar pagamento confirmado após voltar da aba do PIX
  const [waitingPayment, setWaitingPayment] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Inicia polling ao abrir checkout
  const startPolling = () => {
    setWaitingPayment(true);
    setPollCount(0);

    pollIntervalRef.current = setInterval(async () => {
      setPollCount((prev) => {
        const next = prev + 1;
        // Parar após ~5 minutos (60 tentativas x 5s)
        if (next >= 60) {
          stopPolling();
        }
        return next;
      });
      await refetch();
    }, 5000); // verifica a cada 5 segundos
  };

  const stopPolling = () => {
    setWaitingPayment(false);
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  // Quando assinatura ficar ativa durante o polling, redirecionar
  useEffect(() => {
    if (isActive && waitingPayment) {
      stopPolling();
      toast({ title: "Pagamento confirmado! 🎉", description: "Sua assinatura está ativa." });
      navigate("/app", { replace: true });
    }
  }, [isActive, waitingPayment, navigate]);

  // Limpar intervalo ao desmontar componente
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleCheckout = async (plan: (typeof PLANS)[0]) => {
    if (!user) return;
    setProcessing(true);
    try {
      await createCheckout(plan.price, plan.id);
      toast({
        title: "Checkout aberto!",
        description: "Complete o pagamento PIX na nova aba. Aguardaremos a confirmação automaticamente.",
      });
      startPolling();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro", description: "Não foi possível criar o checkout.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <Crown className="w-12 h-12 text-primary mx-auto" />
          <h2 className="font-heading text-2xl font-bold text-foreground">Plano Ativo!</h2>
          <p className="text-muted-foreground">
            Seu plano <span className="text-primary font-semibold">{subscription?.plan}</span> está ativo
            {subscription?.expires_at && (
              <> até <span className="font-semibold">{new Date(subscription.expires_at).toLocaleDateString("pt-BR")}</span></>
            )}.
          </p>
          <a
            href="/app"
            className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            Ir para o App
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-black text-primary">Assine Agora</h1>
          <p className="text-muted-foreground mt-2">Desbloqueie todas as funcionalidades</p>
        </div>

        {/* FIX #6: Banner de aguardo de confirmação de pagamento */}
        {waitingPayment && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary">Aguardando confirmação do PIX...</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Assim que o pagamento for confirmado, você será redirecionado automaticamente.
              </p>
            </div>
          </div>
        )}

        {PLANS.map((plan) => (
          <div key={plan.id} className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-xl font-bold text-foreground">{plan.name}</h3>
              <span className="text-primary font-bold text-lg">{plan.label}</span>
            </div>
            <ul className="space-y-2">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan)}
              disabled={processing || waitingPayment}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {processing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              {processing ? "Processando..." : waitingPayment ? "Aguardando pagamento..." : "Pagar com PIX"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
