import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const CTA = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-earth/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center bg-kraft/60 rounded-2xl p-12 shadow-card border border-kraft-dark/30">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Weekly Dose of Delicious Health
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
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