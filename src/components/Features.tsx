import { Sparkles, Clock, Award, Heart } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Fresh Weekly Fruit",
    description: "A practical weekly fruit box without another grocery run in the middle of the week.",
  },
  {
    icon: Clock,
    title: "Best-Available Seasonal Mix",
    description: "We build each week around what looks good, tastes good, and makes sense to buy that week.",
  },
  {
    icon: Heart,
    title: "Staples Included",
    description: "Alongside seasonal fruit, we keep a couple of familiar staples in the box for reliability.",
  },
  {
    icon: Award,
    title: "Local Delivery Area",
    description: "We keep deliveries within a tight local service area so the operation stays practical and dependable.",
  },
];

export const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Makes Harvest Box Different
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We keep it simple, seasonal, and useful for real households.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 group shadow-soft hover:shadow-card"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};