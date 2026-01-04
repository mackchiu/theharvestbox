import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    // For now, we'll process without signature verification
    // In production, you should set up STRIPE_WEBHOOK_SECRET
    const event = JSON.parse(body) as Stripe.Event;
    logStep("Event received", { type: event.type });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Checkout session completed", { sessionId: session.id, mode: session.mode });

        const userId = session.metadata?.user_id;
        const itemsData = session.metadata?.items;
        
        // Extract shipping address from session
        const shippingDetails = session.shipping_details;
        const shippingAddress = shippingDetails ? {
          name: shippingDetails.name,
          address: shippingDetails.address,
        } : null;

        logStep("Session details", { userId, hasItems: !!itemsData, hasShipping: !!shippingAddress });

        if (itemsData) {
          const items = JSON.parse(itemsData);
          
          // Create order (works for both guest and authenticated users)
          const { data: order, error: orderError } = await supabaseAdmin
            .from("orders")
            .insert({
              user_id: userId || null,
              stripe_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string || null,
              status: "paid",
              purchase_type: session.mode === "subscription" ? "subscription" : "one_time",
              items: items,
              subtotal: (session.amount_subtotal || 0) / 100,
              total: (session.amount_total || 0) / 100,
              shipping_address: shippingAddress,
            })
            .select()
            .single();

          if (orderError) {
            logStep("Error creating order", { error: orderError });
          } else {
            logStep("Order created", { orderId: order.id });
          }

          // If subscription and user is logged in, create subscription record
          if (session.mode === "subscription" && session.subscription && userId) {
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            
            for (const item of items) {
              if (item.purchaseType === "subscription") {
                const { error: subError } = await supabaseAdmin
                  .from("subscriptions")
                  .insert({
                    user_id: userId,
                    stripe_subscription_id: subscription.id,
                    product_id: item.productId,
                    status: "active",
                    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
                    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
                  });
                
                if (subError) {
                  logStep("Error creating subscription", { error: subError });
                } else {
                  logStep("Subscription record created", { productId: item.productId });
                }
              }
            }
          }

          // Update profile with Stripe customer ID and shipping address
          if (userId && session.customer) {
            const updateData: Record<string, unknown> = { 
              stripe_customer_id: session.customer as string 
            };
            
            if (shippingAddress) {
              updateData.shipping_address = shippingAddress;
            }
            
            await supabaseAdmin
              .from("profiles")
              .update(updateData)
              .eq("id", userId);
              
            logStep("Profile updated with customer ID and shipping");
          }
        } else {
          logStep("No items in metadata, skipping order creation");
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription updated", { subscriptionId: subscription.id });

        const status = subscription.status === "active" ? "active" 
          : subscription.status === "past_due" ? "past_due"
          : subscription.status === "canceled" ? "cancelled"
          : "paused";

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        logStep("Subscription record updated");
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Subscription deleted", { subscriptionId: subscription.id });

        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("stripe_subscription_id", subscription.id);

        logStep("Subscription marked as cancelled");
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
