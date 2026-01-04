import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/currency";
import productBoxImage from "@/assets/product-box.png";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    items, 
    isLoading,
    lastError,
    updateQuantity, 
    removeItem, 
    createCheckout 
  } = useCartStore();
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const price = item.purchaseType === 'subscription' 
      ? item.product.subscription_price 
      : item.product.one_time_price;
    return sum + (price * item.quantity);
  }, 0);

  const handleCheckout = async () => {
    // Require login before checkout
    if (!user) {
      toast.info('Please log in to complete your purchase');
      setIsOpen(false);
      navigate('/auth');
      return;
    }

    try {
      const checkoutUrl = await createCheckout();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error(lastError || 'Failed to create checkout. Please try again.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Checkout failed:', message);
      toast.error(message || 'Checkout failed. Please try again.');
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative border-primary/20 hover:border-primary">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg flex flex-col h-full bg-card">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-display text-2xl">Your Cart</SheetTitle>
          <SheetDescription>
            {lastError ? `Checkout error: ${lastError}` : (totalItems === 0 ? "Your cart is empty" : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart`)}
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col flex-1 pt-6 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-2">Add some delicious fruit boxes!</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-4">
                  {items.map((item) => {
                    const price = item.purchaseType === 'subscription' 
                      ? item.product.subscription_price 
                      : item.product.one_time_price;
                    
                    return (
                      <div key={`${item.product.id}-${item.purchaseType}`} className="flex gap-4 p-4 bg-secondary/30 rounded-xl">
                        <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.image_url || productBoxImage}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{item.product.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.purchaseType === 'subscription' ? 'Weekly subscription' : 'One-time purchase'}
                          </p>
                          <p className="font-bold text-primary mt-1">
                            {formatPrice(price)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          
                          <div className="flex items-center gap-1 bg-background rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="flex-shrink-0 space-y-4 pt-6 border-t border-border mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                
                <Button 
                  onClick={handleCheckout}
                  variant="hero"
                  className="w-full" 
                  size="xl"
                  disabled={items.length === 0 || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Checkout...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Checkout
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
