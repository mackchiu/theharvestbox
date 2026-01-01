import { Sparkles, Clock, Award, Heart } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Peak Freshness",
    description: "Hand-picked and packed just for you, guaranteeing ripeness and flavor.",
  },
  {
    icon: Clock,
    title: "Ultimate Convenience",
    description: "Delivered weekly, saving you precious time and hassle.",
  },
  {
    icon: Heart,
    title: "Healthy Habits Made Simple",
    description: "A diverse selection of fruits to keep your energy levels high and your body happy.",
  },
  {
    icon: Award,
    title: "Consistent Quality",
    description: "We partner with trusted growers to bring you the best, every time.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose The Harvest Box?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tired of grocery store runs for fruit that isn't quite fresh? We bring the orchard to you.
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
