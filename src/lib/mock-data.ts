import type { Merch } from "@/app/types/merch"

export const mockMerchs: Merch[] = [
  {
    pid: "1",
    merch_name: "Riviera Oversized T-Shirt",
    merch_description: "Official Riviera Oversized Tee",
    detailed_description:
      "Premium oversized cotton t-shirt designed for comfort and street-style fashion with Riviera branding.",
    size: "S,M,L,XL,2XL",
    price: 299,
    total_available: 1750,
    images: [
      "https://i.postimg.cc/vH7W8QsW/0versized-front.png",
      "https://i.postimg.cc/L6kz4Hpg/0versized-back.png",
      "https://i.postimg.cc/HL6nmBkv/Oversized-Round-Neck.png",
    ],
    category: false,
  },
  {
    pid: "2",
    merch_name: "Riviera Varsity Jacket",
    merch_description: "Official Riviera Varsity Jacket",
    detailed_description:
      "High-quality varsity jacket with premium fabric, ribbed cuffs, and embroidered Riviera logos for a classic college look.",
    size: "S,M,L,XL,2XL",
    price: 779,
    total_available: 75,
    images: [
      "https://i.postimg.cc/52NFxLgR/varsity.png",
      "https://i.postimg.cc/dtR8QqYR/varsity-back.png",
      "https://i.postimg.cc/sfh7rQtW/Varsity-Jacket.png",
    ],
    category: false,
    discount: {
      enabled: false,
      percentage: 20,
      original_price: 436,
      label: "Limited Offer",
      limited_to: 100,
    },
  },
  {
    pid: "3",
    merch_name: "Riviera Polo T-Shirt",
    merch_description: "Official Riviera Polo",
    detailed_description:
      "Elegant polo t-shirt made from breathable fabric, suitable for casual and semi-formal Riviera events.",
    size: "S,M,L,XL,2XL,3XL",
    price: 339,
    total_available: 750,
    images: [
      "https://i.postimg.cc/DyQqf2TP/polo-front.png",
      "https://i.postimg.cc/8Pdhk1SB/polo-back.png",
      "https://i.postimg.cc/y8YDkkb4/Polo-T-Shirt.png",
    ],
    category: false,
    discount: {
      enabled: false,
      percentage: 15,
      original_price: 1058,
      label: "Early Bird Discount",
      limited_to: 50,
    },
  },
  {
    pid: "4",
    merch_name: "Riviera Hoodie",
    merch_description: "Official Riviera Hoodie",
    size: "S,M,L,XL,2XL",
    price: 549,
    total_available: 500,
    category: false,
    images: [
      "https://i.postimg.cc/cL48swhj/varsity-1.png",
      "https://i.postimg.cc/9QFqWZbN/varsity-back-1.png",
      "https://i.postimg.cc/Qdsy5rpP/Hoodie.png",
    ],
  },

  // ========== COMBOS (4 items) ==========
  {
    pid: "5",
    merch_name: "Riviera Hoodie + Riviera Oversized T-Shirt",
    merch_description: "",
    size: "S,M,L,XL,2XL",
    price: 799,
    total_available: 250,
    images: [
      "https://i.imgur.com/GQZmDVA.png",
      "https://i.imgur.com/7DrL4h0.png",
      "https://i.imgur.com/xqLrFPo.png",
    ],
    category: true,
    discount: {
      enabled: false,
      percentage: 30,
      original_price: 641,
      label: "Bundle Deal",
      limited_to: 100,
    },
  },
  {
    pid: "6",
    merch_name: "POLO + HOODIE COMBO",
    merch_description:
      "Perfect duo - Stylish polo for day and cozy hoodie for night",
    size: "L",
    price: 849,
    total_available: 35,
    images: [
      "https://i.imgur.com/GQZmDVA.png",
      "https://i.imgur.com/7DrL4h0.png",
      "https://i.imgur.com/xqLrFPo.png",
    ],
    category: true,
    discount: {
      enabled: true,
      percentage: 25,
      original_price: 1132,
      label: "Mega Saver",
      limited_to: 100,
    },
  },
  {
    pid: "7",
    merch_name: "COMPLETE MERCH PACK",
    merch_description:
      "Ultimate bundle: T-shirt + Polo + Hoodie + Backpack + Cap",
    size: "M/Adjustable",
    price: 1499,
    total_available: 20,
    images: [
      "https://i.imgur.com/GQZmDVA.png",
      "https://i.imgur.com/7DrL4h0.png",
      "https://i.imgur.com/xqLrFPo.png",
      "https://i.imgur.com/5HIq6RN.png",
    ],
    category: true,
    discount: {
      enabled: true,
      percentage: 35,
      original_price: 2306,
      label: "Ultimate Pack",
      limited_to: 100,
    },
  },
  {
    pid: "8",
    merch_name: "VARSITY + TSHIRT COMBO",
    merch_description: "Premium varsity jacket paired with graphic tee",
    size: "L, XL",
    price: 1099,
    total_available: 25,
    images: [
      "https://i.imgur.com/GQZmDVA.png",
      "https://i.imgur.com/7DrL4h0.png",
      "https://i.imgur.com/xqLrFPo.png",
    ],
    category: true,
    discount: {
      enabled: true,
      percentage: 20,
      original_price: 1374,
      label: "Jacket Bundle",
      limited_to: 100,
    },
  },
]
