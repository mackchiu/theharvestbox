import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const faqs = [
  {
    question: "What is Harvest Box?",
    answer:
      "Harvest Box is a weekly fresh fruit box delivered to your door. Each week includes a mix of seasonal fruit, local when possible, plus 1 to 2 staple fruits to keep things familiar and useful.",
  },
  {
    question: "How does it work?",
    answer:
      "Choose The Peck or The Bushel, place your order before the weekly cutoff, and get your box delivered on Thursday. We share a likely fruit lineup ahead of time, then source and pack close to delivery day so the fruit arrives fresh.",
  },
  {
    question: "What box sizes do you offer?",
    answer:
      "We offer two sizes. The Peck is a good fit for 1 to 2 people, and The Bushel is a good fit for 3 to 5 people. Both follow the same weekly lineup. The main difference is quantity.",
  },
  {
    question: "What fruit will be in my box?",
    answer:
      "Each week, we share a likely fruit lineup before orders close. Final contents can shift slightly depending on sourcing and quality. Our boxes are built around the best available seasonal fruit, local when possible, with 1 to 2 staple fruits included each week.",
  },
  {
    question: "When do orders close?",
    answer:
      "Orders close Sunday night for that week’s Thursday delivery. Orders placed after Sunday night roll to the following week’s delivery.",
  },
  {
    question: "When do you deliver?",
    answer:
      "We deliver on Thursdays between 12 pm and 7 pm.",
  },
  {
    question: "Where do you deliver?",
    answer:
      "We currently deliver within our local service area: north to Finch Avenue, south to St. Clair Avenue, east to the DVP / 404, and west to Highway 400 / Black Creek.",
  },
  {
    question: "Do you offer pickup?",
    answer: "Not at launch. Harvest Box is delivery-only for now.",
  },
  {
    question: "Can I make substitutions?",
    answer:
      "We do not offer custom substitutions for preferences. We may be able to accommodate limited allergy-based exclusions if requested in advance, but we cannot guarantee zero cross-contact in a home packing environment.",
  },
  {
    question: "What if a fruit is unavailable or doesn’t meet your standards?",
    answer:
      "If something comes in short or does not look right, we may swap it for a similar fruit of equal or better value. If the change is meaningful, we will let you know.",
  },
  {
    question: "What if my box arrives with damaged or missing fruit?",
    answer:
      "If fruit arrives badly damaged or missing, contact us the same day, ideally with a photo. Depending on the situation, we’ll make it right with a replacement, store credit, or a refund.",
  },
  {
    question: "Do you offer one-time orders or subscriptions?",
    answer:
      "Both. You can place a one-time order at full price, or subscribe for a discounted rate with a 1-month commitment.",
  },
  {
    question: "Can I pause or cancel my subscription?",
    answer:
      "Yes, after the first month. Once your initial 1-month commitment is complete, you can pause or cancel anytime before the weekly cutoff. Changes made after Sunday night apply to the following week.",
  },
  {
    question: "Are there add-ons?",
    answer:
      "Not at launch. We’re keeping things simple: everyone gets the same weekly box format, adjusted only by box size.",
  },
  {
    question: "Why is availability limited?",
    answer:
      "Harvest Box is launching with a limited number of weekly spots so we can keep quality high and deliveries consistent.",
  },
];

const FAQPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">FAQ</h1>
            <p className="text-xl text-muted-foreground">
              The simple version of how Harvest Box works, what to expect, and what happens when something changes.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <section key={faq.question} className="bg-card rounded-2xl p-6 shadow-soft border border-border/50">
                <h2 className="font-display text-2xl font-semibold text-foreground mb-3">{faq.question}</h2>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;
