import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ABACATEPAY_API_URL = "https://api.abacatepay.com/v1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ABACATEPAY_API_KEY = Deno.env.get("ABACATEPAY_API_KEY");
    if (!ABACATEPAY_API_KEY) {
      throw new Error("ABACATEPAY_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get user from auth header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await anonClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Usuário não encontrado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { amount, planName, returnUrl, completionUrl } = await req.json();

    // 1. Create customer on AbacatePay
    const customerRes = await fetch(`${ABACATEPAY_API_URL}/customers/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ABACATEPAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.email?.split("@")[0] || "Cliente",
        email: user.email,
        cellphone: "",
        taxId: "",
      }),
    });

    const customerData = await customerRes.json();
    if (!customerRes.ok) {
      console.error("AbacatePay customer error:", customerData);
      throw new Error(`Erro ao criar cliente: ${JSON.stringify(customerData)}`);
    }

    const customerId = customerData.data?.id;

    // 2. Create billing on AbacatePay
    const billingRes = await fetch(`${ABACATEPAY_API_URL}/billing/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ABACATEPAY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        frequency: "ONE_TIME",
        methods: ["PIX"],
        products: [
          {
            externalId: `plan_${planName}_${user.id}`,
            name: `Plano ${planName}`,
            description: `Assinatura do plano ${planName}`,
            quantity: 1,
            price: amount, // in cents
          },
        ],
        returnUrl: returnUrl || `${req.headers.get("origin")}/app`,
        completionUrl: completionUrl || `${req.headers.get("origin")}/app`,
        customerId: customerId,
      }),
    });

    const billingData = await billingRes.json();
    if (!billingRes.ok) {
      console.error("AbacatePay billing error:", billingData);
      throw new Error(`Erro ao criar cobrança: ${JSON.stringify(billingData)}`);
    }

    const billingId = billingData.data?.id;
    const checkoutUrl = billingData.data?.url;

    // 3. Save payment record in DB
    await supabaseClient.from("payments").insert({
      user_id: user.id,
      billing_id: billingId,
      customer_id: customerId,
      amount: amount,
      status: "PENDING",
      payment_method: "PIX",
      metadata: { plan: planName },
    });

    return new Response(
      JSON.stringify({
        success: true,
        billingId,
        checkoutUrl,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating billing:", error);
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
