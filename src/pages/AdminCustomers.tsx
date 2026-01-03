import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface Customer {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  subscriptions: Array<{ status: string }>;
  orders: Array<{ id: string }>;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            *,
            subscriptions(status),
            orders(id)
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCustomers(data || []);
      } catch (error) {
        console.error("Error loading customers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

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
        <div className="container mx-auto px-4">
          <h1 className="font-display text-4xl font-bold mb-8">Admin Dashboard</h1>
          
          {/* Navigation */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link to="/admin">
              <Button variant="outline" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                Overview
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="outline" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Orders
              </Button>
            </Link>
            <Link to="/admin/customers">
              <Button variant="hero" className="gap-2">
                <Users className="w-4 h-4" />
                Customers
              </Button>
            </Link>
            <Link to="/admin/products">
              <Button variant="outline" className="gap-2">
                <Package className="w-4 h-4" />
                Products
              </Button>
            </Link>
          </div>

          {/* Customers Table */}
          <div className="bg-card rounded-2xl p-8 shadow-card overflow-x-auto">
            <h2 className="font-display text-2xl font-semibold mb-6">All Customers</h2>
            
            {customers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No customers yet</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Orders</th>
                    <th className="text-left py-3 px-4">Subscription</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => {
                    const hasActiveSubscription = customer.subscriptions?.some(
                      (s) => s.status === 'active'
                    );
                    
                    return (
                      <tr key={customer.id} className="border-b border-border/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{customer.full_name || 'No name'}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {format(new Date(customer.created_at), "MMM d, yyyy")}
                        </td>
                        <td className="py-3 px-4">
                          {customer.orders?.length || 0} orders
                        </td>
                        <td className="py-3 px-4">
                          {hasActiveSubscription ? (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                              No subscription
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminCustomers;
