import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Package, CreditCard, ShoppingCart, TrendingUp } from "lucide-react";

interface DashboardStats {
  totalCustomers: number;
  activeSubscriptions: number;
  totalOrders: number;
  revenue: number;
}

const Admin = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeSubscriptions: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get total customers
        const { count: customerCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        // Get active subscriptions
        const { count: subCount } = await supabase
          .from("subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");

        // Get total orders and revenue
        const { data: orders } = await supabase
          .from("orders")
          .select("total, status");

        const totalOrders = orders?.length || 0;
        const revenue = orders
          ?.filter(o => o.status === 'paid' || o.status === 'fulfilled')
          .reduce((sum, o) => sum + (o.total || 0), 0) || 0;

        setStats({
          totalCustomers: customerCount || 0,
          activeSubscriptions: subCount || 0,
          totalOrders,
          revenue,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
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
              <Button variant="hero" className="gap-2">
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-3xl font-bold">{stats.totalCustomers}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Subscriptions</p>
                  <p className="text-3xl font-bold">{stats.activeSubscriptions}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-3xl font-bold">${stats.revenue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <h2 className="font-display text-2xl font-semibold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/orders">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  <span>Manage Orders</span>
                </Button>
              </Link>
              <Link to="/admin/customers">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Users className="w-6 h-6" />
                  <span>View Customers</span>
                </Button>
              </Link>
              <Link to="/admin/products">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Package className="w-6 h-6" />
                  <span>Edit Products</span>
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

export default Admin;
