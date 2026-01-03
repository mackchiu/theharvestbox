import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";
import { User, Shield } from "lucide-react";

export const Header = () => {
  const { user, isAdmin } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-kraft/90 backdrop-blur-md border-b border-kraft-dark/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src={logo} 
            alt="The Harvest Box" 
            className="h-24 w-auto transition-transform group-hover:scale-105"
          />
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
            Home
          </Link>
          <a href="/#boxes" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
            Our Boxes
          </a>
          <a href="/#how-it-works" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
            How It Works
          </a>
        </nav>
        
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="text-primary">
                <Shield className="h-5 w-5" />
              </Button>
            </Link>
          )}
          
          {user ? (
            <Link to="/account">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}
          
          <CartDrawer />
        </div>
      </div>
    </header>
  );
};
