import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { CheckCircle, Loader2 } from "lucide-react";

const CheckoutSuccess = () => {
  const [params] = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const [syncing, setSyncing] = useState(true);

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setSyncing(false);
      return;
    }

    const sync = async () => {
      setSyncing(true);
      const { data, error } = await supabase.functions.invoke("sync-checkout", {
        body: { sessionId },
      });

      if (error) {
        console.error("sync-checkout failed:", error);
        toast.error("We couldn't sync your order yet. Please refresh in a moment.");
      } else {
        clearCart();
        toast.success("Order synced to your account!");
        console.log("sync-checkout ok:", data);
      }

      setSyncing(false);
    };

    sync();
  }, [params, clearCart]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md text-center">
          <div className="bg-card rounded-2xl p-8 shadow-card">
            {syncing ? (
              <Loader2 className="w-12 h-12 text-primary mx-auto mb-6 animate-spin" />
            ) : (
              <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            )}

            <h1 className="font-display text-3xl font-bold mb-4">Thank You!</h1>
            <p className="text-muted-foreground mb-8">
              {syncing
                ? "Finalizing your order in your account…"
                : "Your order has been confirmed. We'll send you an email with your order details soon."}
            </p>

            <div className="space-y-3">
              <Link to="/account/orders">
                <Button variant="hero" className="w-full" disabled={syncing}>
                  View My Orders
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;

