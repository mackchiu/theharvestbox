import { Leaf, Clock, Award, Recycle } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Flexible Delivery",
    description: "Choose your delivery day and easily pause or skip weeks when needed.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Hand-selected at peak ripeness for the best taste and nutrition.",
  },
  {
    icon: Recycle,
    title: "Eco-Friendly",
    description: "Sustainable packaging that's 100% recyclable and compostable.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose FreshBox?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're committed to bringing you the freshest, healthiest fruits sustainably.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-secondary/40 hover:bg-secondary transition-colors duration-300 group"
            >
              <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-accent-foreground" />
              </div>
              
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
