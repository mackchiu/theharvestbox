import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";

export const Hero = () => {
  return (
    <section className="relative min-h-screen bg-cardboard overflow-hidden pt-16">
      {/* Subtle decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-forest/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-earth/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 pt-12 pb-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Large centered logo */}
          <div className="mb-8 opacity-0 animate-fade-in">
            <img 
              src={logo} 
              alt="The Harvest Box" 
              className="mx-auto w-96 md:w-[30rem] h-auto drop-shadow-lg"
            />
          </div>
          
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Freshness Delivered.{" "}
            <span className="text-primary">Health Made Easy.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Fuel your healthy lifestyle effortlessly with vibrant, farm-fresh fruit delivered straight to your door.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" asChild>
              <a href="#boxes">
                Get Your Fresh Box Today!
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-foreground/30 text-foreground hover:bg-foreground/10">
              <a href="#how-it-works">
                Learn More
              </a>
            </Button>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground font-display">5000+</div>
              <div className="text-sm text-muted-foreground">Happy Subscribers</div>
            </div>
            <div className="w-px h-12 bg-foreground/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground font-display">Peak</div>
              <div className="text-sm text-muted-foreground">Freshness</div>
            </div>
            <div className="w-px h-12 bg-foreground/20" />
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground font-display">4.9★</div>
              <div className="text-sm text-muted-foreground">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
        </svg>
      </div>
    </section>
  );
};