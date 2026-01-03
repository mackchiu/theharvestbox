import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Users, Package, ShoppingCart, TrendingUp, Save } from "lucide-react";
import { Product } from "@/lib/products";
import productBoxImage from "@/assets/product-box.png";

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("subscription_price", { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (product: Product) => {
    setSavingId(product.id);
    try {
      const { error } = await supabase
        .from("products")
        .update({ available: !product.available })
        .eq("id", product.id);

      if (error) throw error;
      toast.success(`${product.title} is now ${!product.available ? 'available' : 'unavailable'}`);
      loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setSavingId(null);
    }
  };

  const saveProduct = async () => {
    if (!editingProduct) return;
    
    setSavingId(editingProduct.id);
    try {
      const { error } = await supabase
        .from("products")
        .update({
          title: editingProduct.title,
          short_description: editingProduct.short_description,
          subscription_price: editingProduct.subscription_price,
          one_time_price: editingProduct.one_time_price,
        })
        .eq("id", editingProduct.id);

      if (error) throw error;
      toast.success("Product updated successfully");
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setSavingId(null);
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
              <Button variant="hero" className="gap-2">
                <Package className="w-4 h-4" />
                Products
              </Button>
            </Link>
          </div>

          {/* Products Grid */}
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <h2 className="font-display text-2xl font-semibold mb-6">Manage Products</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border border-border rounded-xl p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-secondary/30 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.image_url || productBoxImage}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      {editingProduct?.id === product.id ? (
                        <div className="space-y-3">
                          <Input
                            value={editingProduct.title}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct,
                              title: e.target.value
                            })}
                          />
                          <Input
                            value={editingProduct.short_description || ''}
                            onChange={(e) => setEditingProduct({
                              ...editingProduct,
                              short_description: e.target.value
                            })}
                            placeholder="Short description"
                          />
                          <div className="flex gap-2">
                            <div>
                              <Label className="text-xs">Subscription</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={editingProduct.subscription_price}
                                onChange={(e) => setEditingProduct({
                                  ...editingProduct,
                                  subscription_price: parseFloat(e.target.value) || 0
                                })}
                              />
                            </div>
                            <div>
                              <Label className="text-xs">One-time</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={editingProduct.one_time_price}
                                onChange={(e) => setEditingProduct({
                                  ...editingProduct,
                                  one_time_price: parseFloat(e.target.value) || 0
                                })}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={saveProduct}
                              disabled={savingId === product.id}
                            >
                              {savingId === product.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Save className="w-4 h-4" />
                              )}
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingProduct(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-display text-xl font-semibold">{product.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {product.short_description}
                          </p>
                          <div className="flex gap-4 mt-2">
                            <span className="text-sm">
                              <span className="font-semibold text-primary">${product.subscription_price.toFixed(2)}</span>
                              <span className="text-muted-foreground">/week</span>
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ${product.one_time_price.toFixed(2)} one-time
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={product.available}
                                onCheckedChange={() => toggleAvailability(product)}
                                disabled={savingId === product.id}
                              />
                              <span className="text-sm">
                                {product.available ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingProduct(product)}
                            >
                              Edit
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminProducts;
