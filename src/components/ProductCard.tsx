import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/products";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/currency";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import productBoxImage from "@/assets/product-box.png";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem(product, 1, "subscription");
    
    toast.success("Added to cart!", {
      description: product.title,
      position: "top-center",
    });
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 w-full max-w-sm"
    >
      <div className="aspect-square overflow-hidden bg-secondary/30">
        <img
          src={product.image_url || productBoxImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.short_description || "Fresh, seasonal fruits picked at peak ripeness."}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(product.subscription_price)}
            </span>
            <span className="text-sm text-muted-foreground">/week</span>
          </div>
          
          <Button
            variant="hero"
            size="icon"
            onClick={handleAddToCart}
            className="rounded-full"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Link>
  );
};
