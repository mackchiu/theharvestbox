import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Users, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface Order {
  id: string;
  status: string;
  purchase_type: string;
  total: number;
  created_at: string;
  user_id: string;
  profile?: {
    email: string;
    full_name: string;
  };
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profile:profiles(email, full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: "pending" | "paid" | "fulfilled" | "cancelled") => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Order status updated");
      loadOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-primary/10 text-primary';
      case 'fulfilled': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-destructive/10 text-destructive';
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
              <Button variant="hero" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Orders
              </Button>
            </Link>
            <Link to="/admin/customers">
              <Button variant="outline" className="gap-2">
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

          {/* Orders Table */}
          <div className="bg-card rounded-2xl p-8 shadow-card overflow-x-auto">
            <h2 className="font-display text-2xl font-semibold mb-6">All Orders</h2>
            
            {orders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Customer</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4">Total</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border/50">
                      <td className="py-3 px-4 font-mono text-sm">
                        {order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{order.profile?.full_name || 'Guest'}</p>
                          <p className="text-sm text-muted-foreground">{order.profile?.email || '-'}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {format(new Date(order.created_at), "MMM d, yyyy")}
                      </td>
                      <td className="py-3 px-4 text-sm capitalize">
                        {order.purchase_type.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {order.status === 'paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderStatus(order.id, 'fulfilled')}
                          >
                            Mark Fulfilled
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
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

export default AdminOrders;
