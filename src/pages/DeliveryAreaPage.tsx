import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const DeliveryAreaPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-12 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">Delivery Area</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We currently deliver within our defined local service area. If you’re not sure whether your address is included, check the map below or contact us before ordering.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-8 items-start">
            <div className="bg-card rounded-2xl shadow-soft border border-border/50 p-4">
              <img
                src="/delivery-area-map.svg"
                alt="Schematic map of Harvest Box delivery area boundaries"
                className="w-full h-auto rounded-xl"
              />
              <p className="text-sm text-muted-foreground mt-4 px-2">
                Schematic delivery area map, shown for orientation. Customer-facing service is defined by the listed boundaries, not drive-time estimates.
              </p>
            </div>

            <div className="space-y-6">
              <section className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Service Area Boundaries</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li><strong className="text-foreground">North:</strong> Finch Avenue</li>
                  <li><strong className="text-foreground">South:</strong> St. Clair Avenue</li>
                  <li><strong className="text-foreground">East:</strong> DVP / 404</li>
                  <li><strong className="text-foreground">West:</strong> Highway 400 / Black Creek</li>
                </ul>
              </section>

              <section className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Delivery Window</h2>
                <p className="text-muted-foreground">
                  Harvest Box delivers on <strong className="text-foreground">Thursdays</strong> between <strong className="text-foreground">12 pm and 7 pm</strong>.
                </p>
              </section>

              <section className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Good to Know</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our service area is centered operationally around Yonge and Lawrence, but customer-facing delivery is defined by the boundary map and street limits above. If you’re near the edge, check with us before ordering.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeliveryAreaPage;
