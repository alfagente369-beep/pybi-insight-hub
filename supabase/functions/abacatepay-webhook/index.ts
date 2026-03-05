import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
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

    // Update payment status
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .update({ status: status === "PAID" || status === "billing.paid" ? "PAID" : status })
      .eq("billing_id", billingId)
      .select()
      .single();

    if (paymentError) {
      console.error("Error updating payment:", paymentError);
    }

    // If paid, activate subscription
    if (status === "PAID" || status === "billing.paid") {
      if (payment) {
        const planName = (payment.metadata as any)?.plan || "premium";
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

        // Upsert subscription
        const { error: subError } = await supabase
          .from("subscriptions")
          .upsert(
            {
              user_id: payment.user_id,
              plan: planName,
              status: "active",
              payment_id: payment.id,
              expires_at: expiresAt.toISOString(),
            },
            { onConflict: "user_id" }
          );

        if (subError) {
          console.error("Error upserting subscription:", subError);
        } else {
          console.log(`Subscription activated for user ${payment.user_id}`);
        }
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
