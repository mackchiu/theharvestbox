import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart, Plus } from "lucide-react";
import { toast } from "sonner";
import productBoxImage from "@/assets/product-box.png";
interface ProductCardProps {
  product: ShopifyProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { node } = product;
  
  const firstVariant = node.variants.edges[0]?.node;
  const imageUrl = node.images.edges[0]?.node?.url;
  const price = node.priceRange.minVariantPrice;
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant) return;
    
    addItem({
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions,
    });
    
    toast.success("Added to cart!", {
      description: node.title,
      position: "top-center",
    });
  };

  return (
    <Link
      to={`/product/${node.handle}`}
      className="group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-square overflow-hidden bg-secondary/30">
        <img
          src={imageUrl || productBoxImage}
          alt={node.images.edges[0]?.node?.altText || node.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
          {node.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {node.description || "Fresh, seasonal fruits picked at peak ripeness."}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">
              {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground">/box</span>
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
