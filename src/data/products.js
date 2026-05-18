export const PRODUCT_CATEGORIES = [
  "Ready Mix",
  "Instant Mix",
  "Powders",
  "Noodles",
  "Soups"
];

export const PRODUCTS = [
  // --- READY MIX CATEGORY ---
  {
    id: "rm-kichdi",
    name: "Kichdi Premix",
    category: "Ready Mix",
    price: 240,
    quantity: "500 g",
    variants: [
      "Pearl Millet",
      "Finger Millet",
      "Kodo Millet",
      "Browntop Millet",
      "Barnyard Millet",
      "Foxtail Millet",
      "Little Millet",
      "Proso Millets",
      "Multi Millets"
    ],
    rating: 4.8,
    reviewsCount: 340,
    image: "/kichdi-premix.png",
    description: "A nourishing, low-glycemic, and fiber-rich ready-to-cook meal made with the finest organic millets and roasted lentils. Perfect for a quick, gut-friendly breakfast or dinner.",
    badge: "Best Seller",
    nutrition: { protein: "12g", fiber: "8.5g", carbs: "62g", fat: "2.1g" }
  },
  {
    id: "rm-dosa",
    name: "Dosa Premix",
    category: "Ready Mix",
    price: 240,
    quantity: "500 g",
    variants: [
      "Pearl Millet",
      "Finger Millet",
      "Kodo Millet",
      "Browntop Millet",
      "Barnyard Millet",
      "Foxtail Millet",
      "Little Millet",
      "Proso Millets",
      "Multi Millets"
    ],
    rating: 4.9,
    reviewsCount: 412,
    image: "/dosa-mix.png",
    description: "Prepare crispy, golden, and highly nutritious dosas in minutes. Naturally fermented, gluten-free, and packed with high protein and essential minerals.",
    badge: "Top Rated",
    nutrition: { protein: "14g", fiber: "9.2g", carbs: "60g", fat: "1.8g" }
  },
  {
    id: "rm-rava-dosa",
    name: "Rava Dosa Premix",
    category: "Ready Mix",
    price: 240,
    quantity: "500 g",
    variants: [
      "Pearl Millet",
      "Finger Millet",
      "Kodo Millet",
      "Browntop Millet",
      "Barnyard Millet",
      "Foxtail Millet",
      "Little Millet",
      "Proso Millets",
      "Multi Millets"
    ],
    rating: 4.7,
    reviewsCount: 228,
    image: "/rava-dosa-mix.png",
    description: "Instant, super crispy, restaurant-style Rava Dosa blend crafted with fiber-rich millets, semolina, cumin seeds, and pepper. No fermentation required!",
    badge: "Crispy Delight",
    nutrition: { protein: "11.5g", fiber: "7.8g", carbs: "64g", fat: "2.3g" }
  },
  {
    id: "rm-upma",
    name: "Upma Premix",
    category: "Ready Mix",
    price: 240,
    quantity: "500 g",
    variants: [
      "Pearl Millet",
      "Finger Millet",
      "Kodo Millet",
      "Browntop Millet",
      "Barnyard Millet",
      "Foxtail Millet",
      "Little Millet",
      "Proso Millets",
      "Multi Millets"
    ],
    rating: 4.6,
    reviewsCount: 194,
    image: "/upma-mix.png",
    description: "A traditional wholesome South Indian breakfast enriched with toasted millets, curry leaves, mustard seeds, and premium organic spices. Just add hot water!",
    badge: "Best Seller",
    nutrition: { protein: "13g", fiber: "10.1g", carbs: "59g", fat: "2.5g" }
  },

  // --- POWDERS CATEGORY ---
  {
    id: "pw-chutney",
    name: "Chutney Powder",
    category: "Powders",
    price: 80,
    quantity: "50 g",
    variants: [],
    rating: 4.8,
    reviewsCount: 148,
    image: "/chutney-powder.png",
    description: "Traditional spicy, tangy, and nutty chutney powder made with lentils, roasted seeds, dry red chillies, and premium asafoetida. Perfect companion for Dosa and Idli.",
    badge: "Must Try",
    nutrition: { protein: "18g", fiber: "12g", carbs: "42g", fat: "6.8g" }
  },
  {
    id: "pw-rasam",
    name: "Rasam Powder",
    category: "Powders",
    price: 80,
    quantity: "50 g",
    variants: [],
    rating: 4.7,
    reviewsCount: 120,
    image: "/rasam-powder.png",
    description: "Highly aromatic, traditional South Indian soup spices powder. Formulated with black pepper, cumin, coriander, and organic turmeric to boost immunity.",
    badge: "Immunity Booster",
    nutrition: { protein: "8.5g", fiber: "16g", carbs: "45g", fat: "4.2g" }
  },
  {
    id: "pw-sambar",
    name: "Sambar Powder",
    category: "Powders",
    price: 80,
    quantity: "50 g",
    variants: [],
    rating: 4.9,
    reviewsCount: 185,
    image: "/sambar-powder.png",
    description: "Authentic, handcrafted blend of premium spices and lentils, roasted perfectly to create the ultimate rich, thick, and delicious sambar stew.",
    badge: "Authentic Taste",
    nutrition: { protein: "12g", fiber: "14g", carbs: "48g", fat: "3.5g" }
  },
  {
    id: "pw-karam",
    name: "Karam Powder",
    category: "Powders",
    price: 80,
    quantity: "50 g",
    variants: [],
    rating: 4.6,
    reviewsCount: 95,
    image: "/karam-powder.png",
    description: "A spicy Andhra-style garlic and red chili spice mix. Adds an instant kick and premium flavor profile when drizzled on hot millets with ghee.",
    badge: "Spicy & Bold",
    nutrition: { protein: "9g", fiber: "11g", carbs: "50g", fat: "5.5g" }
  },
  {
    id: "pw-sprout",
    name: "Sprout Powder",
    category: "Powders",
    price: 80,
    quantity: "50 g",
    variants: [],
    rating: 4.8,
    reviewsCount: 167,
    image: "/sprout-powder.png",
    description: "Highly nutritious powder milled from carefully sprouted multi-millets and green grams. Ideal health drink mix for kids, athletes, and fitness enthusiasts.",
    badge: "Best Seller",
    nutrition: { protein: "22g", fiber: "14.2g", carbs: "52g", fat: "1.5g" }
  },
  {
    id: "pw-beetroot",
    name: "Beetroot Powder",
    category: "Powders",
    price: 120,
    quantity: "100 g",
    variants: [],
    rating: 4.7,
    reviewsCount: 88,
    image: "/beetroot-powder.png",
    description: "100% natural, dehydrated organic beetroot powder. Rich in nitrates, increases oxygen intake, and serves as a natural pre-workout booster and colorant.",
    badge: "Pre-Workout",
    nutrition: { protein: "10g", fiber: "11g", carbs: "70g", fat: "0.5g" }
  },
  {
    id: "pw-onion",
    name: "Onion Powder",
    category: "Powders",
    price: 110,
    quantity: "100 g",
    variants: [],
    rating: 4.5,
    reviewsCount: 64,
    image: "/onion-powder.png",
    description: "Saves preparation time and packs intense savory onion flavor. Made from premium, slowly dehydrated onions. Perfect for seasoning and quick cooking.",
    badge: "Kitchen Staple",
    nutrition: { protein: "9.5g", fiber: "8.2g", carbs: "75g", fat: "0.2g" }
  },
  {
    id: "pw-amla",
    name: "Amla Powder",
    category: "Powders",
    price: 130,
    quantity: "100 g",
    variants: [],
    rating: 4.9,
    reviewsCount: 204,
    image: "/amla-powder.png",
    description: "Pure Indian Gooseberry powder, packed with Vitamin C and powerful antioxidants. Promotes strong immunity, radiant skin, and digestive health.",
    badge: "Vitamin C Rich",
    nutrition: { protein: "4g", fiber: "25g", carbs: "58g", fat: "0.5g" }
  },
  {
    id: "pw-mango",
    name: "Mango Powder",
    category: "Powders",
    price: 95,
    quantity: "100 g",
    variants: [],
    rating: 4.6,
    reviewsCount: 72,
    image: "/mango-powder.png",
    description: "Tangy and sour Amchur (Dry Mango) powder made from handpicked raw green mangoes. Elevates chat, curries, and snack seasonings with a premium tanginess.",
    badge: "Tangy Twist",
    nutrition: { protein: "3g", fiber: "8g", carbs: "78g", fat: "0.8g" }
  },
  {
    id: "pw-tomato",
    name: "Tomato Powder",
    category: "Powders",
    price: 110,
    quantity: "100 g",
    variants: [],
    rating: 4.5,
    reviewsCount: 53,
    image: "/tomato-powder.png",
    description: "Rich, tangy dehydrated red tomato powder. Ideal for instantly flavoring soups, sauces, pasta, instant noodles, and popcorn seasoning.",
    badge: "100% Natural",
    nutrition: { protein: "12g", fiber: "9g", carbs: "62g", fat: "1.2g" }
  },
  {
    id: "pw-potato",
    name: "Potato Powder",
    category: "Powders",
    price: 90,
    quantity: "100 g",
    variants: [],
    rating: 4.3,
    reviewsCount: 42,
    image: "/potato-powder.png",
    description: "Dehydrated potato flakes powder. Serves as a perfect thickening agent for healthy creamy soups and base mixes, or for making gluten-free flatbreads.",
    badge: "Thickener",
    nutrition: { protein: "7g", fiber: "6g", carbs: "80g", fat: "0.1g" }
  },
  {
    id: "pw-jackfruit",
    name: "Jackfruit Powder",
    category: "Powders",
    price: 140,
    quantity: "100 g",
    variants: [],
    rating: 4.8,
    reviewsCount: 156,
    image: "/jackfruit-powder.png",
    description: "Clinically proven to help manage blood sugar levels. Made from 100% green jackfruit, neutral in taste, and can be mixed into standard dosa, idli, or wheat batter.",
    badge: "Sugar Control",
    nutrition: { protein: "8g", fiber: "22g", carbs: "68g", fat: "0.3g" }
  },
  {
    id: "pw-banana-flower",
    name: "Banana Flower Powder",
    category: "Powders",
    price: 150,
    quantity: "100 g",
    variants: [],
    rating: 4.7,
    reviewsCount: 78,
    image: "/banana-flower-powder.png",
    description: "An ancient therapeutic powder that balances hormones, relieves stomach pain, and acts as an exceptional lactation support and digestive tonic.",
    badge: "Wellness Choice",
    nutrition: { protein: "9.8g", fiber: "18.5g", carbs: "62g", fat: "0.4g" }
  },
  {
    id: "pw-ginger",
    name: "Ginger Powder",
    category: "Powders",
    price: 120,
    quantity: "100 g",
    variants: [],
    rating: 4.8,
    reviewsCount: 92,
    image: "/ginger-powder.png",
    description: "Highly potent dehydrated ginger root (Sonth) powder. Incredible spice for tea, baking, curries, and a verified natural remedy for coughs and colds.",
    badge: "Antioxidant",
    nutrition: { protein: "8.9g", fiber: "14.1g", carbs: "68g", fat: "1.9g" }
  },
  {
    id: "pw-garlic",
    name: "Garlic Powder",
    category: "Powders",
    price: 110,
    quantity: "100 g",
    variants: [],
    rating: 4.6,
    reviewsCount: 114,
    image: "/garlic-powder.png",
    description: "Deep, aromatic garlic seasoning. Carefully dehydrated from premium garlic cloves. Perfect to season veggies, garlic breads, soups, and healthy marinades.",
    badge: "Rich Flavor",
    nutrition: { protein: "16g", fiber: "9g", carbs: "70g", fat: "0.7g" }
  },
  {
    id: "pw-mint",
    name: "Mint Powder",
    category: "Powders",
    price: 95,
    quantity: "100 g",
    variants: [],
    rating: 4.7,
    reviewsCount: 81,
    image: "/mint-powder.png",
    description: "Extremely refreshing dehydrated organic mint leaves powder. Enhances cooling raitas, spiced buttermilk, biryanis, lemonades, and marinades.",
    badge: "Cooling & Fresh",
    nutrition: { protein: "3.8g", fiber: "12g", carbs: "52g", fat: "0.6g" }
  },
  {
    id: "pw-moringa",
    name: "Moringa Powder",
    category: "Powders",
    price: 135,
    quantity: "100 g",
    variants: [],
    rating: 4.9,
    reviewsCount: 265,
    image: "/moringa-powder.png",
    description: "A nutrient-packed green superfood powder milled from shade-dried organic Moringa leaves. Rich in iron, calcium, amino acids, and multivitamins.",
    badge: "Superfood Green",
    nutrition: { protein: "27g", fiber: "19.2g", carbs: "38g", fat: "2.3g" }
  },

  // --- INSTANT MIX CATEGORY ---




  {
    id: "im-instant-upma",
    name: "Instant Upma",
    category: "Instant Mix",
    price: 60,
    quantity: "80 g Cup",
    variants: [],
    rating: 4.5,
    reviewsCount: 110,
    image: "/instant-upma.png",
    description: "Office and travel friendly single-serving cup of delicious, healthy millet upma. Just add boiling water to the cup, wait for 3 minutes, and enjoy!",
    badge: "Travel Friendly",
    nutrition: { protein: "9.2g", fiber: "7.5g", carbs: "55g", fat: "3.2g" }
  },
  {
    id: "im-rawa-dosa",
    name: "Rawa Dosa Mixture",
    category: "Instant Mix",
    price: 140,
    quantity: "500 g",
    variants: [],
    rating: 4.7,
    reviewsCount: 142,
    image: "/rawa-dosa-mixture.png",
    description: "Prepare paper-thin, laced, crispy rava dosas within minutes. Made from stone-ground millets, black pepper, ginger extracts, and organic herbs.",
    badge: "Crispy Lace",
    nutrition: { protein: "11g", fiber: "8.2g", carbs: "65g", fat: "2.1g" }
  },

  // --- NOODLES CATEGORY ---
  {
    id: "nd-noodles",
    name: "Millet Noodles",
    category: "Noodles",
    price: 150,
    quantity: "2 Packets",
    variants: [
      "Foxtail Millet",
      "Finger Millet",
      "Pearl Millet",
      "Multi Millet"
    ],
    rating: 4.9,
    reviewsCount: 520,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?q=80&w=600&auto=format&fit=crop",
    description: "Healthy, air-dried (never fried!) noodles made from pure millet flours and wheat. 100% MSG-free, no preservatives, comes with an all-natural taste maker spice packet.",
    badge: "Gym Special",
    nutrition: { protein: "15g", fiber: "11g", carbs: "58g", fat: "1.2g" }
  },

  // --- SOUPS CATEGORY ---
  {
    id: "sp-soup",
    name: "Millet Soup Powder",
    category: "Soups",
    price: 150,
    quantity: "2 Packets",
    variants: [
      "Foxtail Millet",
      "Finger Millet",
      "Pearl Millet",
      "Multi Millet"
    ],
    rating: 4.8,
    reviewsCount: 298,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600&auto=format&fit=crop",
    description: "A nourishing and comforting hot millet soup powder. Perfectly spiced with black pepper, ginger, and garlic, packed with premium dehydrated real vegetable bits.",
    badge: "Calorie Conscious",
    nutrition: { protein: "10.5g", fiber: "13g", carbs: "50g", fat: "0.8g" }
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Aditya Verma",
    role: "CrossFit Athlete & Coach",
    rating: 5,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    review: "GymMillets has completely changed my pre-workout nutrition game! The Beetroot Powder gives me a clean nitric oxide boost, and the Millet Noodles are the perfect high-protein post-workout meal. Best organic brand in India!"
  },
  {
    id: 2,
    name: "Dr. Shalini Iyer",
    role: "Clinical Nutritionist & Diabetologist",
    rating: 5,
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de215f?q=80&w=200&auto=format&fit=crop",
    review: "I recommend GymMillets' Jackfruit Powder and Multi-Millet Dosa Premix to all my diabetic patients. High fiber, low glycemic index, and zero artificial additives. A premium food brand that truly cares about wellness."
  },
  {
    id: 3,
    name: "Rohit Malhotra",
    role: "Gym Goer & Tech Professional",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    review: "As someone with a busy lifestyle, the Instant Upma cups are absolute lifesavers at the office. Just add boiling water and a hot, nutritious, high-protein millet breakfast is ready in 3 minutes. Can't recommend this enough!"
  },
  {
    id: 4,
    name: "Priyanka Sen",
    role: "Yoga Instructor & Wellness Blogger",
    rating: 5,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    review: "The Moringa Powder and Sprout Powder from GymMillets are my absolute staples for morning smoothies. They blend perfectly, taste super fresh, and keep me energized throughout my back-to-back yoga sessions. 10/10!"
  }
];

export const COUPONS = [
  { code: "MILLETLIFE10", discount: 10, minPurchase: 500, description: "Get 10% OFF on purchases above ₹500" },
  { code: "ORGANIC20", discount: 20, minPurchase: 1000, description: "Get 20% OFF on purchases above ₹1,000" },
  { code: "GYMPOWER30", discount: 30, minPurchase: 1500, description: "Fitness Special: Get 30% OFF on purchases above ₹1,500" },
  { code: "FIRSTFIT", discount: 15, minPurchase: 0, description: "Welcome Coupon: Get 15% OFF on your first purchase!" }
];

export const WHY_CHOOSE_US = [
  {
    id: 1,
    title: "Organic Ingredients",
    description: "Sourced directly from certified organic farms, ensuring pesticide-free, pure grain goodness.",
    icon: "Leaf"
  },
  {
    id: 2,
    title: "High Protein Foods",
    description: "Specifically formulated for fitness enthusiasts with up to 2x more protein than white rice.",
    icon: "Flame"
  },
  {
    id: 3,
    title: "Healthy Lifestyle",
    description: "Low Glycemic Index, high in dietary fiber, promoting sustained energy levels and easy digestion.",
    icon: "HeartPulse"
  },
  {
    id: 4,
    title: "Traditional Recipes",
    description: "Crafted with age-old recipes to retain authentic local flavor and maximum organic nutrition.",
    icon: "CookingPot"
  },
  {
    id: 5,
    title: "Fast Delivery",
    description: "Ultra-fast packaging and logistics pipeline, delivering fresh organic nutrition to your doorstep.",
    icon: "Truck"
  },
  {
    id: 6,
    title: "Premium Packaging",
    description: "Eco-friendly, multi-layer resealable moisture-barrier zip pouches to maintain ultimate freshness.",
    icon: "Package"
  }
];
