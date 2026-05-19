import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Swim Up — Menu",
  description:
    "Bar and kitchen at The Swim Up — breakfast, lunch, pool-deck snacks, dinner, and cocktails morning to last call.",
  openGraph: {
    title: "The Swim Up — Menu",
    description:
      "Bar and kitchen at The Swim Up — breakfast, lunch, pool-deck snacks, dinner, and cocktails morning to last call.",
    images: ["/photo-hero.jpg"],
    type: "website",
    siteName: "The Swim Up",
  },
};

type Item = { name: string; price?: string; desc?: string };

function MenuSection({
  eyebrow,
  title,
  intro,
  items,
  tone = "cream",
  photo,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  items: Item[];
  tone?: "cream" | "beige" | "pool" | "chrome" | "teal";
  photo?: string;
}) {
  const style = photo ? { backgroundImage: `url(${photo})` } : undefined;
  return (
    <section
      className={`menu-section tone-${tone}${photo ? " has-photo" : ""}`}
      style={style}
    >
      <div className="menu-section-inner">
        <header className="menu-section-head">
          <span className="menu-eyebrow">{eyebrow}</span>
          <h2 className="menu-section-title">{title}</h2>
          {intro && <p className="menu-section-intro">{intro}</p>}
        </header>
        <ul className="menu-list">
          {items.map((it, i) => (
            <li key={i} className="menu-item">
              <div className="menu-item-line">
                <span className="menu-item-name">{it.name}</span>
                <span className="menu-item-dots" aria-hidden />
                {it.price && <span className="menu-item-price">{it.price}</span>}
              </div>
              {it.desc && <p className="menu-item-desc">{it.desc}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const breakfast: Item[] = [
  { name: "The Standard", price: "14", desc: "Two eggs, sourdough, brown butter." },
  { name: "Soft-scrambled", price: "16", desc: "Crème fraîche, chives, more chives." },
  { name: "Granola + yogurt", price: "12", desc: "House granola, stone fruit, honey." },
  { name: "Smoked salmon, bagel", price: "18", desc: "Capers, red onion, dill." },
  { name: "Pancakes", price: "14", desc: "Brown butter, real maple." },
  { name: "Espresso · Cortado · Latte", price: "4 / 5 / 6" },
  { name: "Drip coffee", price: "4", desc: "Bottomless." },
];

const lunch: Item[] = [
  {
    name: "The Burger",
    price: "18",
    desc: "Lettuce, tomato, aged cheddar, secret sauce. The window version, too.",
  },
  { name: "Burrata + stone fruit", price: "19", desc: "Charred peaches, basil, olive oil." },
  { name: "Caesar", price: "16", desc: "Romaine, anchovy, Parmesan, lemon." },
  { name: "Tuna crudo", price: "22", desc: "Lemon, olive oil, sea salt." },
  { name: "Roast chicken sandwich", price: "19", desc: "Jus, herb mayo, brioche." },
  { name: "Frites", price: "9", desc: "Sea salt, lemon mayo." },
  { name: "Truffle frites", price: "14", desc: "Worth it." },
];

const poolDeck: Item[] = [
  { name: "Castelvetrano olives", price: "7", desc: "Lemon zest, chili." },
  { name: "Salted almonds", price: "5" },
  { name: "Pretzel", price: "8", desc: "Warm, beer mustard." },
  { name: "Hummus + flatbread", price: "14", desc: "Charred, za'atar." },
  { name: "Oysters", price: "4 ea", desc: "Mignonette, lemon. Half-dozen min." },
  { name: "Crudités", price: "12", desc: "Whatever's at the market, green goddess." },
  { name: "Frozen mango", price: "6", desc: "On a stick. Yes." },
];

const dinner: Item[] = [
  { name: "Pasta of the day", price: "26", desc: "Ask. Made same day, with what's good." },
  { name: "Roast fish", price: "34", desc: "Brown butter, herbs, lemon." },
  { name: "Steak frites", price: "42", desc: "Hanger, bordelaise, more frites." },
  { name: "Half chicken", price: "32", desc: "Wood roasted, salsa verde." },
  { name: "Vegetable plate", price: "22", desc: "Changes daily. Worth ordering anyway." },
  { name: "Charred broccolini", price: "12", desc: "Side. Lemon, chili." },
  { name: "Smashed potatoes", price: "9", desc: "Side. Crunchy. Garlic." },
];

const cocktailsPool: Item[] = [
  {
    name: "The Swim Up",
    price: "16",
    desc: "Tequila, grapefruit cordial, lime, soda. The house drink.",
  },
  { name: "Aperol Spritz", price: "14", desc: "Aperol, prosecco, soda, orange." },
  { name: "Paloma", price: "15", desc: "Tequila, grapefruit, lime, salt." },
  { name: "Mojito", price: "15", desc: "White rum, mint, lime, soda." },
  { name: "Frozen Daiquiri", price: "14", desc: "White rum, lime, sugar. Always." },
  { name: "Pimm's Cup", price: "13", desc: "Pimm's, ginger beer, cucumber, mint." },
  { name: "Watermelon margarita", price: "16", desc: "Tequila, watermelon, lime, salt rim." },
];

const cocktailsBar: Item[] = [
  { name: "Negroni", price: "17", desc: "Gin, Campari, sweet vermouth, orange." },
  { name: "Manhattan", price: "18", desc: "Rye, sweet vermouth, bitters." },
  { name: "Martini", price: "17", desc: "Gin or vodka. Olive or twist. You decide." },
  { name: "Old Fashioned", price: "17", desc: "Bourbon, sugar, Angostura, orange peel." },
  { name: "Whiskey Sour", price: "16", desc: "Bourbon, lemon, egg white, bitters." },
  { name: "Sazerac", price: "18", desc: "Rye, absinthe rinse, sugar, Peychaud's." },
  { name: "Espresso Martini", price: "16", desc: "Vodka, espresso, coffee liqueur. After dinner." },
];

const zeroProof: Item[] = [
  { name: "Seedlip + tonic", price: "12", desc: "Cucumber, mint, lime." },
  { name: "Athletic IPA", price: "9", desc: "Cold." },
  { name: "House lemonade", price: "8", desc: "Real lemons, light sugar, mint." },
  { name: "San Pellegrino", price: "5" },
  { name: "Topo Chico", price: "5" },
  { name: "Iced coffee", price: "6" },
];

const wineBeer: Item[] = [
  {
    name: "Sparkling — by the glass",
    price: "14 — 22",
    desc: "Cava, prosecco, grower champagne. Bottle list on request.",
  },
  {
    name: "Whites + Rosé — by the glass",
    price: "13 — 20",
    desc: "Lean, dry, food-friendly. Full list on request.",
  },
  {
    name: "Reds — by the glass",
    price: "14 — 24",
    desc: "Light to structured. Full list on request.",
  },
  {
    name: "Drafts",
    price: "8 — 12",
    desc: "Rotating local + import. Ask what's on.",
  },
  {
    name: "Bottles + cans",
    price: "7 — 15",
    desc: "Domestic, import, NA. Wide selection.",
  },
];

export default function MenuPage() {
  return (
    <>
      <div className="strip">
        <div className="pair">
          <Link href="/">← The Swim Up</Link>
          <span>SAN FRANCISCO</span>
        </div>
        <div className="pair">
          <Link href="/#work">Work</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/#inquire">Members</Link>
        </div>
      </div>

      <article className="menu-page">
        <header className="menu-hero">
          <div className="menu-hero-photo" aria-hidden="true" />
          <div className="menu-hero-content">
            <span className="menu-hero-eyebrow">— Bar &amp; Kitchen —</span>
            <h1 className="menu-hero-title">
              Six things done well,<br />
              <em>not thirty done halfway.</em>
            </h1>
            <p className="menu-hero-lede">
              Breakfast through last call. The kitchen is short on its feet —
              the menu changes when something better shows up at the market —
              but these are the dishes we're always trying to be the best at.
            </p>
            <p className="menu-hero-caveat">
              Prices and selection illustrative · final menu sets in spring ·
              members eat in · day-pass guests too
            </p>
          </div>
        </header>

        <MenuSection
          eyebrow="From 7"
          title="Breakfast"
          intro="The first hour of the day belongs to coffee. The second to eggs."
          items={breakfast}
          tone="cream"
        />

        <MenuSection
          eyebrow="From 11:30"
          title="Lunch"
          intro="The long lunch table is open. Eat at it."
          items={lunch}
          tone="beige"
        />

        <MenuSection
          eyebrow="All day on the deck"
          title="Pool Deck"
          intro="Small plates from the kitchen, delivered to your chair."
          items={poolDeck}
          tone="pool"
          photo="/photo-pool-deck.jpg"
        />

        <MenuSection
          eyebrow="From 5:30"
          title="Dinner"
          intro="Wood-fired, slow, fewer choices, better execution."
          items={dinner}
          tone="cream"
          photo="/photo-dinner.jpg"
        />

        <MenuSection
          eyebrow="Daytime"
          title="Cocktails · Pool"
          intro="Lower ABV, citrus-led, made for sun and conversation."
          items={cocktailsPool}
          tone="chrome"
        />

        <MenuSection
          eyebrow="From 5"
          title="Cocktails · Bar"
          intro="Classics, executed properly. No froth, no foam, no flame."
          items={cocktailsBar}
          tone="teal"
          photo="/photo-bar.jpg"
        />

        <MenuSection
          eyebrow="Always"
          title="Wine + Beer"
          items={wineBeer}
          tone="beige"
        />

        <MenuSection
          eyebrow="Always"
          title="Zero Proof"
          intro="A real list, not an afterthought."
          items={zeroProof}
          tone="cream"
        />

        <footer className="menu-foot">
          <p>
            <strong>The Swim Up</strong> &nbsp;·&nbsp; 584 4th St, San Francisco &nbsp;·&nbsp;
            Opening Spring 2026
          </p>
          <p className="fine">
            Allergens on request. Service included on parties of six or more.
            Menu and prices subject to change as we finalise the kitchen.
          </p>
        </footer>
      </article>
    </>
  );
}
