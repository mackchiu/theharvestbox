import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-kraft/90 backdrop-blur-md border-b border-kraft-dark/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
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
          <Link to="/delivery-area" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
            Delivery Area
          </Link>
          <Link to="/faq" className="text-foreground/70 hover:text-foreground transition-colors font-medium">
            FAQ
          </Link>
        </nav>
        
        <Button variant="outline" size="sm" asChild>
          <a href="#boxes">See Boxes</a>
        </Button>
      </div>
    </header>
  );
};
