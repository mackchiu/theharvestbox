import { Button } from "@/components/ui/button";
import { Mail, MapPin, Clock3 } from "lucide-react";
import logo from "@/assets/logo.png";

const ComingSoonPage = () => {
  return (
    <div className="min-h-screen bg-cardboard text-foreground">
      <main className="relative overflow-hidden">
        <div className="absolute top-16 left-8 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-16 right-8 h-52 w-52 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-16">
          <div className="mx-auto max-w-4xl rounded-[2rem] border border-kraft-dark/30 bg-background/90 p-8 shadow-card backdrop-blur md:p-12">
            <div className="mb-8 flex justify-center">
              <img src={logo} alt="The Harvest Box" className="h-40 w-auto md:h-52" />
            </div>

            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
                Coming Soon
              </p>

              <h1 className="mb-6 font-display text-4xl font-bold leading-tight md:text-6xl">
                Fresh fruit for the week, delivered to your door.
              </h1>

              <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Harvest Box is getting ready to launch weekly fruit delivery in Toronto. We’re keeping the first version simple, seasonal, and useful for real households.
              </p>

              <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button variant="hero" size="xl" asChild>
                  <a href="mailto:hello@theharvestbox.ca?subject=Harvest%20Box%20early%20access">
                    Get launch updates
                  </a>
                </Button>

                <Button variant="outline" size="lg" asChild>
                  <a href="mailto:hello@theharvestbox.ca?subject=Harvest%20Box%20question">
                    Ask a question
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <MapPin className="h-5 w-5" />
                  <h2 className="font-display text-xl font-semibold text-foreground">Local delivery area</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Launching in Toronto, centered around Yonge and Lawrence, with a tight local delivery zone to keep quality and timing dependable.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <Clock3 className="h-5 w-5" />
                  <h2 className="font-display text-xl font-semibold text-foreground">Weekly rhythm</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Orders will close Sunday night for Thursday delivery, with sourcing close to delivery day so fruit doesn’t sit around longer than it should.
                </p>
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <Mail className="h-5 w-5" />
                  <h2 className="font-display text-xl font-semibold text-foreground">Early access</h2>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Want first dibs when we open? Email hello@theharvestbox.ca and we’ll keep you in the loop.
                </p>
              </div>
            </div>

            <div className="mt-10 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground">
              Harvest Box is launching with limited weekly spots so we can keep the first run tight and reliable.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComingSoonPage;
