import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

interface CartItem {
  productId: string;
  title: string;
  quantity: number;
  purchaseType: "subscription" | "one_time";
  priceId: string;
  price: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const { items } = await req.json() as { items: CartItem[] };
    if (!items || items.length === 0) throw new Error("No items provided");
    logStep("Items received", { count: items.length });

    // Require authentication - no guest checkout
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authentication required. Please log in to checkout.");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError || !data.user) {
      throw new Error("Invalid authentication. Please log in again.");
    }
    
    const user = data.user;
    const userEmail = user.email;
    logStep("User authenticated", { userId: user.id, email: userEmail });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if user has existing Stripe customer
    let customerId: string | undefined;
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        logStep("Found existing customer", { customerId });
      }
    }

    // Determine mode based on items
    const hasSubscription = items.some(item => item.purchaseType === "subscription");
    const mode = hasSubscription ? "subscription" : "payment";
    logStep("Checkout mode", { mode });

    // Build line items
    const lineItems = items.map(item => ({
      price: item.priceId,
      quantity: item.quantity,
    }));

    // Create checkout session
    const origin = req.headers.get("origin") || "";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail || undefined,
      client_reference_id: user.id,
      line_items: lineItems,
      mode,
      success_url: `${origin}/#/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#/`,
      // Collect shipping address (Canada only)
      shipping_address_collection: {
        allowed_countries: ["CA"],
      },
      metadata: {
        user_id: user.id,
        items: JSON.stringify(
          items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            purchaseType: i.purchaseType,
          }))
        ),
      },
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
