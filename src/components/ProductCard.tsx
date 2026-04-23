import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Box } from "@/lib/boxes";
import { formatPrice } from "@/lib/currency";
import productBoxImage from "@/assets/product-box.png";

interface ProductCardProps {
  box: Box;
}

export const ProductCard = ({ box }: ProductCardProps) => {
  return (
    <Link
      to={`/product/${box.slug}`}
      className="group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 w-full max-w-sm"
    >
      <div className="aspect-square overflow-hidden bg-secondary/30">
        <img
          src={productBoxImage}
          alt={box.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
          {box.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-2">
          A good fit for {box.serves}
        </p>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {box.shortDescription}
        </p>
        
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(box.oneTimePrice)}
            </div>
            <div className="text-sm text-muted-foreground">
              {formatPrice(box.subscriptionPrice)} subscribe
            </div>
          </div>
          
          <Button variant="hero" size="sm">
            View Box
          </Button>
        </div>
      </div>
    </Link>
  );
};
