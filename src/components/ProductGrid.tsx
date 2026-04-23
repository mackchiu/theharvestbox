import { ProductCard } from "./ProductCard";
import { boxes } from "@/lib/boxes";

export const ProductGrid = () => {
  return (
    <section id="boxes" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Box
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pick Small or Family. Each week follows a best-available seasonal mix, with staple fruit included to keep the house stocked.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {boxes.map((box) => (
            <ProductCard key={box.id} box={box} />
          ))}
        </div>
      </div>
    </section>
  );
};
