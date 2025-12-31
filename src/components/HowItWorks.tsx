import { Package, Truck, Heart } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Choose Your Box",
    description: "Select from our variety of seasonal fruit boxes tailored to your preferences and dietary needs.",
    emoji: "📦",
  },
  {
    icon: Truck,
    title: "We Deliver Fresh",
    description: "Your hand-picked fruits are carefully packed and delivered straight to your doorstep weekly.",
    emoji: "🚚",
  },
  {
    icon: Heart,
    title: "Enjoy & Repeat",
    description: "Savor the freshest fruits and never worry about grocery shopping again. Cancel anytime.",
    emoji: "💚",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Getting fresh fruit delivered to your door is as easy as 1-2-3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative text-center p-8 bg-card rounded-3xl shadow-soft hover:shadow-card transition-all duration-300 group"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full gradient-cta flex items-center justify-center text-primary-foreground font-bold text-sm">
                {index + 1}
              </div>
              
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">
                {step.emoji}
              </div>
              
              <h3 className="font-display text-2xl font-semibold text-card-foreground mb-3">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
