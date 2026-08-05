import type { Product } from "@/lib/types";

/**
 * Whole Cakes, Spoon Cakes, and Bingsu below are the three menu categories
 * currently live on thepeachy.ca, with real names/sizes/prices pulled from
 * the site. Per-product ingredients/allergens/storage/serving copy is
 * representative (built from the site's own ingredient callouts -- Callebaut
 * Belgian chocolate, organic vanilla bean, fresh cream & eggs, no PDFs) and
 * should be swapped for the client's exact spec sheets before this goes live.
 *
 * Ratings and marketing badges (Best Seller / Staff Pick / New / Seasonal)
 * are intentionally left unset -- there's no real data to back them yet. The
 * UI fully supports both; they simply render nothing until populated.
 *
 * Image paths point at /public/images/products/<slug>.jpg (card/quick-view
 * image) and <slug>-1.jpg, <slug>-2.jpg, ... (product-page gallery, whole
 * cakes only) -- see public/images/products/README.md for the full naming
 * convention. None of those files are checked in yet, so every one of these
 * currently 404s; <ProductImage> catches that and falls back to the branded
 * placeholder automatically, so the site looks right either way. Drop real
 * photos in with matching filenames and they'll appear with no code changes.
 */

const CREAM_STORAGE =
  "Keep refrigerated at 0-4°C at all times. Remove from the fridge 10-15 minutes before serving for the best texture.";
const CREAM_SERVING = "Best served chilled. Slice with a warm, dry knife for clean cuts.";
const CREAM_SHELF_LIFE = "3 days refrigerated from pickup/delivery.";
const CREAM_ALLERGENS = ["Milk", "Eggs", "Wheat"];

function productImage(slug: string) {
  return `/images/products/${slug}.jpg`;
}

function galleryImage(slug: string, index: number) {
  return `/images/products/${slug}-${index}.jpg`;
}

export const products: Product[] = [
  // ---------------------------------------------------------------------
  // WHOLE CAKES (large -> dedicated /product/[slug] pages)
  // ---------------------------------------------------------------------
  {
    id: "wc-greek-yogurt-strawberry",
    slug: "greek-yogurt-strawberry-fresh-cream-cake",
    name: "Greek Yogurt Strawberry Fresh Cream",
    category: "whole-cakes",
    size: "large",
    shortDescription: "Whipped cream cake layered with strawberries and tangy Greek yogurt cream.",
    description:
      "A whipped cream cake with strawberries, offering a harmonious taste of strawberry and yogurt whipped cream. Light, tangy, and not overly sweet -- a Peachy signature.",
    flavorNotes: ["Strawberry", "Greek yogurt", "Fresh cream"],
    ingredients: ["Fresh strawberries", "Greek yogurt whipped cream", "Sponge cake", "Fresh cream", "Eggs", "Sugar", "Flour"],
    allergens: CREAM_ALLERGENS,
    storage: CREAM_STORAGE,
    servingInfo: CREAM_SERVING,
    shelfLife: CREAM_SHELF_LIFE,
    sizes: [
      { label: '5"', price: 56 },
      { label: '6"', price: 65 },
      { label: '8"', price: 78 },
    ],
    image: {
      src: productImage("greek-yogurt-strawberry-fresh-cream-cake"),
      alt: "Whole round cake covered in fresh cream with sliced strawberries on top",
      tone: "blush",
    },
    gallery: [
      { src: galleryImage("greek-yogurt-strawberry-fresh-cream-cake", 1), alt: "Whole Greek Yogurt Strawberry cake, front view", tone: "blush" },
      { src: galleryImage("greek-yogurt-strawberry-fresh-cream-cake", 2), alt: "Sliced cross-section showing strawberry and cream layers", tone: "cream" },
    ],
    filterTags: ["fruit"],
    pairsWith: ["dr-matcha-latte", "dr-peach-ade"],
  },
  {
    id: "wc-queens-carrot",
    slug: "queens-carrot-cake",
    name: "Queens Carrot",
    category: "whole-cakes",
    size: "large",
    shortDescription: "Moist carrot sponge with pecans, orange peel, and dense cream cheese.",
    description:
      "A moist carrot sponge with a delicate blend of mild carrots, nutty pecans, and zesty orange peel, generously layered with dense cream cheese.",
    flavorNotes: ["Carrot", "Pecan", "Orange peel", "Cream cheese"],
    ingredients: ["Carrots", "Pecans", "Orange peel", "Cream cheese frosting", "Fresh cream", "Eggs", "Sugar", "Flour", "Spices"],
    allergens: [...CREAM_ALLERGENS, "Tree Nuts (Pecan)"],
    storage: CREAM_STORAGE,
    servingInfo: CREAM_SERVING,
    shelfLife: CREAM_SHELF_LIFE,
    sizes: [
      { label: '6"', price: 60 },
      { label: '8"', price: 75 },
    ],
    image: { src: productImage("queens-carrot-cake"), alt: "Whole carrot cake with cream cheese frosting and pecan garnish", tone: "cream" },
    gallery: [{ src: galleryImage("queens-carrot-cake", 1), alt: "Queens Carrot cake, front view", tone: "cream" }],
    pairsWith: ["dr-spanish-latte", "dr-vanilla-latte"],
  },
  {
    id: "wc-mascarpone-mixed-berry",
    slug: "mascarpone-mixed-berry-cake",
    name: "Mascarpone Mixed Berry",
    category: "whole-cakes",
    size: "large",
    shortDescription: "Mascarpone whipped cream and strawberries in a white cake, sweet and tangy.",
    description:
      "A cake where mascarpone whipped cream and strawberries blend harmoniously within a white cake layer, offering a sweet and tangy delight.",
    flavorNotes: ["Mascarpone", "Mixed berry", "White cake"],
    ingredients: ["Mascarpone cheese", "Fresh cream", "Mixed berries", "Sponge cake", "Eggs", "Sugar", "Flour"],
    allergens: CREAM_ALLERGENS,
    storage: CREAM_STORAGE,
    servingInfo: CREAM_SERVING,
    shelfLife: CREAM_SHELF_LIFE,
    sizes: [
      { label: '6"', price: 62 },
      { label: '8"', price: 75 },
    ],
    image: { src: productImage("mascarpone-mixed-berry-cake"), alt: "Whole white cake topped with mixed berries", tone: "blush" },
    gallery: [{ src: galleryImage("mascarpone-mixed-berry-cake", 1), alt: "Mascarpone Mixed Berry cake, front view", tone: "blush" }],
    filterTags: ["fruit"],
    pairsWith: ["dr-matcha-latte", "dr-milk-tea"],
  },
  {
    id: "wc-strawberry-chocolate",
    slug: "strawberry-chocolate-fresh-cream-cake",
    name: "Strawberry Chocolate Fresh Cream",
    category: "whole-cakes",
    size: "large",
    shortDescription: "Fresh strawberries and crunchy chocolate balls between chocolate whipped cream.",
    description:
      "A best-selling cream cake with layers of fresh strawberries and crunchy chocolate balls nestled between chocolate whipped cream, providing a delightful crunch with every bite.",
    flavorNotes: ["Strawberry", "Belgian chocolate", "Crunch"],
    ingredients: ["Callebaut Belgian chocolate", "Fresh strawberries", "Chocolate whipped cream", "Crunchy chocolate pearls", "Sponge cake", "Eggs", "Sugar", "Flour"],
    allergens: CREAM_ALLERGENS,
    storage: CREAM_STORAGE,
    servingInfo: CREAM_SERVING,
    shelfLife: CREAM_SHELF_LIFE,
    sizes: [
      { label: '6"', price: 65 },
      { label: '8"', price: 78 },
    ],
    image: {
      src: productImage("strawberry-chocolate-fresh-cream-cake"),
      alt: "Whole chocolate cake with strawberries and chocolate pearls on top",
      tone: "chocolate",
    },
    gallery: [{ src: galleryImage("strawberry-chocolate-fresh-cream-cake", 1), alt: "Strawberry Chocolate Fresh Cream cake, front view", tone: "chocolate" }],
    filterTags: ["chocolate", "fruit"],
    pairsWith: ["dr-spanish-latte", "dr-americano"],
  },
  {
    id: "wc-triple-chocolate-mousse",
    slug: "triple-chocolate-mousse-cake",
    name: "Triple Chocolate Mousse",
    category: "whole-cakes",
    size: "large",
    shortDescription: "Dark, milk, and white Belgian chocolate mousse over a chocolate sponge.",
    description:
      "A premium chocolate mousse cake with smooth chocolate sponge, where dark, milk, and white chocolates blend together, allowing you to savor the rich chocolate flavor in every layer.",
    flavorNotes: ["Dark chocolate", "Milk chocolate", "White chocolate"],
    ingredients: ["Callebaut Belgian dark chocolate", "Callebaut Belgian milk chocolate", "Callebaut Belgian white chocolate", "Chocolate sponge", "Fresh cream", "Eggs", "Sugar"],
    allergens: CREAM_ALLERGENS,
    storage: CREAM_STORAGE,
    servingInfo: CREAM_SERVING,
    shelfLife: CREAM_SHELF_LIFE,
    sizes: [
      { label: '6"', price: 60 },
      { label: '8"', price: 75 },
    ],
    image: {
      src: productImage("triple-chocolate-mousse-cake"),
      alt: "Whole triple chocolate mousse cake with a glossy chocolate finish",
      tone: "chocolate",
    },
    gallery: [{ src: galleryImage("triple-chocolate-mousse-cake", 1), alt: "Triple Chocolate Mousse cake, front view", tone: "chocolate" }],
    filterTags: ["chocolate"],
    pairsWith: ["dr-spanish-latte", "dr-americano"],
  },

  // ---------------------------------------------------------------------
  // SPOON CAKES (small -> Quick View)
  // ---------------------------------------------------------------------
  {
    id: "sc-blueberry-greek-yogurt",
    slug: "blueberry-greek-yogurt-fresh-cream-spoon-cake",
    name: "Blueberry Greek Yogurt Fresh Cream",
    category: "spoon-cakes",
    size: "small",
    shortDescription: "Tangy berry coulis between rich Greek yogurt cream, topped with blueberry jam.",
    description:
      "A spoonable cake with tangy berry coulis sandwiched between rich Greek yogurt whipped cream and moist layers. Topped with plenty of blueberry jam.",
    ingredients: ["Blueberries", "Greek yogurt whipped cream", "Berry coulis", "Sponge cake", "Fresh cream", "Eggs", "Sugar"],
    allergens: CREAM_ALLERGENS,
    storage: CREAM_STORAGE,
    servingInfo: "Best enjoyed straight from the cup with a spoon, chilled.",
    shelfLife: CREAM_SHELF_LIFE,
    sizes: [{ label: "Piece", price: 12.45 }],
    image: {
      src: productImage("blueberry-greek-yogurt-fresh-cream-spoon-cake"),
      alt: "Cup of blueberry Greek yogurt spoon cake topped with blueberry jam",
      tone: "blush",
    },
    filterTags: ["fruit"],
    pairsWith: ["dr-matcha-latte"],
  },
  {
    id: "sc-mascarpone-strawberry",
    slug: "mascarpone-strawberry-fresh-cream-spoon-cake",
    name: "Mascarpone Strawberry Fresh Cream",
    category: "spoon-cakes",
    size: "small",
    shortDescription: "Soft mascarpone mousse topped with strawberry coulis and fresh strawberries.",
    description:
      "A special spoonable dessert filled with soft mascarpone mousse topped with strawberry coulis and fresh strawberries.",
    ingredients: ["Mascarpone cheese", "Fresh strawberries", "Strawberry coulis", "Sponge cake", "Fresh cream", "Eggs", "Sugar"],
    allergens: CREAM_ALLERGENS,
    storage: CREAM_STORAGE,
    servingInfo: "Best enjoyed straight from the cup with a spoon, chilled.",
    shelfLife: CREAM_SHELF_LIFE,
    sizes: [{ label: "Piece", price: 12.45 }],
    image: {
      src: productImage("mascarpone-strawberry-fresh-cream-spoon-cake"),
      alt: "Cup of mascarpone strawberry spoon cake with fresh strawberries on top",
      tone: "blush",
    },
    filterTags: ["fruit"],
    pairsWith: ["dr-peach-ade"],
  },
  {
    id: "sc-shine-muscat-greek-yogurt",
    slug: "shine-muscat-greek-yogurt-fresh-cream-spoon-cake",
    name: "Shine Muscat Greek Yogurt Fresh Cream",
    category: "spoon-cakes",
    size: "small",
    shortDescription: "Sweet-and-sour Shine Muscat coulis between moist layers and Greek yogurt cream.",
    description:
      "A scoopable cake filled with sweet and sour Shine Muscat coulis between moist, soft sheets and finished with rich Greek yogurt whipped cream.",
    ingredients: ["Shine Muscat grapes", "Greek yogurt whipped cream", "Grape coulis", "Sponge cake", "Fresh cream", "Eggs", "Sugar"],
    allergens: CREAM_ALLERGENS,
    storage: CREAM_STORAGE,
    servingInfo: "Best enjoyed straight from the cup with a spoon, chilled.",
    shelfLife: CREAM_SHELF_LIFE,
    sizes: [{ label: "Piece", price: 12.95 }],
    image: {
      src: productImage("shine-muscat-greek-yogurt-fresh-cream-spoon-cake"),
      alt: "Cup of Shine Muscat Greek yogurt spoon cake with grape garnish",
      tone: "cream",
    },
    filterTags: ["fruit"],
    pairsWith: ["dr-matcha-latte"],
  },
  {
    id: "sc-strawberry-chocolate",
    slug: "strawberry-chocolate-fresh-cream-spoon-cake",
    name: "Strawberry Chocolate Fresh Cream",
    category: "spoon-cakes",
    size: "small",
    shortDescription: "Fresh strawberries and crunchy chocolate balls between chocolate whipped cream.",
    description:
      "A best-selling cream cake with layers of fresh strawberries and crunchy chocolate balls nestled between chocolate whipped cream, providing a delightful crunch with every bite.",
    ingredients: ["Callebaut Belgian chocolate", "Fresh strawberries", "Chocolate whipped cream", "Crunchy chocolate pearls", "Sponge cake", "Eggs", "Sugar"],
    allergens: CREAM_ALLERGENS,
    storage: CREAM_STORAGE,
    servingInfo: "Best enjoyed straight from the cup with a spoon, chilled.",
    shelfLife: CREAM_SHELF_LIFE,
    sizes: [{ label: "Piece", price: 12.95 }],
    image: {
      src: productImage("strawberry-chocolate-fresh-cream-spoon-cake"),
      alt: "Cup of strawberry chocolate spoon cake with chocolate pearls",
      tone: "chocolate",
    },
    filterTags: ["chocolate", "fruit"],
    pairsWith: ["dr-spanish-latte"],
  },
  {
    id: "sc-ice-box-oreo",
    slug: "ice-box-oreo-spoon-cake",
    name: "Ice Box Oreo",
    category: "spoon-cakes",
    size: "small",
    shortDescription: "Layers of chocolate cookies stacked between mascarpone and cream cheese.",
    description:
      "A unique style of cake where layers of black cookies are stacked between mascarpone and cream cheese, creating a moist and smooth texture.",
    ingredients: ["Chocolate sandwich cookies", "Mascarpone cheese", "Cream cheese", "Fresh cream", "Sugar"],
    allergens: [...CREAM_ALLERGENS, "Soy"],
    storage: CREAM_STORAGE,
    servingInfo: "Best enjoyed straight from the cup with a spoon, chilled.",
    shelfLife: CREAM_SHELF_LIFE,
    sizes: [{ label: "Piece", price: 11.95 }],
    image: { src: productImage("ice-box-oreo-spoon-cake"), alt: "Cup of Ice Box Oreo spoon cake with cookie crumble on top", tone: "chocolate" },
    filterTags: ["chocolate"],
    pairsWith: ["dr-vanilla-latte"],
  },

  // ---------------------------------------------------------------------
  // BINGSU (small -> Quick View). 4 flavors are unreleased on the real
  // site (price "TBA" / "Coming Soon") -- reproduced faithfully below.
  // ---------------------------------------------------------------------
  {
    id: "bs-red-bean-injeolmi",
    slug: "red-bean-injeolmi-bingsu",
    name: "Red Bean Injeolmi",
    category: "bingsu",
    size: "small",
    shortDescription: "Smooth red bean paste and soybean powder over shaved milk ice.",
    description:
      "A refined fusion of traditional Korean flavors, with smooth red bean paste and soybean powder for a uniquely delightful taste.",
    ingredients: ["Shaved milk ice", "Sweet red bean paste", "Roasted soybean powder (injeolmi)", "Rice cake", "Condensed milk"],
    allergens: ["Milk", "Soy"],
    storage: "Best enjoyed immediately; not intended for storage.",
    servingInfo: "Shared dessert -- mix from the bottom up before serving for the best flavor in every bite.",
    shelfLife: "Same-day only.",
    sizes: [
      { label: "Regular", price: 16.9 },
      { label: "Family", price: 21.9 },
    ],
    image: {
      src: productImage("red-bean-injeolmi-bingsu"),
      alt: "Bowl of shaved ice bingsu topped with red bean paste and injeolmi powder",
      tone: "cream",
    },
    pairsWith: ["dr-milk-tea"],
  },
  {
    id: "bs-apple-mango",
    slug: "apple-mango-bingsu",
    name: "Apple Mango",
    category: "bingsu",
    size: "small",
    shortDescription: "Sweet cheesecake, creamy vanilla ice cream, and ripe mangoes.",
    description: "Apple mango (red mango) bingsu featuring sweet cheesecake, creamy vanilla ice cream, and ripe mangoes.",
    ingredients: ["Shaved milk ice", "Mango", "Cheesecake pieces", "Vanilla ice cream", "Condensed milk"],
    allergens: ["Milk", "Eggs"],
    storage: "Best enjoyed immediately; not intended for storage.",
    servingInfo: "Shared dessert -- mix from the bottom up before serving for the best flavor in every bite.",
    shelfLife: "Same-day only.",
    sizes: [
      { label: "Regular", price: 16.9 },
      { label: "Family", price: 21.9 },
    ],
    image: { src: productImage("apple-mango-bingsu"), alt: "Bowl of shaved ice bingsu topped with mango cubes and cheesecake", tone: "peach" },
    filterTags: ["fruit"],
    pairsWith: ["dr-peach-ade"],
  },
  {
    id: "bs-premium-strawberry",
    slug: "premium-strawberry-bingsu",
    name: "Premium Strawberry",
    category: "bingsu",
    size: "small",
    shortDescription: "Fresh strawberry, rich whipped cream, and smooth cheesecake.",
    description: "Fresh strawberry, rich whipped cream, and smooth cheesecake combined to create our signature strawberry bingsu.",
    ingredients: ["Shaved milk ice", "Fresh strawberries", "Cheesecake pieces", "Whipped cream", "Condensed milk"],
    allergens: ["Milk", "Eggs"],
    storage: "Best enjoyed immediately; not intended for storage.",
    servingInfo: "Shared dessert -- mix from the bottom up before serving for the best flavor in every bite.",
    shelfLife: "Same-day only.",
    sizes: [
      { label: "Regular", price: 16.9 },
      { label: "Family", price: 21.9 },
    ],
    image: {
      src: productImage("premium-strawberry-bingsu"),
      alt: "Bowl of shaved ice bingsu topped with fresh strawberries and whipped cream",
      tone: "blush",
    },
    filterTags: ["fruit"],
    pairsWith: ["dr-matcha-latte"],
  },
  {
    id: "bs-blueberry-cheese",
    slug: "blueberry-cheese-bingsu",
    name: "Blueberry Cheese",
    category: "bingsu",
    size: "small",
    shortDescription: "Blueberries, vanilla ice cream, and cheesecake -- the perfect combination.",
    description: "Blueberry cheese bingsu is the perfect combination of blueberries, vanilla ice cream, and cheesecake.",
    ingredients: ["Shaved milk ice", "Blueberries", "Cheesecake pieces", "Vanilla ice cream"],
    allergens: ["Milk", "Eggs"],
    storage: "Best enjoyed immediately; not intended for storage.",
    servingInfo: "Shared dessert -- mix from the bottom up before serving for the best flavor in every bite.",
    shelfLife: "Same-day only.",
    sizes: [
      { label: "Regular", price: null },
      { label: "Family", price: null },
    ],
    image: { src: productImage("blueberry-cheese-bingsu"), alt: "Bowl of shaved ice bingsu topped with blueberries", tone: "cream" },
    badges: ["coming-soon"],
    filterTags: ["fruit"],
  },
  {
    id: "bs-shine-muscat",
    slug: "shine-muscat-bingsu",
    name: "Shine Muscat",
    category: "bingsu",
    size: "small",
    shortDescription: "Tangy-sweet Shine Muscat grapes over smooth shaved ice.",
    description: "A refreshing dessert that harmonizes tangy-sweet Shine Muscat grapes with smooth shaved ice.",
    ingredients: ["Shaved milk ice", "Shine Muscat grapes", "Condensed milk"],
    allergens: ["Milk"],
    storage: "Best enjoyed immediately; not intended for storage.",
    servingInfo: "Shared dessert -- mix from the bottom up before serving for the best flavor in every bite.",
    shelfLife: "Same-day only.",
    sizes: [
      { label: "Regular", price: null },
      { label: "Family", price: null },
    ],
    image: { src: productImage("shine-muscat-bingsu"), alt: "Bowl of shaved ice bingsu topped with Shine Muscat grapes", tone: "cream" },
    badges: ["coming-soon"],
    filterTags: ["fruit", "seasonal"],
  },
  {
    id: "bs-strawberry-shine-muscat",
    slug: "strawberry-shine-muscat-bingsu",
    name: "Strawberry Shine Muscat",
    category: "bingsu",
    size: "small",
    shortDescription: "Sweet strawberries meet refreshing Shine Muscat grapes.",
    description: "Combination of the sweetness of strawberries with the refreshing flavor of Shine Muscat grapes for a delightful dessert experience.",
    ingredients: ["Shaved milk ice", "Fresh strawberries", "Shine Muscat grapes", "Condensed milk"],
    allergens: ["Milk"],
    storage: "Best enjoyed immediately; not intended for storage.",
    servingInfo: "Shared dessert -- mix from the bottom up before serving for the best flavor in every bite.",
    shelfLife: "Same-day only.",
    sizes: [
      { label: "Regular", price: null },
      { label: "Family", price: null },
    ],
    image: {
      src: productImage("strawberry-shine-muscat-bingsu"),
      alt: "Bowl of shaved ice bingsu topped with strawberries and Shine Muscat grapes",
      tone: "blush",
    },
    badges: ["coming-soon"],
    filterTags: ["fruit", "seasonal"],
  },
  {
    id: "bs-strawberry-red-bean",
    slug: "strawberry-red-bean-bingsu",
    name: "Strawberry Red Bean",
    category: "bingsu",
    size: "small",
    shortDescription: "A harmony of fresh strawberries and red beans.",
    description: "A harmony of fresh strawberries and red beans.",
    ingredients: ["Shaved milk ice", "Fresh strawberries", "Sweet red bean paste", "Condensed milk"],
    allergens: ["Milk"],
    storage: "Best enjoyed immediately; not intended for storage.",
    servingInfo: "Shared dessert -- mix from the bottom up before serving for the best flavor in every bite.",
    shelfLife: "Same-day only.",
    sizes: [
      { label: "Regular", price: null },
      { label: "Family", price: null },
    ],
    image: {
      src: productImage("strawberry-red-bean-bingsu"),
      alt: "Bowl of shaved ice bingsu topped with strawberries and red bean paste",
      tone: "blush",
    },
    badges: ["coming-soon"],
    filterTags: ["fruit"],
  },

  // ---------------------------------------------------------------------
  // DRINKS -- placeholder catalog. Not yet published on thepeachy.ca; the
  // Uber Eats reference page also could not be scraped (403). Seeded so the
  // pairing / Quick View / filter features have real data to demonstrate
  // against, per PLAN.md's own pairing examples. Replace with the client's
  // actual drinks menu when available.
  //
  // Exception: the three "Cream Café Latte" drinks below are real, published
  // Peachy menu items (confirmed via blogTO's coverage of the cafe and public
  // Uber Eats listings). Vanilla Bean Cream's $7 price is directly sourced;
  // Black Sesame and Dalgona are priced to match since they're the same
  // specialty-latte line, just with a different flavor mix-in -- their exact
  // published price wasn't independently confirmable at time of writing.
  // ---------------------------------------------------------------------
  {
    id: "dr-vanilla-bean-cream-latte",
    slug: "vanilla-bean-cream-cafe-latte",
    name: "Vanilla Bean Cream Café Latte",
    category: "drinks",
    size: "small",
    shortDescription: "Layered iced latte with real vanilla bean cream on top.",
    description:
      "The Peachy's signature latte -- strong, creamy espresso and milk served over ice, layered under a real vanilla bean cream. A balanced counterpart to our sweeter desserts.",
    ingredients: ["Espresso", "Milk", "Real vanilla bean cream"],
    allergens: ["Milk"],
    storage: "Best enjoyed immediately after preparation.",
    servingInfo: "Served iced.",
    shelfLife: "Made to order.",
    sizes: [{ label: "12oz", price: 7 }],
    image: {
      src: productImage("vanilla-bean-cream-cafe-latte"),
      alt: "Iced latte layered with real vanilla bean cream on top",
      tone: "cream",
    },
    badges: ["best-seller"],
    filterTags: ["best-seller", "coffee"],
    pairsWith: ["wc-strawberry-chocolate", "sc-mascarpone-strawberry"],
  },
  {
    id: "dr-black-sesame-cream-latte",
    slug: "black-sesame-cream-cafe-latte",
    name: "Black Sesame Cream Café Latte",
    category: "drinks",
    size: "small",
    shortDescription: "Rich creamy latte infused with bold black sesame flavor.",
    description:
      "Espresso and milk infused with toasted black sesame, finished with a rich sesame cream -- nutty, bold, and a favorite alongside our chocolate cakes.",
    ingredients: ["Espresso", "Milk", "Black sesame paste"],
    allergens: ["Milk", "Sesame"],
    storage: "Best enjoyed immediately after preparation.",
    servingInfo: "Served hot or iced.",
    shelfLife: "Made to order.",
    sizes: [{ label: "12oz", price: 7 }],
    image: {
      src: productImage("black-sesame-cream-cafe-latte"),
      alt: "Latte infused with black sesame, topped with black sesame cream",
      tone: "chocolate",
    },
    badges: ["best-seller"],
    filterTags: ["best-seller", "coffee"],
    pairsWith: ["wc-triple-chocolate-mousse", "sc-ice-box-oreo"],
  },
  {
    id: "dr-dalgona-cream-latte",
    slug: "dalgona-cream-cafe-latte",
    name: "Dalgona Cream Café Latte",
    category: "drinks",
    size: "small",
    shortDescription: "Rich creamy latte infused with sweet Dalgona coffee syrup.",
    description:
      "Espresso and milk swirled with sweet, whipped Dalgona coffee syrup for a rich, caramelized coffee flavor in every sip.",
    ingredients: ["Espresso", "Milk", "Dalgona coffee syrup"],
    allergens: ["Milk"],
    storage: "Best enjoyed immediately after preparation.",
    servingInfo: "Served hot or iced.",
    shelfLife: "Made to order.",
    sizes: [{ label: "12oz", price: 7 }],
    image: {
      src: productImage("dalgona-cream-cafe-latte"),
      alt: "Latte swirled with sweet whipped Dalgona coffee syrup",
      tone: "peach",
    },
    badges: ["best-seller"],
    filterTags: ["best-seller", "coffee"],
    pairsWith: ["wc-queens-carrot", "sc-shine-muscat-greek-yogurt"],
  },
  {
    id: "dr-spanish-latte",
    slug: "spanish-latte",
    name: "Spanish Latte",
    category: "drinks",
    size: "small",
    shortDescription: "Espresso with condensed milk, sweeter and creamier than a classic latte.",
    description: "Our espresso is balanced with condensed milk for a sweeter, silkier latte -- a perfect match for our richer chocolate cakes.",
    ingredients: ["Espresso", "Milk", "Condensed milk"],
    allergens: ["Milk"],
    storage: "Best enjoyed immediately after preparation.",
    servingInfo: "Served hot or iced.",
    shelfLife: "Made to order.",
    sizes: [{ label: "12oz", price: 6.25 }],
    image: { src: productImage("spanish-latte"), alt: "Spanish latte in a clear cup with layered milk and espresso", tone: "cream" },
    filterTags: ["coffee"],
    isPlaceholderContent: true,
  },
  {
    id: "dr-matcha-latte",
    slug: "matcha-latte",
    name: "Matcha Latte",
    category: "drinks",
    size: "small",
    shortDescription: "Stone-ground Japanese matcha whisked with silky steamed milk.",
    description: "Stone-ground Japanese matcha whisked with silky steamed milk -- earthy and lightly sweet, a favorite alongside our fruit-forward cakes.",
    ingredients: ["Matcha green tea powder", "Milk"],
    allergens: ["Milk"],
    storage: "Best enjoyed immediately after preparation.",
    servingInfo: "Served hot or iced.",
    shelfLife: "Made to order.",
    sizes: [{ label: "12oz", price: 6.75 }],
    image: { src: productImage("matcha-latte"), alt: "Matcha latte in a clear cup showing layered green tea and milk", tone: "cream" },
    isPlaceholderContent: true,
  },
  {
    id: "dr-peach-ade",
    slug: "peach-ade",
    name: "Peach Ade",
    category: "drinks",
    size: "small",
    shortDescription: "Sparkling peach-infused ade, light and refreshing.",
    description: "Sparkling, lightly sweet peach ade served over ice -- our signature refresher and a nod to the shop's name.",
    ingredients: ["Peach syrup", "Soda water", "Ice"],
    allergens: [],
    storage: "Best enjoyed immediately after preparation.",
    servingInfo: "Served iced.",
    shelfLife: "Made to order.",
    sizes: [{ label: "16oz", price: 6.5 }],
    image: { src: productImage("peach-ade"), alt: "Sparkling peach ade in a tall glass with ice and peach slices", tone: "peach" },
    filterTags: ["fruit"],
    isPlaceholderContent: true,
  },
  {
    id: "dr-milk-tea",
    slug: "milk-tea",
    name: "Milk Tea",
    category: "drinks",
    size: "small",
    shortDescription: "Classic black tea steeped strong and finished with creamy milk.",
    description: "Classic black tea steeped strong and finished with creamy milk -- a smooth, comforting match for our Korean-style desserts.",
    ingredients: ["Black tea", "Milk", "Sugar"],
    allergens: ["Milk"],
    storage: "Best enjoyed immediately after preparation.",
    servingInfo: "Served hot or iced.",
    shelfLife: "Made to order.",
    sizes: [{ label: "12oz", price: 5.95 }],
    image: { src: productImage("milk-tea"), alt: "Milk tea in a clear cup over ice", tone: "cream" },
    isPlaceholderContent: true,
  },
  {
    id: "dr-americano",
    slug: "americano",
    name: "Americano",
    category: "drinks",
    size: "small",
    shortDescription: "Double espresso lengthened with hot water for a clean, bold cup.",
    description: "Double espresso lengthened with hot water for a clean, bold cup -- a crisp counterpoint to our richest chocolate desserts.",
    ingredients: ["Espresso", "Water"],
    allergens: [],
    storage: "Best enjoyed immediately after preparation.",
    servingInfo: "Served hot or iced.",
    shelfLife: "Made to order.",
    sizes: [{ label: "12oz", price: 4.75 }],
    image: { src: productImage("americano"), alt: "Americano coffee in a clear cup", tone: "cream" },
    filterTags: ["coffee"],
    isPlaceholderContent: true,
  },
  {
    id: "dr-vanilla-latte",
    slug: "vanilla-latte",
    name: "Vanilla Latte",
    category: "drinks",
    size: "small",
    shortDescription: "Espresso and steamed milk sweetened with organic vanilla bean.",
    description: "Espresso and steamed milk sweetened with organic vanilla bean -- the same vanilla we use across our dessert menu.",
    ingredients: ["Espresso", "Milk", "Organic vanilla bean"],
    allergens: ["Milk"],
    storage: "Best enjoyed immediately after preparation.",
    servingInfo: "Served hot or iced.",
    shelfLife: "Made to order.",
    sizes: [{ label: "12oz", price: 6.25 }],
    image: { src: productImage("vanilla-latte"), alt: "Vanilla latte in a clear cup with milk foam", tone: "cream" },
    filterTags: ["coffee"],
    isPlaceholderContent: true,
  },

  // ---------------------------------------------------------------------
  // BAKERY -- placeholder catalog, see note above.
  // ---------------------------------------------------------------------
  {
    id: "bk-butter-croissant",
    slug: "butter-croissant",
    name: "Butter Croissant",
    category: "bakery",
    size: "small",
    shortDescription: "Laminated all-butter croissant, baked fresh daily.",
    description: "A classic all-butter croissant, laminated for a shatter-crisp exterior and soft, layered interior. Baked fresh daily.",
    ingredients: ["Butter", "Flour", "Yeast", "Milk", "Sugar"],
    allergens: ["Milk", "Wheat", "Eggs"],
    storage: "Best enjoyed same day at room temperature; store in a paper bag, not plastic.",
    servingInfo: "Delicious on its own or gently warmed for 3-4 minutes.",
    shelfLife: "1 day at room temperature.",
    sizes: [{ label: "Each", price: 4.95 }],
    image: { src: productImage("butter-croissant"), alt: "Golden butter croissant on a plate", tone: "cream" },
    isPlaceholderContent: true,
  },
  {
    id: "bk-choco-chip-cookie",
    slug: "chocolate-chip-cookie",
    name: "Chocolate Chip Cookie",
    category: "bakery",
    size: "small",
    shortDescription: "Thick, chewy cookie loaded with Belgian chocolate chunks.",
    description: "A thick, chewy cookie loaded with Callebaut Belgian chocolate chunks and a hint of sea salt.",
    ingredients: ["Callebaut Belgian chocolate", "Butter", "Flour", "Brown sugar", "Eggs", "Sea salt"],
    allergens: ["Milk", "Wheat", "Eggs"],
    storage: "Store in an airtight container at room temperature.",
    servingInfo: "Best enjoyed fresh; warm for 10 seconds for a gooey center.",
    shelfLife: "3 days at room temperature.",
    sizes: [{ label: "Each", price: 3.95 }],
    image: { src: productImage("chocolate-chip-cookie"), alt: "Chocolate chip cookie loaded with chocolate chunks", tone: "chocolate" },
    filterTags: ["chocolate"],
    isPlaceholderContent: true,
  },
  {
    id: "bk-earl-grey-macaron",
    slug: "earl-grey-macaron",
    name: "Earl Grey Macaron",
    category: "bakery",
    size: "small",
    shortDescription: "Delicate almond shells filled with Earl Grey buttercream.",
    description: "Delicate almond meringue shells sandwiched around a fragrant Earl Grey buttercream.",
    ingredients: ["Almond flour", "Egg whites", "Sugar", "Butter", "Earl Grey tea"],
    allergens: ["Tree Nuts (Almond)", "Eggs", "Milk"],
    storage: "Keep refrigerated; bring to room temperature 10 minutes before serving.",
    servingInfo: "Best served at room temperature.",
    shelfLife: "3 days refrigerated.",
    sizes: [{ label: "Each", price: 2.75 }],
    image: { src: productImage("earl-grey-macaron"), alt: "Earl Grey macaron on a small plate", tone: "blush" },
    isPlaceholderContent: true,
  },
  {
    id: "bk-red-velvet-cookie",
    slug: "red-velvet-cookie",
    name: "Red Velvet Cookie",
    category: "bakery",
    size: "small",
    shortDescription: "Soft red velvet cookie with white chocolate chunks and cream cheese swirl.",
    description: "A soft, cocoa-forward red velvet cookie studded with white chocolate chunks and a cream cheese swirl.",
    ingredients: ["Cocoa", "White chocolate", "Cream cheese", "Butter", "Flour", "Eggs"],
    allergens: ["Milk", "Wheat", "Eggs"],
    storage: "Store in an airtight container at room temperature.",
    servingInfo: "Best enjoyed fresh.",
    shelfLife: "3 days at room temperature.",
    sizes: [{ label: "Each", price: 3.95 }],
    image: { src: productImage("red-velvet-cookie"), alt: "Red velvet cookie with white chocolate chunks", tone: "blush" },
    filterTags: ["chocolate"],
    isPlaceholderContent: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export function getPairings(product: Product): Product[] {
  if (!product.pairsWith) return [];
  return product.pairsWith
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);
}
