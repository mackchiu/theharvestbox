import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Leaf } from "lucide-react";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center transition-transform group-hover:scale-110">
            <Leaf className="w-5 h-5 text-accent-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            The Harvest<span className="text-primary"> Box</span>
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Home
          </Link>
          <a href="#boxes" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            Our Boxes
          </a>
          <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
            How It Works
          </a>
        </nav>
        
        <CartDrawer />
      </div>
    </header>
  );
};
