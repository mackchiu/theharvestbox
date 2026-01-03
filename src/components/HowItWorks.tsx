import { Package, Truck, Heart } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Choose Your Box",
    description: "Select the perfect size to fit your household's snacking needs.",
  },
  {
    icon: Truck,
    title: "Delivered Weekly",
    description: "Your fresh fruit box arrives reliably at your doorstep, week after week.",
  },
  {
    icon: Heart,
    title: "Enjoy & Thrive",
    description: "Savor delicious, healthy snacks without the effort.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-kraft/50">
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
              className="relative text-center p-8 bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 group border border-border/50"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                {index + 1}
              </div>
              
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="font-display text-2xl font-semibold text-card-foreground mb-3">
                {step.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};