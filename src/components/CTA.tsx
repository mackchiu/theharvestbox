import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { HomeSectionLink } from "@/components/HomeSectionLink";

export const CTA = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-earth/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center bg-kraft/60 rounded-2xl p-12 shadow-card border border-kraft-dark/30">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Keep fruit at home, the easy way.
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Choose your box and get fresh fruit delivered on Thursday. We&apos;ll share a likely weekly lineup before cutoff, and if something changes, we swap it thoughtfully.
          </p>
          
          <Button variant="hero" size="xl" asChild>
            <HomeSectionLink section="boxes">
              See This Week&apos;s Box
              <ArrowRight className="w-5 h-5" />
            </HomeSectionLink>
          </Button>
          
          <p className="text-sm text-muted-foreground mt-6">
            One-time boxes or subscribe for a better weekly price.
          </p>
        </div>
      </div>
    </section>
  );
};