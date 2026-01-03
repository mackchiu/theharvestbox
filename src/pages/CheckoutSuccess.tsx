import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const CheckoutSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md text-center">
          <div className="bg-card rounded-2xl p-8 shadow-card">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold mb-4">
              Thank You!
            </h1>
            <p className="text-muted-foreground mb-8">
              Your order has been confirmed. We'll send you an email with your order details and tracking information soon.
            </p>
            
            <div className="space-y-3">
              <Link to="/account/orders">
                <Button variant="hero" className="w-full">
                  View My Orders
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Continue Shopping
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

export default CheckoutSuccess;
