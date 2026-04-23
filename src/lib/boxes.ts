export interface Box {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  serves: string;
  oneTimePrice: number;
  subscriptionPrice: number;
  shopifyUrl?: string;
  sections: { label: string; content: string }[];
}

export const boxes: Box[] = [
  {
    id: "small",
    title: "Harvest Box Small",
    slug: "small",
    shortDescription:
      "A weekly fruit box for 1 to 2 people, built around a practical mix of staples and seasonal fruit.",
    serves: "1 to 2 people",
    oneTimePrice: 45,
    subscriptionPrice: 40,
    sections: [
      {
        label: "About",
        content:
          "The Small Harvest Box is built for 1 to 2 people who want good fruit at home without having to think about it. Each week, we pack a balanced mix of familiar staples and seasonal fruit based on what looks best and tastes best that week.",
      },
      {
        label: "Typical box",
        content:
          "A typical Small box may include bananas, apples, oranges, pears, grapes, and one seasonal fruit such as mango.",
      },
      {
        label: "Good to know",
        content:
          "We do not promise the exact same fruit every week. Harvest Box follows a best-available seasonal mix, with local fruit included when it makes sense. If something changes, we swap thoughtfully for a similar fruit of equal or better value.",
      },
    ],
  },
  {
    id: "family",
    title: "Harvest Box Family",
    slug: "family",
    shortDescription:
      "A larger weekly fruit box for 3 to 5 people, with more volume and enough fruit to keep a busy household going through the week.",
    serves: "3 to 5 people",
    oneTimePrice: 65,
    subscriptionPrice: 60,
    sections: [
      {
        label: "About",
        content:
          "The Family Harvest Box is built for households that go through fruit quickly. Each week, we pack a larger mix of staple fruit and seasonal favourites, with enough volume to make the box feel useful for real family life, not just like a top-up.",
      },
      {
        label: "Typical box",
        content:
          "A typical Family box may include bananas, apples, oranges, pears, grapes, pineapple, and one seasonal fruit such as mango.",
      },
      {
        label: "Good to know",
        content:
          "The goal is simple: keep good fruit in the house without another grocery run. We do not promise the exact same fruit every week. Fruit may shift based on quality and availability, and substitutions are made thoughtfully when needed.",
      },
    ],
  },
];

export function getBoxBySlug(slug: string) {
  return boxes.find((box) => box.slug === slug) ?? null;
}
