import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ArrowLeft, Minus, Plus, Loader2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import productBoxImage from "@/assets/product-box.png";

interface ProductData {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        availableForSale: boolean;
        selectedOptions: Array<{
          name: string;
          value: string;
        }>;
      };
    }>;
  };
  options: Array<{
    name: string;
    values: string[];
  }>;
}

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [purchaseType, setPurchaseType] = useState<"subscription" | "one-time">("subscription");
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      try {
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        if (data?.variants?.edges?.[0]) {
          setSelectedVariant(data.variants.edges[0].node.id);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const variant = product.variants.edges.find(
      (v) => v.node.id === selectedVariant
    )?.node;

    if (!variant) return;

    addItem({
      product: {
        node: product,
      },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions,
    });

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

  const currentVariant = product.variants.edges.find(
    (v) => v.node.id === selectedVariant
  )?.node;

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
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden bg-secondary/30">
                <img
                  src={product.images.edges[selectedImage]?.node?.url || productBoxImage}
                  alt={product.images.edges[selectedImage]?.node?.altText || product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {product.images.edges.length > 1 && (
                <div className="flex gap-3">
                  {product.images.edges.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image.node.url}
                        alt={image.node.altText || `${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:py-8">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                {product.title}
              </h1>

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
                    onClick={() => setPurchaseType("one-time")}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                      purchaseType === "one-time"
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
                {(() => {
                  const basePrice = parseFloat(currentVariant?.price.amount || "0");
                  const displayPrice = purchaseType === "one-time" 
                    ? basePrice * 1.15 
                    : basePrice;
                  const currency = currentVariant?.price.currencyCode || "USD";
                  
                  return (
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-primary">
                        {currency} {displayPrice.toFixed(2)}
                      </span>
                      <span className="text-lg text-muted-foreground">/box</span>
                      {purchaseType === "subscription" && (
                        <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                          Save 15%
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="text-muted-foreground text-lg mb-8 space-y-4">
                {(() => {
                  const desc = product.description || "Fresh, seasonal fruits picked at peak ripeness and delivered straight to your door.";
                  // Split by bold markers like **The Vibe:**
                  const parts = desc.split(/\*\*([^*]+)\*\*/g);
                  
                  if (parts.length <= 1) {
                    return <p>{desc}</p>;
                  }
                  
                  const elements: React.ReactNode[] = [];
                  
                  // First part is the intro paragraph
                  if (parts[0]?.trim()) {
                    elements.push(<p key="intro" className="text-foreground">{parts[0].trim()}</p>);
                  }
                  
                  // Process remaining parts in pairs (label, content)
                  for (let i = 1; i < parts.length; i += 2) {
                    const label = parts[i]?.trim();
                    const content = parts[i + 1]?.trim();
                    
                    if (label && content) {
                      elements.push(
                        <div key={label} className="flex gap-2">
                          <span className="font-semibold text-foreground whitespace-nowrap">{label}</span>
                          <span>{content}</span>
                        </div>
                      );
                    }
                  }
                  
                  return elements;
                })()}
              </div>

              {/* Variants */}
              {product.variants.edges.length > 1 && (
                <div className="mb-8">
                  <label className="block text-sm font-semibold mb-3">
                    Select Option
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.edges.map((variant) => (
                      <button
                        key={variant.node.id}
                        onClick={() => setSelectedVariant(variant.node.id)}
                        disabled={!variant.node.availableForSale}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedVariant === variant.node.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        } ${
                          !variant.node.availableForSale
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {variant.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
                disabled={!currentVariant?.availableForSale}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>

              {!currentVariant?.availableForSale && (
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
