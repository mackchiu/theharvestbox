import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[SYNC-CHECKOUT] ${step}${detailsStr}`);
};

type CheckoutItem = {
  productId: string;
  quantity: number;
  purchaseType: "subscription" | "one_time";
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Backend env is not configured");
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Invalid authentication" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const user = userData.user;
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { sessionId } = (await req.json().catch(() => ({}))) as { sessionId?: string };
    if (!sessionId) {
      return new Response(JSON.stringify({ error: "Missing sessionId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    const sessionUserId = session.metadata?.user_id || session.client_reference_id || null;
    if (!sessionUserId || sessionUserId !== user.id) {
      logStep("Session user mismatch", { sessionUserId, userId: user.id });
      return new Response(JSON.stringify({ error: "Session does not belong to current user" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    const itemsRaw = session.metadata?.items;
    if (!itemsRaw) {
      return new Response(JSON.stringify({ error: "No items found on session" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const items = JSON.parse(itemsRaw) as CheckoutItem[];

    const shippingDetails = session.shipping_details;
    const shippingAddress = shippingDetails
      ? {
          name: shippingDetails.name,
          address: shippingDetails.address,
        }
      : null;

    // Idempotency: if we already have an order for this session, return success
    const { data: existingOrder } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    let orderId: string | null = existingOrder?.id ?? null;

    if (!orderId) {
      const { data: createdOrder, error: createOrderError } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: user.id,
          stripe_session_id: session.id,
          stripe_payment_intent_id: (session.payment_intent as string) || null,
          status: "paid",
          purchase_type: session.mode === "subscription" ? "subscription" : "one_time",
          items,
          subtotal: (session.amount_subtotal || 0) / 100,
          total: (session.amount_total || 0) / 100,
          shipping_address: shippingAddress,
        })
        .select("id")
        .single();

      if (createOrderError) {
        logStep("Error creating order", { error: createOrderError });
        throw new Error(createOrderError.message);
      }

      orderId = createdOrder.id;
      logStep("Order created", { orderId });
    } else {
      logStep("Order already exists", { orderId });
    }

    if (session.customer) {
      const updateData: Record<string, unknown> = {
        stripe_customer_id: session.customer as string,
      };
      if (shippingAddress) updateData.shipping_address = shippingAddress;

      const { error: profileUpdateError } = await supabaseAdmin
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (profileUpdateError) {
        logStep("Error updating profile", { error: profileUpdateError });
      } else {
        logStep("Profile updated", { stripe_customer_id: session.customer });
      }
    }

    // Create subscription record if needed (idempotent)
    if (session.mode === "subscription" && session.subscription) {
      const stripeSubId = session.subscription as string;

      const { data: existingSub } = await supabaseAdmin
        .from("subscriptions")
        .select("id")
        .eq("stripe_subscription_id", stripeSubId)
        .maybeSingle();

      if (!existingSub) {
        const subscription = await stripe.subscriptions.retrieve(stripeSubId);

        // Insert one row per subscription product in the cart
        const subscriptionItems = items.filter((i) => i.purchaseType === "subscription");
        for (const item of subscriptionItems) {
          const { error: subError } = await supabaseAdmin.from("subscriptions").insert({
            user_id: user.id,
            stripe_subscription_id: subscription.id,
            product_id: item.productId,
            status: "active",
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          });

          if (subError) {
            logStep("Error creating subscription", { error: subError, productId: item.productId });
            throw new Error(subError.message);
          }
        }

        logStep("Subscription rows created", { stripe_subscription_id: stripeSubId });
      } else {
        logStep("Subscription already exists", { stripe_subscription_id: stripeSubId });
      }
    }

    return new Response(JSON.stringify({ ok: true, orderId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message });
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
