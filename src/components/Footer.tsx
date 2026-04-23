import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export const Footer = () => {
  return (
    <footer className="bg-forest-dark text-cream py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-4">
              <img 
                src={logo} 
                alt="The Harvest Box" 
                className="h-32 w-auto brightness-110"
              />
            </Link>
            
            <p className="text-cream/70 max-w-sm leading-relaxed">
              Fresh fruit for the week, delivered to your door. Seasonal fruit, local when possible, and a couple of staples to keep the house stocked.
            </p>
          </div>
          
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-cream">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#boxes" className="text-cream/70 hover:text-cream transition-colors">
                  Our Boxes
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-cream/70 hover:text-cream transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-cream/70 hover:text-cream transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display text-lg font-semibold mb-4 text-cream">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-cream/70">
                <Mail className="w-4 h-4" />
                hello@theharvestbox.ca
              </li>
              <li className="flex items-center gap-2 text-cream/70">
                <MapPin className="w-4 h-4" />
                Toronto delivery area, Ontario
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-cream/20 pt-8 text-center text-cream/60 text-sm">
          <p>&copy; {new Date().getFullYear()} The Harvest Box. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};