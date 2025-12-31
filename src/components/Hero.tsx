import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen gradient-hero overflow-hidden pt-16">
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-fruit-orange/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-fruit-green/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-fruit-yellow/20 rounded-full blur-2xl" />
      
      {/* Floating fruit emojis */}
      <div className="absolute top-32 right-[15%] text-6xl animate-float opacity-80">🍊</div>
      <div className="absolute top-48 left-[10%] text-5xl animate-float-delayed opacity-80">🍓</div>
      <div className="absolute bottom-32 right-[20%] text-5xl animate-float opacity-80">🥝</div>
      <div className="absolute top-[60%] left-[15%] text-4xl animate-float-delayed opacity-80">🍋</div>
      <div className="absolute bottom-48 left-[25%] text-6xl animate-float opacity-80">🍎</div>
      
      <div className="container mx-auto px-4 pt-20 pb-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">Fresh from farm to your doorstep</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Fresh Fruit,{" "}
            <span className="text-gradient">Delivered</span>{" "}
            Weekly
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Subscribe to seasonal, hand-picked fruit boxes delivered straight to your door. 
            Healthy eating made effortless.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" asChild>
              <a href="#boxes">
                Start Your Subscription
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="#how-it-works">
                Learn More
              </a>
            </Button>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">5000+</div>
              <div className="text-sm text-muted-foreground">Happy Subscribers</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">100%</div>
              <div className="text-sm text-muted-foreground">Organic Fruits</div>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">4.9★</div>
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
