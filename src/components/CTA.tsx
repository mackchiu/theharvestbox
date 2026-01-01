import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-accent/10 via-background to-primary/5 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-float">🍊</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-float-delayed">🍓</div>
      <div className="absolute top-1/2 right-1/4 text-5xl opacity-15 animate-float">🍋</div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center bg-card rounded-3xl p-12 shadow-card">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-card-foreground mb-4">
            Your Weekly Dose of Delicious Health
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8">
            Experience the ultimate convenience of fresh fruit, tailored for your healthy lifestyle.
            Join us in rediscovering the pure joy and benefits of truly fresh fruit.
          </p>
          
          <Button variant="hero" size="xl" asChild>
            <a href="#boxes">
              Choose Your Fresh Fruit Box!
              <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
          
          <p className="text-sm text-muted-foreground mt-6">
            Flexible & convenient. Skip a week, pause, or cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
};
