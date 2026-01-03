import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, User, Package, CreditCard, LogOut, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface Subscription {
  id: string;
  stripe_subscription_id: string;
  product_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  product?: {
    title: string;
    subscription_price: number;
  };
}

const AccountSubscription = () => {
  const { signOut } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select(`
            *,
            product:products(title, subscription_price)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setSubscriptions(data || []);
      } catch (error) {
        console.error("Error loading subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session');
      
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error("Error opening portal:", error);
      toast.error("Failed to open subscription management portal");
    } finally {
      setPortalLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-primary/10 text-primary';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
      case 'past_due': return 'bg-orange-100 text-orange-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="font-display text-4xl font-bold mb-8">My Account</h1>
          
          {/* Navigation */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link to="/account">
              <Button variant="outline" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </Button>
            </Link>
            <Link to="/account/orders">
              <Button variant="outline" className="gap-2">
                <Package className="w-4 h-4" />
                Orders
              </Button>
            </Link>
            <Link to="/account/subscription">
              <Button variant="hero" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Subscription
              </Button>
            </Link>
            <Button variant="ghost" className="gap-2 ml-auto" onClick={signOut}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Subscriptions */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold">My Subscriptions</h2>
              {subscriptions.some(s => s.status === 'active') && (
                <Button 
                  variant="outline" 
                  onClick={handleManageSubscription}
                  disabled={portalLoading}
                >
                  {portalLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4 mr-2" />
                  )}
                  Manage Subscription
                </Button>
              )}
            </div>
            
            {subscriptions.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No active subscriptions</p>
                <Link to="/">
                  <Button variant="hero" className="mt-4">
                    Subscribe Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="border border-border rounded-xl p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl font-semibold">
                          {sub.product?.title || 'Fruit Box Subscription'}
                        </h3>
                        <p className="text-2xl font-bold text-primary mt-1">
                          ${sub.product?.subscription_price?.toFixed(2) || '0.00'}/week
                        </p>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sub.status)}`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                    
                    {sub.status === 'active' && sub.current_period_end && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                          Next delivery: {format(new Date(sub.current_period_end), "MMMM d, yyyy")}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountSubscription;
