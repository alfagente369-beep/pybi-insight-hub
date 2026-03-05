import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// FIX #4: Verificação de assinatura HMAC do webhook AbacatePay
async function verifyWebhookSignature(
  secret: string,
  rawBody: string,
  signature: string | null
): Promise<boolean> {
  if (!signature) return false;
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(rawBody);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageData);
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return expectedSignature === signature;
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const webhookSecret = Deno.env.get("ABACATEPAY_WEBHOOK_SECRET");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Ler body como texto para validar assinatura
    const rawBody = await req.text();

    // FIX #4: Validar assinatura do webhook (se secret estiver configurado)
    if (webhookSecret) {
      const signature = req.headers.get("x-abacatepay-signature");
      const isValid = await verifyWebhookSignature(webhookSecret, rawBody, signature);
      if (!isValid) {
        console.warn("Webhook com assinatura inválida — rejeitado.");
        return new Response(JSON.stringify({ error: "Assinatura inválida" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const body = JSON.parse(rawBody);
    console.log("Webhook received:", JSON.stringify(body));

    // AbacatePay webhook payload
    const { event, billing } = body?.data || body;

    if (!billing?.id) {
      console.log("No billing ID in webhook payload");
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const billingId = billing.id;
    const status = billing.status || event;
    const isPaid = status === "PAID" || status === "billing.paid";

    // FIX #5: Usar maybeSingle() para não lançar erro se registro não existir
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .update({ status: isPaid ? "PAID" : status })
      .eq("billing_id", billingId)
      .select()
      .maybeSingle();

    if (paymentError) {
      console.error("Error updating payment:", paymentError);
    }

    // Se pago, ativar assinatura
    if (isPaid) {
      if (payment) {
        const planName = (payment.metadata as any)?.plan || "premium";
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

        const { error: subError } = await supabase
          .from("subscriptions")
          .upsert(
            {
              user_id: payment.user_id,
              plan: planName,
              status: "active",
              payment_id: payment.id,
              expires_at: expiresAt.toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        if (subError) {
          console.error("Error upserting subscription:", subError);
        } else {
          console.log(`Subscription activated for user ${payment.user_id}`);
        }
      } else {
        // FIX #5: Pagamento não encontrado — logar para investigação
        console.warn(`Payment not found for billing_id: ${billingId}. Webhook ignored.`);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
