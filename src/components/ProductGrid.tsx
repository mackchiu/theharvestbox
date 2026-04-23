import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { fetchProducts, Product } from "@/lib/products";
import { Loader2, Package } from "lucide-react";

export const ProductGrid = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <section id="boxes" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="boxes" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Box
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pick Small or Family. Each week follows a best-available seasonal mix, with staple fruit included to keep the house stocked.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-secondary/30 rounded-3xl">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
              Boxes coming soon
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We&apos;re getting this week&apos;s box setup ready. Check back soon for Small and Family box details.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
