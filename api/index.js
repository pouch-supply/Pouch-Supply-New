// serverApp.ts
import express from "express";
import path2 from "path";

// serverDb.ts
import fs from "fs";
import path from "path";
import dotenv2 from "dotenv";
import mongoose2 from "mongoose";

// src/initialData.ts
var INITIAL_PRODUCTS = [
  {
    id: "77-black-tea",
    title: "77 Black Tea 10.4 mg",
    description: "A robust and elegant blend of cured black tea leaves with a touch of deep botanical notes. Formulated with top-tier active compounds.",
    price: 4.8,
    compareAtPrice: 5.5,
    inventory: 154,
    sku: "77-BLK-TEA-10",
    category: "Botanical",
    vendor: "77",
    status: "Active",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80",
    weight: 15,
    tags: ["77", "bestseller", "black-tea", "strong"],
    slug: "77-black-tea",
    variants: [
      { id: "v1", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "77-cola-cherry",
    title: "77 Cola & Cherry 10.4 mg",
    description: "Spirited, fizzy cola notes offset by sweet, ripe wild cherries. A nostalgic and refreshing sensory release.",
    price: 4.8,
    compareAtPrice: 5.5,
    inventory: 92,
    sku: "77-COLA-CHERRY-10",
    category: "Fruit & Cola",
    vendor: "77",
    status: "Active",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    weight: 15,
    tags: ["77", "cola", "cherry"],
    slug: "77-cola-cherry",
    variants: [
      { id: "v2", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "77-watermelon",
    title: "77 Watermelon 5.2 mg",
    description: "Crisp, summery watermelon with moderate active mg concentration. Pure sweetness with balanced moisture levels.",
    price: 4.5,
    compareAtPrice: 5.2,
    inventory: 240,
    sku: "77-WMLN-5",
    category: "Fruit",
    vendor: "77",
    status: "Active",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80",
    weight: 15,
    tags: ["77", "watermelon", "fruit"],
    slug: "77-watermelon",
    variants: [
      { id: "v3", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "77-raspberry",
    title: "77 Raspberry 5.2 mg",
    description: "Delectable and juicy field-grown raspberries with a soft throat bite. Perfect for daily active refreshment.",
    price: 4.5,
    compareAtPrice: 5.2,
    inventory: 110,
    sku: "77-RAS-5",
    category: "Fruit",
    vendor: "77",
    status: "Active",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    weight: 15,
    tags: ["77", "raspberry", "fruit"],
    slug: "77-raspberry",
    variants: [
      { id: "v4", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "77-melon-mint",
    title: "77 Melon Mint 5.2 mg",
    description: "A chilled fusion of sweet honeydew melon sliced with crisp peppermint crystals.",
    price: 4.6,
    compareAtPrice: 5.3,
    inventory: 185,
    sku: "77-MEL-MNT-5",
    category: "Mint & Fruit",
    vendor: "77",
    status: "Active",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=400&q=80",
    weight: 15,
    tags: ["77", "melon", "mint"],
    slug: "77-melon-mint",
    variants: [
      { id: "v5", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "77-ice-mint",
    title: "77 Ice Mint 20 mg",
    description: "An aggressive, deep-freeze formulation of sub-zero menthol crystals designed for experienced consumers.",
    price: 4.9,
    compareAtPrice: 5.8,
    inventory: 310,
    sku: "77-ICE-MNT-20",
    category: "Mint",
    vendor: "77",
    status: "Active",
    image: "https://images.unsplash.com/photo-1599305090598-615257902657?auto=format&fit=crop&w=400&q=80",
    weight: 15,
    tags: ["77", "ice", "mint", "strong"],
    slug: "77-ice-mint",
    variants: [
      { id: "v6", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "77-forest-fruits",
    title: "77 Forest Fruits 5.2 mg",
    description: "Wild forest berries\u2014redcurrants, blackberries, and blueberries\u2014intertwined for an organic tart flavour.",
    price: 4.5,
    compareAtPrice: 5.2,
    inventory: 145,
    sku: "77-FRST-FRT-5",
    category: "Fruit",
    vendor: "77",
    status: "Active",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    weight: 15,
    tags: ["77", "forest", "fruit"],
    slug: "77-forest-fruits",
    variants: [
      { id: "v7", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "77-ghost-onion",
    title: "77 Ghost Onion 20 mg",
    description: "An intriguing, highly experimental compilation flavor combining trace onion essence with sweet, hot spice.",
    price: 5.2,
    compareAtPrice: 6,
    inventory: 45,
    sku: "77-GHST-ON-20",
    category: "Savory & Unique",
    vendor: "77",
    status: "Active",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    weight: 15,
    tags: ["77", "onion", "savory", "new-arrivals"],
    slug: "77-ghost-onion",
    variants: [
      { id: "v8", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "cuba-watermelon",
    title: "CUBA Watermelon 43 mg",
    description: "Extreme-strength dark pouch formulation of deep watermelon candy notes. Intense release, strictly for heavy users.",
    price: 4.9,
    compareAtPrice: 5.9,
    inventory: 104,
    sku: "CUBA-WMLN-43",
    category: "Fruit & Strong",
    vendor: "CUBA",
    status: "Active",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80",
    weight: 18,
    tags: ["cuba", "watermelon", "bestseller", "strong"],
    slug: "cuba-watermelon",
    variants: [
      { id: "v9", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "cuba-tropical",
    title: "CUBA Tropical Fruit 43 mg",
    description: "Passion fruit, mango, and tangy pineapple pressed with heavy active mg elements. Rich tropical breeze.",
    price: 4.9,
    compareAtPrice: 5.9,
    inventory: 120,
    sku: "CUBA-TRP-43",
    category: "Fruit & Strong",
    vendor: "CUBA",
    status: "Active",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80",
    weight: 18,
    tags: ["cuba", "tropical", "strong"],
    slug: "cuba-tropical",
    variants: [
      { id: "v10", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "cuba-yoghurt",
    title: "CUBA Yoghurt 43 mg",
    description: "A highly unusual, velvety compilation featuring greek yoghurt creaminess paired with cold high-intensity active compounds.",
    price: 5,
    compareAtPrice: 6,
    inventory: 74,
    sku: "CUBA-YOG-43",
    category: "Creamy & Strong",
    vendor: "CUBA",
    status: "Active",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    weight: 18,
    tags: ["cuba", "yoghurt", "creamy", "strong"],
    slug: "cuba-yoghurt",
    variants: [
      { id: "v11", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "cuba-double-fresh",
    title: "CUBA Double Fresh 43 mg",
    description: "Double shot of crisp wintergreen menthol paired with heavy active release. Maximum kick.",
    price: 4.9,
    compareAtPrice: 5.9,
    inventory: 195,
    sku: "CUBA-DBL-43",
    category: "Mint & Strong",
    vendor: "CUBA",
    status: "Active",
    image: "https://images.unsplash.com/photo-1599305090598-615257902657?auto=format&fit=crop&w=400&q=80",
    weight: 18,
    tags: ["cuba", "double", "fresh", "strong"],
    slug: "cuba-double-fresh",
    variants: [
      { id: "v12", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "cuba-cherry",
    title: "CUBA Cherry 43 mg",
    description: "Sweet, rich dark cherries matching the heavy, slower salivary compounding standard of CUBA pouches.",
    price: 4.9,
    compareAtPrice: 5.9,
    inventory: 132,
    sku: "CUBA-CHRY-43",
    category: "Fruit & Strong",
    vendor: "CUBA",
    status: "Active",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80",
    weight: 18,
    tags: ["cuba", "cherry", "strong"],
    slug: "cuba-cherry",
    variants: [
      { id: "v13", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "cuba-banana-hit",
    title: "CUBA Banana Hit 43 mg",
    description: "Creamy, sweet foam banana infusion with intensive extreme active vectors. A robust sweet treat.",
    price: 5.1,
    compareAtPrice: 6.2,
    inventory: 88,
    sku: "CUBA-BANA-43",
    category: "Fruit & Strong",
    vendor: "CUBA",
    status: "Active",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80",
    weight: 18,
    tags: ["cuba", "banana", "strong", "new-arrivals"],
    slug: "cuba-banana-hit",
    variants: [
      { id: "v14", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "clew-watermelon",
    title: "CLEW Watermelon 5 mg",
    description: "Light, gentle active concentration wrapped in slim, soft-fibre organic bags. Clean fruit essence.",
    price: 3.9,
    compareAtPrice: 4.8,
    inventory: 250,
    sku: "CLEW-WMLN-5",
    category: "Fruit Lite",
    vendor: "CLEW",
    status: "Active",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80",
    weight: 12,
    tags: ["clew", "watermelon", "bestseller", "light"],
    slug: "clew-watermelon",
    variants: [
      { id: "v15", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "clew-spearmint",
    title: "CLEW Spearmint 5 mg",
    description: "Crisp spearmint leaves giving off a gentle sweet herbal coolness. Zero harshness.",
    price: 3.9,
    compareAtPrice: 4.8,
    inventory: 180,
    sku: "CLEW-SPR-5",
    category: "Mint Lite",
    vendor: "CLEW",
    status: "Active",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    weight: 12,
    tags: ["clew", "spearmint", "mint", "light"],
    slug: "clew-spearmint",
    variants: [
      { id: "v16", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "clew-cool-mint",
    title: "CLEW Cool Mint 20 mg",
    description: "The highest-intensity CLEW variant: a robust cooling peppermint blast in a slim clean pouch.",
    price: 4.1,
    compareAtPrice: 4.9,
    inventory: 164,
    sku: "CLEW-MNT-20",
    category: "Mint",
    vendor: "CLEW",
    status: "Active",
    image: "https://images.unsplash.com/photo-1599305090598-615257902657?auto=format&fit=crop&w=400&q=80",
    weight: 12,
    tags: ["clew", "cool", "mint"],
    slug: "clew-cool-mint",
    variants: [
      { id: "v17", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "clew-coffee",
    title: "CLEW Coffee 5 mg",
    description: "A smooth, rich dark-roasted espresso note with an elegant, velvety cream finish.",
    price: 4,
    compareAtPrice: 4.85,
    inventory: 90,
    sku: "CLEW-COF-5",
    category: "Savory & Unique",
    vendor: "CLEW",
    status: "Active",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    weight: 12,
    tags: ["clew", "coffee", "savory", "new-arrivals"],
    slug: "clew-coffee",
    variants: [
      { id: "v18", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "killa-cold-mint",
    title: "KILLA Cold Mint 16 mg",
    description: "The legendary premium menthol standard from Siberia. Consistent release, clean composition.",
    price: 4.6,
    compareAtPrice: 5.4,
    inventory: 410,
    sku: "KLA-ICE-16",
    category: "Mint Strong",
    vendor: "KILLA",
    status: "Active",
    image: "https://images.unsplash.com/photo-1599305090598-615257902657?auto=format&fit=crop&w=400&q=80",
    weight: 16,
    tags: ["killa", "cold", "mint", "strong"],
    slug: "killa-cold-mint",
    variants: [
      { id: "v19", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "killa-blueberry",
    title: "KILLA Blueberry 16 mg",
    description: "Wild siberian blueberries blended with classic sub-zero cooling. Rich, sweet, and strong.",
    price: 4.6,
    compareAtPrice: 5.4,
    inventory: 230,
    sku: "KLA-BLUE-16",
    category: "Fruit Strong",
    vendor: "KILLA",
    status: "Active",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=400&q=80",
    weight: 16,
    tags: ["killa", "blueberry", "strong"],
    slug: "killa-blueberry",
    variants: [
      { id: "v20", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  },
  {
    id: "velo-freeze",
    title: "VELO Freeze Max 17 mg",
    description: "Peppermint and freezing menthol paired with high bio-active release speeds. The premium UK favorite.",
    price: 5.5,
    compareAtPrice: 6.5,
    inventory: 350,
    sku: "VELO-FRZ-17",
    category: "Mint Strong",
    vendor: "VELO",
    status: "Active",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=400&q=80",
    weight: 16,
    tags: ["velo", "freeze", "bestseller", "strong"],
    slug: "velo-freeze",
    variants: [
      { id: "v21", name: "Pack Size", values: ["Single Can", "5-Pack (Save 10%)", "10-Pack (Save 20%)"] }
    ]
  }
];
var INITIAL_COLLECTIONS = [
  {
    id: "all",
    title: "Shop All Pouches",
    description: "Browse the entire world-class compounding catalog of certified pouches.",
    type: "Smart",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=500&q=80",
    productIds: [
      "77-black-tea",
      "77-cola-cherry",
      "77-watermelon",
      "77-raspberry",
      "77-melon-mint",
      "77-ice-mint",
      "77-forest-fruits",
      "77-ghost-onion",
      "cuba-watermelon",
      "cuba-tropical",
      "cuba-yoghurt",
      "cuba-double-fresh",
      "cuba-cherry",
      "cuba-banana-hit",
      "clew-watermelon",
      "clew-spearmint",
      "clew-cool-mint",
      "clew-coffee",
      "killa-cold-mint",
      "killa-blueberry",
      "velo-freeze"
    ],
    slug: "all"
  },
  {
    id: "77",
    title: "77 Collection",
    description: "Sleek and versatile botanical pouch compounds of varying active counts.",
    type: "Manual",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=500&q=80",
    productIds: ["77-black-tea", "77-cola-cherry", "77-watermelon", "77-raspberry", "77-melon-mint", "77-ice-mint", "77-forest-fruits", "77-ghost-onion"],
    slug: "77"
  },
  {
    id: "cuba",
    title: "CUBA Collection",
    description: "High-intensity heavy compilation lines designed for extreme conditions.",
    type: "Manual",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=500&q=80",
    productIds: ["cuba-watermelon", "cuba-tropical", "cuba-yoghurt", "cuba-double-fresh", "cuba-cherry", "cuba-banana-hit"],
    slug: "cuba"
  },
  {
    id: "clew",
    title: "CLEW Collection",
    description: "Light, organic, soft-acting compounds featuring delicate infusions.",
    type: "Manual",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80",
    productIds: ["clew-watermelon", "clew-spearmint", "clew-cool-mint", "clew-coffee"],
    slug: "clew"
  },
  {
    id: "killa",
    title: "KILLA & VELO Collection",
    description: "Siberian cold line-ups and global bestseller high-strength standards.",
    type: "Manual",
    image: "https://images.unsplash.com/photo-1599305090598-615257902657?auto=format&fit=crop&w=500&q=80",
    productIds: ["killa-cold-mint", "killa-blueberry", "velo-freeze"],
    slug: "killa"
  },
  {
    id: "bestseller",
    title: "Bestseller",
    description: "Highly demanded, fastest circulating lines with exceptional customer scores.",
    type: "Smart",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=500&q=80",
    productIds: ["77-black-tea", "cuba-watermelon", "velo-freeze", "clew-watermelon"],
    slug: "bestseller"
  },
  {
    id: "best-seller",
    title: "Best Seller",
    description: "Fast moving popular catalog items.",
    type: "Smart",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=500&q=80",
    productIds: ["77-black-tea", "cuba-watermelon", "velo-freeze", "clew-watermelon"],
    slug: "best-seller"
  },
  {
    id: "new-arrivals",
    title: "New Arrivals",
    description: "Formulated and cataloged fresh compounds off the manufacturing floor.",
    type: "Smart",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80",
    productIds: ["77-ghost-onion", "cuba-banana-hit", "clew-coffee"],
    slug: "new-arrivals"
  }
];
var INITIAL_ORDERS = [
  {
    id: "CT48884",
    customerName: "Kayla Canty",
    customerEmail: "kayla@pouchclub.co.uk",
    tags: ["Compounded Pouch", "Loyalty Tier"],
    fulfillmentStatus: "Delivered",
    total: 24.3,
    destination: "United Kingdom",
    date: "Jun 22, 2026 at 4:18 pm",
    deliveryMethod: "Royal Mail Tracked 24",
    items: [
      {
        productId: "velo-freeze",
        productTitle: "VELO Freeze Max 17 mg",
        price: 5.5,
        quantity: 3,
        image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=150&q=80"
      },
      {
        productId: "77-black-tea",
        productTitle: "77 Black Tea 10.4 mg",
        price: 4.8,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=150&q=80"
      }
    ]
  }
];
var INITIAL_FILES = [
  {
    id: "file-1",
    fileName: "black-tea-box.png",
    altText: "Sleek dark circular tea composite can",
    dateAdded: "Jun 20, 2026",
    size: "142 KB",
    references: "Used on 77 Black Tea product pages",
    url: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "file-2",
    fileName: "cuba-watermelon.png",
    altText: "Vivid red high concentration 43mg tin",
    dateAdded: "Jun 22, 2026",
    size: "188 KB",
    references: "Used on CUBA Watermelon product pages",
    url: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=400&q=80"
  }
];
var INITIAL_CUSTOMERS = [
  {
    id: "cust-1",
    name: "James Mercer",
    email: "james@pouch-supply.com",
    subscriptionStatus: "Not subscribed",
    location: "United Kingdom",
    ordersCount: 1,
    amountSpent: 24,
    addresses: ["12 Baker St, London NW1 6XE, United Kingdom"],
    wishlist: []
  },
  {
    id: "cust-2",
    name: "Clara Sterling",
    email: "clara@pouch-supply.com",
    subscriptionStatus: "Subscribed",
    location: "United Kingdom",
    ordersCount: 3,
    amountSpent: 114.5,
    addresses: ["77 Princes St, Edinburgh EH2 2ER, United Kingdom"],
    wishlist: ["clew-spearmint"]
  },
  {
    id: "cust-3",
    name: "Sarah Jenkins",
    email: "sarah@pouch-supply.com",
    subscriptionStatus: "Unsubscribed",
    location: "United Kingdom",
    ordersCount: 0,
    amountSpent: 0,
    addresses: [],
    wishlist: []
  },
  {
    id: "cust-4",
    name: "Kayla Canty",
    email: "kayla@pouchclub.co.uk",
    subscriptionStatus: "Subscribed",
    location: "United Kingdom",
    ordersCount: 4,
    amountSpent: 82.5,
    addresses: ["42 Primrose Lane, Birmingham B15 2QX, United Kingdom"],
    wishlist: ["velo-freeze", "77-black-tea"]
  }
];
var INITIAL_DISCOUNTS = [
  {
    id: "disc-1",
    title: "CRUSHCLUB15",
    status: "Active",
    method: "Code",
    eligibility: "All customers",
    type: "Amount off products",
    used: 42,
    details: "15% off subscription boxes and standard pouch packs"
  },
  {
    id: "disc-2",
    title: "FREESHIP",
    status: "Active",
    method: "Code",
    eligibility: "All customers",
    type: "Free shipping",
    used: 120,
    details: "Free tracked delivery for order weights above 100g"
  }
];
var INITIAL_BLOGS = [
  {
    id: "b1",
    title: "The Science of pH in Compounding Nicotine Pouches",
    slug: "the-science-of-ph-in-compounding-nicotine-pouches",
    excerpt: "How alkaline modifiers like sodium carbonate affect bioavailability and sensory release parameters.",
    content: `Nicotine absorption through oral mucosa relies heavily on pH levels. Raw nicotine salts are typically acidic, which slows physiological uptake. 

By strategically introducing safe, food-grade alkaline modifiers\u2014such as sodium carbonate and sodium bicarbonate\u2014manufacturers balance compound stability. This chemistry stabilizes chemical vectors and ensures a premium, controlled salivary absorption curve.

### Cellular Transport Mechanism
Our research indicates that freebase structures cross mucosal barriers around 400% more rapidly than ionized counterparts. Maintaining a steady compound pH of 7.8 to 8.2 yields an optimal sensorial release without chemical deterioration of natural organic materials inside the pouch.`,
    category: "Chemistry & Science",
    status: "Active",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=500&q=80",
    author: "Dr. Marcus Vance",
    publishedAt: "Jun 20, 2026",
    readTime: "6 min read",
    tags: ["pH balance", "bioavailability", "organic-chemistry"]
  },
  {
    id: "b2",
    title: "Which Nicotine Strength is Right for You? A Clinician Guide",
    slug: "which-nicotine-strength-is-right-for-you-a-clinician-guide",
    excerpt: "Navigating active mg counts from soft 5mg CLEW pouches to extreme 43mg CUBA canisters safely.",
    content: `Selecting the right compounds can make an immense difference in your long-term success of vaping/smoking cessation models.

For light social patterns, we highly advise starting with lighter formulations (e.g., 5.0 mg to 10.0 mg counts typical of CLEW and 77 entry-level lines). These lighter formulations deliver clean organic flavor notes without sudden salivary saturation peaks.

### High Strength Parameters
Advanced clients accustomed to high-count compounds typically navigate toward KILLA (16.0 mg) or premium CUBA (43.0 mg) canisters. However, high active counts require disciplined holding times and proper salivation controls to avoid throat bite.`,
    category: "Buying Guides",
    status: "Active",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=500&q=80",
    author: "Clara Oswald, RPh",
    publishedAt: "Jun 18, 2026",
    readTime: "8 min read",
    tags: ["buying-advice", "cuba-strength", "pouch-science"]
  }
];
var INITIAL_PRODUCTS = [];
var INITIAL_COLLECTIONS = [];
var INITIAL_ORDERS = [];
var INITIAL_FILES = [];
var INITIAL_CUSTOMERS = [];
var INITIAL_DISCOUNTS = [];
var INITIAL_BLOGS = [];
var DEFAULT_PAGES = [
  {
    id: "homepage",
    title: "Home Page",
    slug: "",
    visibility: "Visible",
    updatedAt: "Jun 23, 2026",
    isHomepage: true,
    sections: [
      {
        id: "h-s1",
        type: "Image banner",
        settings: {
          fullWidth: true,
          backgroundColor: "#111827",
          headingColor: "#FFFFFF",
          textColor: "#E5E7EB",
          title: "Pouch Supply Storefront",
          description: "Start managing your products, collections, and page sections inside the Admin Dashboard.",
          buttonText: "View Store Catalog",
          buttonLink: "frontend-shop",
          imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80"
        }
      }
    ]
  },
  {
    id: "subscribe",
    title: "Subscription Builder",
    slug: "subscribe",
    visibility: "Visible",
    updatedAt: "Jun 23, 2026",
    sections: [
      {
        id: "s1",
        type: "Rich text",
        settings: {
          fullWidth: false,
          backgroundColor: "#FFFFFF",
          headingColor: "#1E293B",
          textColor: "#64748B",
          title: "Custom Subscription Plans",
          description: "Access premium rates on your favorite products. Create a customized subscription box, select your automatic replenishment frequency, and modify or cancel anytime."
        }
      }
    ]
  },
  {
    id: "brands",
    title: "Brands Directory",
    slug: "brands",
    visibility: "Visible",
    updatedAt: "Jun 23, 2026",
    sections: [
      {
        id: "s2",
        type: "Rich text",
        settings: {
          fullWidth: false,
          backgroundColor: "#FFFFFF",
          headingColor: "#1E293B",
          textColor: "#64748B",
          title: "Official Brands Matrix",
          description: "Explore our catalog of certified compounding premium brands retrieved directly from our synchronized database."
        }
      }
    ]
  }
];

// mongooseDb.ts
import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";
dotenv.config();
function cleanUri(uri) {
  if (!uri) return "";
  let cleaned = uri.trim();
  if (cleaned.startsWith('"') && cleaned.endsWith('"') || cleaned.startsWith("'") && cleaned.endsWith("'")) {
    cleaned = cleaned.substring(1, cleaned.length - 1).trim();
  }
  return cleaned;
}
function escapeMongoUri(uri) {
  try {
    uri = cleanUri(uri);
    const schemeIndex = uri.indexOf("://");
    if (schemeIndex === -1) return uri;
    const credentialsAndHost = uri.substring(schemeIndex + 3);
    const atIndex = credentialsAndHost.lastIndexOf("@");
    if (atIndex === -1) return uri;
    const credentials = credentialsAndHost.substring(0, atIndex);
    const hostAndRest = credentialsAndHost.substring(atIndex + 1);
    const colonIndex = credentials.indexOf(":");
    if (colonIndex === -1) return uri;
    const username = credentials.substring(0, colonIndex);
    const password = credentials.substring(colonIndex + 1);
    let decodedUsername = username;
    try {
      decodedUsername = decodeURIComponent(username);
    } catch (e) {
    }
    const encodedUsername = encodeURIComponent(decodedUsername);
    let decodedPassword = password;
    try {
      decodedPassword = decodeURIComponent(password);
    } catch (e) {
    }
    const encodedPassword = encodeURIComponent(decodedPassword);
    const scheme = uri.substring(0, schemeIndex + 3);
    return `${scheme}${encodedUsername}:${encodedPassword}@${hostAndRest}`;
  } catch (err) {
    console.error("[Mongoose Configuration] Failed to auto-escape URI:", err);
    return uri;
  }
}
function getHostFromUri(uri) {
  try {
    uri = cleanUri(uri);
    const sIndex = uri.indexOf("://");
    if (sIndex === -1) return "";
    const part = uri.substring(sIndex + 3);
    const atIndex = part.lastIndexOf("@");
    const hostWithQuery = atIndex !== -1 ? part.substring(atIndex + 1) : part;
    const slashIndex = hostWithQuery.indexOf("/");
    const hostPlusPort = slashIndex !== -1 ? hostWithQuery.substring(0, slashIndex) : hostWithQuery;
    const quesIndex = hostPlusPort.indexOf("?");
    return quesIndex !== -1 ? hostPlusPort.substring(0, quesIndex) : hostPlusPort;
  } catch (e) {
    return "";
  }
}
var ProductSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String },
  price: { type: Number },
  description: { type: String }
}, { strict: false, timestamps: true });
var CollectionSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });
var OrderSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });
var FileSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });
var CustomerSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });
var DiscountSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });
var CustomPageSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });
var BlogSchema = new Schema({
  id: { type: String, required: true, unique: true }
}, { strict: false, timestamps: true });
var UploadedImageSchema = new Schema({
  id: { type: String, required: true, unique: true },
  base64Data: { type: String, required: true },
  mimeType: { type: String, required: true }
}, { strict: false });
var ProductModel = mongoose.models.Product || mongoose.model("Product", ProductSchema, "products");
var CollectionModel = mongoose.models.Collection || mongoose.model("Collection", CollectionSchema, "collections");
var OrderModel = mongoose.models.Order || mongoose.model("Order", OrderSchema, "orders");
var FileModel = mongoose.models.File || mongoose.model("File", FileSchema, "files");
var CustomerModel = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema, "customers");
var DiscountModel = mongoose.models.Discount || mongoose.model("Discount", DiscountSchema, "discounts");
var CustomPageModel = mongoose.models.CustomPage || mongoose.model("CustomPage", CustomPageSchema, "custompages");
var BlogModel = mongoose.models.Blog || mongoose.model("Blog", BlogSchema, "blogs");
var UploadedImageModel = mongoose.models.UploadedImage || mongoose.model("UploadedImage", UploadedImageSchema, "uploaded_images");
var lastConnectionStatus = { status: "pending" };
var connectPromise = null;
var lastConnectErrorTime = 0;
var CONNECT_COOLDOWN = 15e3;
function getMongooseStatus() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return { status: "not-configured" };
  }
  const host = getHostFromUri(uri);
  return {
    ...lastConnectionStatus,
    uriHost: host || void 0
  };
}
function resetConnection() {
  if (mongoose.connection.readyState !== 0) {
    mongoose.disconnect().catch(() => {
    });
  }
  connectPromise = null;
  lastConnectionStatus = { status: "pending" };
}
async function connectMongoose() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    lastConnectionStatus = { status: "not-configured" };
    return null;
  }
  if (mongoose.connection.readyState === 1) {
    lastConnectionStatus = { status: "connected" };
    return mongoose;
  }
  if (Date.now() - lastConnectErrorTime < CONNECT_COOLDOWN) {
    return null;
  }
  if (connectPromise) {
    return connectPromise;
  }
  const escapedUri = escapeMongoUri(uri);
  connectPromise = (async () => {
    try {
      const conn = await mongoose.connect(escapedUri, {
        serverSelectionTimeoutMS: 3e3,
        connectTimeoutMS: 4e3
      });
      lastConnectionStatus = { status: "connected" };
      return conn;
    } catch (error) {
      const errorStr = String(error?.stack || error?.message || error || "");
      const isSslAlert = errorStr.includes("ssl3_read_bytes") || errorStr.includes("alert number 80") || errorStr.includes("alert(80)") || errorStr.includes("SSL alert number 80") || errorStr.includes("ERR_SSL_") || errorStr.includes("MongoServerSelectionError") && (errorStr.includes("alert") || errorStr.includes("SSL") || errorStr.includes("tls") || errorStr.includes("handshake"));
      const isDnsError = errorStr.includes("ENOTFOUND") || errorStr.includes("EAI_AGAIN") || errorStr.includes("dns") || errorStr.includes("getaddrinfo");
      lastConnectionStatus = {
        status: "error",
        error: errorStr,
        isSslAlert,
        isDnsError
      };
      lastConnectErrorTime = Date.now();
      connectPromise = null;
      return null;
    }
  })();
  return connectPromise;
}

// serverDb.ts
dotenv2.config();
var memoryCache = {
  products: [...INITIAL_PRODUCTS],
  collections: [...INITIAL_COLLECTIONS],
  orders: [...INITIAL_ORDERS],
  files: [...INITIAL_FILES],
  customers: [...INITIAL_CUSTOMERS],
  discounts: [...INITIAL_DISCOUNTS],
  customPages: [...DEFAULT_PAGES],
  blogs: [...INITIAL_BLOGS]
};
function getModelForResource(resource) {
  switch (resource) {
    case "products":
      return ProductModel;
    case "collections":
      return CollectionModel;
    case "orders":
      return OrderModel;
    case "files":
      return FileModel;
    case "customers":
      return CustomerModel;
    case "discounts":
      return DiscountModel;
    case "customPages":
    case "custompages":
      return CustomPageModel;
    case "blogs":
      return BlogModel;
    default:
      return null;
  }
}
async function seedIfEmpty() {
  const seedPairs = [
    { model: ProductModel, name: "products", data: INITIAL_PRODUCTS },
    { model: CollectionModel, name: "collections", data: INITIAL_COLLECTIONS },
    { model: OrderModel, name: "orders", data: INITIAL_ORDERS },
    { model: FileModel, name: "files", data: INITIAL_FILES },
    { model: CustomerModel, name: "customers", data: INITIAL_CUSTOMERS },
    { model: DiscountModel, name: "discounts", data: INITIAL_DISCOUNTS },
    { model: CustomPageModel, name: "customPages", data: DEFAULT_PAGES },
    { model: BlogModel, name: "blogs", data: INITIAL_BLOGS }
  ];
  for (const pair of seedPairs) {
    try {
      const model = pair.model;
      const count = await model.countDocuments();
      if (count === 0 && pair.data && pair.data.length > 0) {
        console.log(`[Mongoose Seeding] Collection "${pair.name}" is empty. Seeding with ${pair.data.length} default items...`);
        await model.insertMany(pair.data.map((item) => ({ ...item })));
      }
    } catch (e) {
      console.error(`[Mongoose Seeding] Failed to seed ${pair.name}:`, e);
    }
  }
}
function getConnectionStatus() {
  return getMongooseStatus();
}
async function getDatabaseDetails() {
  try {
    const status = getMongooseStatus();
    if (status.status !== "connected") {
      try {
        await connectMongoose();
      } catch (e) {
      }
    }
    const currentStatus = getMongooseStatus();
    const readyState = mongoose2.connection.readyState;
    const details = {
      status: currentStatus.status,
      uriHost: currentStatus.uriHost || "N/A",
      error: currentStatus.error || null,
      readyState,
      readyStateLabel: getReadyStateLabel(readyState),
      dbName: mongoose2.connection.name || "N/A",
      collections: [],
      models: Object.keys(mongoose2.models)
    };
    if (readyState === 1 && mongoose2.connection.db) {
      try {
        const db = mongoose2.connection.db;
        const collectionsList = await db.listCollections().toArray();
        const collectionsInfo = [];
        for (const col of collectionsList) {
          const count = await db.collection(col.name).countDocuments();
          collectionsInfo.push({
            name: col.name,
            count
          });
        }
        details.collections = collectionsInfo;
      } catch (err) {
        details.collectionError = err.message || String(err);
      }
    }
    return details;
  } catch (err) {
    console.error("[Database Info] Error inside getDatabaseDetails:", err);
    return {
      status: "error",
      uriHost: "N/A",
      error: err.message || String(err),
      readyState: mongoose2.connection.readyState,
      readyStateLabel: getReadyStateLabel(mongoose2.connection.readyState),
      dbName: "N/A",
      collections: [],
      models: []
    };
  }
}
function getReadyStateLabel(state) {
  switch (state) {
    case 0:
      return "Disconnected";
    case 1:
      return "Connected";
    case 2:
      return "Connecting";
    case 3:
      return "Disconnecting";
    default:
      return "Unknown";
  }
}
function updateMongoUri(newUri) {
  const trimmedUri = newUri.trim();
  process.env.MONGODB_URI = trimmedUri;
  try {
    const envPath = path.join(process.cwd(), ".env");
    let envContent = "";
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }
    const regex = /^MONGODB_URI\s*=\s*.*$/m;
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `MONGODB_URI="${trimmedUri}"`);
    } else {
      envContent = `${envContent.trim()}
MONGODB_URI="${trimmedUri}"
`;
    }
    fs.writeFileSync(envPath, envContent.trim() + "\n", "utf8");
    console.log("[Database Info] Successfully persisted MONGODB_URI configuration to /.env file");
  } catch (err) {
    console.warn("[Database Info] Failed to save MONGODB_URI to /.env configuration file:", err);
  }
  resetConnection();
  return getMongooseStatus();
}
async function getDb() {
  const conn = await connectMongoose();
  if (conn) {
    await seedIfEmpty();
    return conn.connection.db;
  }
  return null;
}
async function fetchResource(resource) {
  try {
    const conn = await connectMongoose();
    const Model = getModelForResource(resource);
    if (conn && Model) {
      const docs = await Model.find({}).lean().exec();
      return docs.map((doc) => {
        const { _id, __v, ...cleanDoc } = doc;
        return cleanDoc;
      });
    }
  } catch (error) {
  }
  return memoryCache[resource] || [];
}
async function saveResource(resource, list) {
  memoryCache[resource] = [...list];
  try {
    const conn = await connectMongoose();
    const Model = getModelForResource(resource);
    if (conn && Model) {
      const currentIds = list.map((item) => item.id).filter(Boolean);
      console.log(`[saveResource] Syncing ${resource} collection. Total items in payload: ${list.length}. Active IDs:`, currentIds);
      const deleteResult = await Model.deleteMany({ id: { $nin: currentIds } });
      if (deleteResult.deletedCount > 0) {
        console.log(`[saveResource] Permanently deleted ${deleteResult.deletedCount} items from ${resource} not in active client list.`);
      }
      for (const item of list) {
        if (!item.id) continue;
        const { _id, __v, ...cleanItem } = item;
        await Model.replaceOne({ id: item.id }, cleanItem, { upsert: true });
      }
      console.log(`[saveResource] Successfully upserted and synchronized all ${list.length} items to ${resource} collection.`);
      return list;
    }
  } catch (error) {
    console.error(`[saveResource] Error during database synchronization for "${resource}":`, error);
  }
  return memoryCache[resource];
}
var memoryImages = {};
async function saveUploadedImage(id, base64Data, mimeType) {
  memoryImages[id] = { base64Data, mimeType };
  try {
    const conn = await connectMongoose();
    if (conn) {
      const UploadedModel = UploadedImageModel;
      await UploadedModel.replaceOne(
        { id },
        { id, base64Data, mimeType },
        { upsert: true }
      );
    }
  } catch (error) {
    console.error("[Mongoose Engine] Failed to save uploaded image in DB:", error);
  }
  return `/api/images/${id}`;
}
async function getUploadedImage(id) {
  try {
    const conn = await connectMongoose();
    if (conn) {
      const UploadedModel = UploadedImageModel;
      const doc = await UploadedModel.findOne({ id }).lean().exec();
      if (doc) {
        return {
          base64Data: doc.base64Data,
          mimeType: doc.mimeType
        };
      }
    }
  } catch (error) {
    console.error("[Mongoose Engine] Failed to load image from DB:", error);
  }
  return memoryImages[id] || null;
}

// backend/routes/products.ts
import { Router } from "express";
var router = Router();
router.get("/", async (req, res) => {
  try {
    const data = await fetchResource("products");
    res.json(data);
  } catch (err) {
    console.error("[Products Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch products" });
  }
});
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Products API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("products", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Products Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist products" });
  }
});
var products_default = router;

// backend/routes/collections.ts
import { Router as Router2 } from "express";
var router2 = Router2();
router2.get("/", async (req, res) => {
  try {
    const data = await fetchResource("collections");
    res.json(data);
  } catch (err) {
    console.error("[Collections Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch collections" });
  }
});
router2.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Collections API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("collections", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Collections Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist collections" });
  }
});
var collections_default = router2;

// backend/routes/orders.ts
import { Router as Router3 } from "express";
var router3 = Router3();
router3.get("/", async (req, res) => {
  try {
    const data = await fetchResource("orders");
    res.json(data);
  } catch (err) {
    console.error("[Orders Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch orders" });
  }
});
router3.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Orders API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("orders", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Orders Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist orders" });
  }
});
var orders_default = router3;

// backend/routes/files.ts
import { Router as Router4 } from "express";
var router4 = Router4();
router4.get("/", async (req, res) => {
  try {
    const data = await fetchResource("files");
    res.json(data);
  } catch (err) {
    console.error("[Files Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch files" });
  }
});
router4.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Files API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("files", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Files Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist files" });
  }
});
var files_default = router4;

// backend/routes/customers.ts
import { Router as Router5 } from "express";
var router5 = Router5();
router5.get("/", async (req, res) => {
  try {
    const data = await fetchResource("customers");
    res.json(data);
  } catch (err) {
    console.error("[Customers Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch customers" });
  }
});
router5.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Customers API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("customers", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Customers Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist customers" });
  }
});
var customers_default = router5;

// backend/routes/discounts.ts
import { Router as Router6 } from "express";
var router6 = Router6();
router6.get("/", async (req, res) => {
  try {
    const data = await fetchResource("discounts");
    res.json(data);
  } catch (err) {
    console.error("[Discounts Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch discounts" });
  }
});
router6.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Discounts API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("discounts", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Discounts Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist discounts" });
  }
});
var discounts_default = router6;

// backend/routes/customPages.ts
import { Router as Router7 } from "express";
var router7 = Router7();
router7.get("/", async (req, res) => {
  try {
    const data = await fetchResource("customPages");
    res.json(data);
  } catch (err) {
    console.error("[CustomPages Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch custom pages" });
  }
});
router7.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "CustomPages API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("customPages", payload);
    res.json(updated);
  } catch (err) {
    console.error("[CustomPages Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist custom pages" });
  }
});
var customPages_default = router7;

// backend/routes/blogs.ts
import { Router as Router8 } from "express";
var router8 = Router8();
router8.get("/", async (req, res) => {
  try {
    const data = await fetchResource("blogs");
    res.json(data);
  } catch (err) {
    console.error("[Blogs Router] GET Error:", err);
    res.status(500).json({ error: err.message || "Failed to fetch blogs" });
  }
});
router8.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (!Array.isArray(payload)) {
      return res.status(400).json({ error: "Blogs API expects an array of documents" });
    }
    const database = await getDb();
    if (!database) {
      res.setHeader("X-Database-Offline", "true");
    } else {
      res.setHeader("X-Database-Offline", "false");
    }
    const updated = await saveResource("blogs", payload);
    res.json(updated);
  } catch (err) {
    console.error("[Blogs Router] POST Error:", err);
    res.status(500).json({ error: err.message || "Failed to persist blogs" });
  }
});
var blogs_default = router8;

// serverApp.ts
async function createExpressApp() {
  const app = express();
  app.use((req, res, next) => {
    if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
      return next();
    }
    express.json({ limit: "50mb" })(req, res, next);
  });
  app.use((req, res, next) => {
    if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
      return next();
    }
    express.urlencoded({ limit: "50mb", extended: true })(req, res, next);
  });
  app.post("/api/upload", async (req, res) => {
    try {
      const { data, filename } = req.body;
      if (!data) {
        return res.status(400).json({ error: "Missing data payload for upload." });
      }
      let base64String = data;
      let mimeType = "image/png";
      if (data.startsWith("data:")) {
        const matches = data.match(/^data:([^;]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64String = matches[2];
        }
      }
      const id = `img-${Date.now()}-${Math.floor(Math.random() * 1e5)}`;
      const imageUrl = await saveUploadedImage(id, base64String, mimeType);
      console.log(`[API Upload] Successfully persisted ${mimeType} image into MongoDB Atlas. ID: ${id}`);
      res.json({ url: imageUrl, id });
    } catch (err) {
      console.error("[API Upload] Fail:", err);
      res.status(500).json({ error: err.message || "Failed to process image upload database insertion" });
    }
  });
  app.get("/api/images/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const imgDoc = await getUploadedImage(id);
      if (!imgDoc) {
        return res.status(404).send("Image not found");
      }
      const imgBuffer = Buffer.from(imgDoc.base64Data, "base64");
      res.writeHead(200, {
        "Content-Type": imgDoc.mimeType,
        "Content-Length": imgBuffer.length,
        "Cache-Control": "public, max-age=31536000"
        // Persistent browser caching
      });
      res.end(imgBuffer);
    } catch (err) {
      console.error("[API Images] Server error serving asset document:", err);
      res.status(500).send("Internal server error serving media");
    }
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/api/db-status", async (req, res) => {
    try {
      await getDb();
    } catch (e) {
    }
    res.json(getConnectionStatus());
  });
  app.get("/api/db-details", async (req, res) => {
    try {
      const details = await getDatabaseDetails();
      res.json(details);
    } catch (err) {
      console.error("[API db-details] Error fetching DB details:", err);
      res.status(500).json({ error: err.message || "Failed to fetch database details" });
    }
  });
  app.post("/api/update-db-uri", async (req, res) => {
    try {
      const { uri } = req.body;
      if (!uri) {
        return res.status(400).json({ error: "No connection string was provided." });
      }
      updateMongoUri(uri);
      await getDb();
      res.json(getConnectionStatus());
    } catch (err) {
      console.error("[API update-db-uri] Error saving and testing URI:", err);
      res.status(500).json({ error: err.message || "Failed to update connection string" });
    }
  });
  app.use("/api/products", products_default);
  app.use("/api/collections", collections_default);
  app.use("/api/orders", orders_default);
  app.use("/api/files", files_default);
  app.use("/api/customers", customers_default);
  app.use("/api/discounts", discounts_default);
  app.use("/api/custompages", customPages_default);
  app.use("/api/blogs", blogs_default);
  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom"
    });
    app.use(vite.middlewares);
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      const lastSegment = url.split("/").pop() || "";
      if (url.startsWith("/api") || lastSegment.includes(".")) {
        return next();
      }
      try {
        const fs2 = await import("fs");
        let html = fs2.readFileSync(path2.resolve(process.cwd(), "index.html"), "utf-8");
        html = await vite.transformIndexHtml(url, html);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = path2.join(process.cwd(), "dist");
    console.log(`[Production Setup] Static directory: ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const url = req.originalUrl;
      const lastSegment = url.split("/").pop() || "";
      if (url.startsWith("/api") || lastSegment.includes(".")) {
        return res.status(404).send("API or File Asset Not Found");
      }
      const indexPath = path2.join(distPath, "index.html");
      console.log(`[Production Fallback] Sending index.html for request: ${req.url}`);
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`[Production Fallback] Error sending index.html:`, err);
          res.status(500).send("Internal Server Error: Missing compiled static resources.");
        }
      });
    });
  }
  return app;
}

// api-entry.ts
var appPromise = createExpressApp();
async function handler(req, res) {
  const app = await appPromise;
  return app(req, res);
}
export {
  handler as default
};
