import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { fetchProductBySlug, Product } from "@/lib/products";
import { useCartStore } from "@/stores/cartStore";
import { ArrowLeft, Minus, Plus, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import productBoxImage from "@/assets/product-box.png";

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState<"subscription" | "one_time">("subscription");
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      try {
        const data = await fetchProductBySlug(handle);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem(product, quantity, purchaseType);

    toast.success("Added to cart!", {
      description: `${quantity}x ${product.title}`,
      position: "top-center",
    });
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

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-32 container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link to="/">Go Back Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const displayPrice = purchaseType === "subscription" 
    ? product.subscription_price 
    : product.one_time_price;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all boxes
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="aspect-square rounded-3xl overflow-hidden bg-secondary/30">
              <img
                src={product.image_url || productBoxImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="lg:py-8">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                {product.title}
              </h1>

              {product.serves && (
                <p className="text-muted-foreground mb-4">
                  Perfect for {product.serves}
                </p>
              )}

              {/* Purchase Type Toggle */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  Purchase Type
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPurchaseType("subscription")}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                      purchaseType === "subscription"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold">Subscribe & Save</div>
                    <div className="text-sm text-muted-foreground">Best value • Weekly delivery</div>
                  </button>
                  <button
                    onClick={() => setPurchaseType("one_time")}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                      purchaseType === "one_time"
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="font-semibold">One-Time Purchase</div>
                    <div className="text-sm text-muted-foreground">No commitment</div>
                  </button>
                </div>
              </div>

              {/* Price Display */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">
                    ${displayPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-muted-foreground">/box</span>
                  {purchaseType === "subscription" && (
                    <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                      Save ${(product.one_time_price - product.subscription_price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="text-muted-foreground text-lg mb-8 space-y-4">
                {(() => {
                  const desc = product.description || "Fresh, seasonal fruits picked at peak ripeness and delivered straight to your door.";
                  const parts = desc.split(/\*\*([^*]+)\*\*/g);
                  
                  if (parts.length <= 1) {
                    return <p>{desc}</p>;
                  }
                  
                  const elements: React.ReactNode[] = [];
                  
                  for (let i = 1; i < parts.length; i += 2) {
                    const label = parts[i]?.trim();
                    const content = parts[i + 1]?.trim();
                    
                    if (label && content) {
                      elements.push(
                        <div key={label} className="mb-4">
                          <h3 className="font-semibold text-foreground mb-1">{label}</h3>
                          <p className="whitespace-pre-line">{content}</p>
                        </div>
                      );
                    }
                  }
                  
                  return elements;
                })()}
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-2 w-fit">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={handleAddToCart}
                disabled={!product.available}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>

              {!product.available && (
                <p className="text-destructive text-sm mt-3 text-center">
                  This product is currently out of stock
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
