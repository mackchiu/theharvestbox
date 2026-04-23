import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { getBoxBySlug } from "@/lib/boxes";
import { formatPrice } from "@/lib/currency";
import { ArrowLeft, ExternalLink } from "lucide-react";
import productBoxImage from "@/assets/product-box.png";

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const product = handle ? getBoxBySlug(handle) : null;

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-32 container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link to="/">Go Back Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all boxes
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <div className="aspect-square rounded-3xl overflow-hidden bg-secondary/30">
              <img
                src={productBoxImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="lg:py-8">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                {product.title}
              </h1>

              <p className="text-muted-foreground mb-4">
                A good fit for {product.serves}
              </p>

              <div className="mb-8 space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">
                    {formatPrice(product.oneTimePrice)}
                  </span>
                  <span className="text-lg text-muted-foreground">one-time</span>
                </div>
                <div className="text-muted-foreground">
                  {formatPrice(product.subscriptionPrice)} subscription after first-month commitment
                </div>
              </div>

              <div className="text-muted-foreground text-lg mb-8 space-y-5">
                {product.sections.map((section) => (
                  <div key={section.label}>
                    <h3 className="font-semibold text-foreground mb-2">{section.label}</h3>
                    <p className="whitespace-pre-line">{section.content}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-secondary/40 p-5 mb-8 text-sm text-muted-foreground">
                Checkout, subscriptions, and order management will be handled in Shopify.
              </div>

              <Button
                variant="hero"
                size="xl"
                className="w-full"
                asChild
              >
                <a href={product.shopifyUrl || "#"}>
                  Shopify Checkout Coming Soon
                  <ExternalLink className="w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
