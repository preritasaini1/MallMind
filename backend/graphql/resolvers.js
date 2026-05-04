import { analyzeIntent } from "../agents/stylistAgent.js";
import { findShortestPath } from "../agents/navigatorAgent.js";
import Inventory from "../models/inventory.js";

const fallbackStores = [
  // ── APPAREL ────────────────────────────────────────────────
  {
    storeName: "Zara", location: "GF", products: [
      { name: "Blue Slim-Fit Jeans", category: "Jeans", color: "blue", price: 3990 },
      { name: "Black Skinny Jeans", category: "Jeans", color: "black", price: 3490 },
      { name: "White Linen Shorts", category: "Shorts", color: "white", price: 2490 },
      { name: "Khaki Cargo Shorts", category: "Shorts", color: "khaki", price: 2990 },
      { name: "Floral Midi Dress", category: "Dress", color: "pink", price: 4990 },
      { name: "Black Evening Dress", category: "Dress", color: "black", price: 5990 },
      { name: "Blue Denim Jacket", category: "Jacket", color: "blue", price: 4500 },
      { name: "Classic Blue Suit", category: "Suit", color: "blue", price: 19900 },
      { name: "Black Oversized T-Shirt", category: "T-Shirt", color: "black", price: 1490 },
      { name: "Striped Linen Shirt", category: "Shirt", color: "white", price: 2990 },
      { name: "Flared Palazzo Pants", category: "Pants", color: "beige", price: 3490 },
    ]
  },

  {
    storeName: "H&M", location: "GF", products: [
      { name: "Black Ripped Jeans", category: "Jeans", color: "black", price: 2999 },
      { name: "Light Wash Mom Jeans", category: "Jeans", color: "blue", price: 2799 },
      { name: "Denim Shorts", category: "Shorts", color: "blue", price: 1799 },
      { name: "Black Casual Shorts", category: "Shorts", color: "black", price: 1499 },
      { name: "Floral Wrap Dress", category: "Dress", color: "floral", price: 2999 },
      { name: "White Summer Dress", category: "Dress", color: "white", price: 2499 },
      { name: "Black Suit", category: "Suit", color: "black", price: 12000 },
      { name: "White Sneakers", category: "Sneakers", color: "white", price: 3500 },
      { name: "Kids Superhero T-Shirt", category: "Kids", color: "red", price: 800 },
      { name: "Graphic Print Hoodie", category: "Hoodie", color: "grey", price: 2299 },
      { name: "Jogger Track Pants", category: "Pants", color: "navy", price: 1799 },
    ]
  },

  {
    storeName: "Arrow", location: "GF", products: [
      { name: "Navy Slim-Fit Blazer", category: "Blazer", color: "navy", price: 8000 },
      { name: "White Formal Shirt", category: "Shirt", color: "white", price: 2000 },
      { name: "Charcoal Formal Trousers", category: "Trousers", color: "grey", price: 3499 },
      { name: "Black Formal Belt", category: "Accessory", color: "black", price: 999 },
      { name: "Arrow Cufflinks Set", category: "Gift", color: "silver", price: 1200 },
      { name: "Striped Formal Tie", category: "Accessory", color: "blue", price: 799 },
    ]
  },

  {
    storeName: "Manyavar", location: "GF", products: [
      { name: "Silk Saree (Mom Gift)", category: "Gift", color: "red", price: 1800 },
      { name: "Kurta Set", category: "Ethnic", color: "blue", price: 1500 },
      { name: "Sherwani Groom Set", category: "Ethnic", color: "gold", price: 18000 },
      { name: "Embroidered Nehru Jacket", category: "Ethnic", color: "maroon", price: 4500 },
      { name: "Cotton Salwar Kameez", category: "Gift", color: "pink", price: 1200 },
    ]
  },

  {
    storeName: "Max", location: "GF", products: [
      { name: "Straight Fit Jeans", category: "Jeans", color: "blue", price: 1799 },
      { name: "Printed Shorts", category: "Shorts", color: "red", price: 999 },
      { name: "Girls Party Dress", category: "Kids", color: "pink", price: 1299 },
      { name: "Boys Denim Jacket", category: "Kids", color: "blue", price: 1499 },
      { name: "Cotton Kurti", category: "Ethnic", color: "yellow", price: 899 },
      { name: "Athletic Track Suit", category: "Sports", color: "black", price: 2499 },
      { name: "Maxi Floral Dress", category: "Dress", color: "floral", price: 1999 },
    ]
  },

  {
    storeName: "Puma", location: "GF", products: [
      { name: "Running Shoes RS-X", category: "Sneakers", color: "white", price: 7999 },
      { name: "Sports Shorts Dri-Fit", category: "Shorts", color: "black", price: 1799 },
      { name: "Puma Track Jacket", category: "Jacket", color: "black", price: 4499 },
      { name: "Training T-Shirt", category: "T-Shirt", color: "grey", price: 1299 },
      { name: "Gym Bag 25L", category: "Bag", color: "black", price: 2999 },
      { name: "Compression Tights", category: "Sports", color: "black", price: 2499 },
      { name: "Casual Slides", category: "Footwear", color: "white", price: 1999 },
    ]
  },

  {
    storeName: "Fab India", location: "GF", products: [
      { name: "Block Print Kurta", category: "Ethnic", color: "orange", price: 1890 },
      { name: "Cotton Saree", category: "Gift", color: "teal", price: 2200 },
      { name: "Handloom Dupatta", category: "Accessory", color: "red", price: 890 },
      { name: "Organic Skincare Kit", category: "Skincare", color: "white", price: 1490 },
      { name: "Indigo Linen Shirt", category: "Shirt", color: "blue", price: 1690 },
    ]
  },

  {
    storeName: "Azorte", location: "GF", products: [
      { name: "Wide Leg Jeans", category: "Jeans", color: "blue", price: 3499 },
      { name: "Linen Co-ord Set", category: "Dress", color: "beige", price: 4999 },
      { name: "Oversized Bomber Jacket", category: "Jacket", color: "olive", price: 5499 },
      { name: "Satin Mini Dress", category: "Dress", color: "red", price: 3999 },
      { name: "Pleated Trousers", category: "Pants", color: "black", price: 3299 },
    ]
  },

  {
    storeName: "New Me", location: "GF", products: [
      { name: "Bootcut Jeans", category: "Jeans", color: "blue", price: 2499 },
      { name: "Cargo Shorts", category: "Shorts", color: "khaki", price: 1799 },
      { name: "Crop Top", category: "T-Shirt", color: "white", price: 999 },
      { name: "Formal Pencil Skirt", category: "Skirt", color: "black", price: 1999 },
    ]
  },

  // ── MAKEUP & BEAUTY ────────────────────────────────────────
  {
    storeName: "Nykaa Beauty", location: "GF", products: [
      { name: "Matte Lipstick Set", category: "Makeup", color: "red", price: 699 },
      { name: "Foundation SPF 30", category: "Makeup", color: "beige", price: 1299 },
      { name: "Kohl Kajal", category: "Makeup", color: "black", price: 299 },
      { name: "Eyeshadow Palette 12-Pan", category: "Makeup", color: "mixed", price: 1499 },
      { name: "BB Cream + Primer Duo", category: "Makeup", color: "nude", price: 999 },
      { name: "Nude Lip Gloss", category: "Makeup", color: "nude", price: 499 },
      { name: "Vitamin C Face Serum", category: "Skincare", color: "yellow", price: 899 },
      { name: "Hydrating Face Mask Pack", category: "Skincare", color: "white", price: 599 },
      { name: "Rose Water Toner", category: "Skincare", color: "pink", price: 399 },
      { name: "Perfume – Floral Bloom", category: "Gift", color: "pink", price: 1890 },
      { name: "Nail Polish Set 6pc", category: "Makeup", color: "mixed", price: 599 },
      { name: "Sunscreen SPF 50", category: "Skincare", color: "white", price: 499 },
    ]
  },

  // ── FOOTWEAR ───────────────────────────────────────────────
  {
    storeName: "Bata", location: "GF", products: [
      { name: "Leather Oxford Shoes", category: "Footwear", color: "brown", price: 3999 },
      { name: "White Canvas Sneakers", category: "Sneakers", color: "white", price: 1999 },
      { name: "Block Heel Sandals", category: "Footwear", color: "black", price: 2499 },
      { name: "Sports Running Shoes", category: "Sneakers", color: "blue", price: 3499 },
      { name: "Leather Loafers", category: "Footwear", color: "tan", price: 3299 },
      { name: "Kids School Shoes", category: "Kids", color: "black", price: 1499 },
    ]
  },

  // ── FOOD & BEVERAGES ───────────────────────────────────────
  {
    storeName: "Blue Tokai", location: "GF", products: [
      { name: "Cold Brew Coffee", category: "Coffee", color: "brown", price: 350 },
      { name: "Cappuccino", category: "Coffee", color: "brown", price: 280 },
      { name: "Avocado Toast", category: "Snack", color: "green", price: 399 },
      { name: "Sandwich Lunch Box", category: "Sandwich", color: "brown", price: 450 },
      { name: "Chocolate Muffin", category: "Snack", color: "brown", price: 149 },
    ]
  },

  {
    storeName: "Cafe", location: "GF", products: [
      { name: "Masala Chai", category: "Coffee", color: "brown", price: 80 },
      { name: "Latte", category: "Coffee", color: "brown", price: 250 },
      { name: "Pizza Slice", category: "Pizza", color: "red", price: 300 },
      { name: "Veg Wrap", category: "Wrap", color: "green", price: 220 },
      { name: "Pastry Assortment", category: "Snack", color: "mixed", price: 180 },
      { name: "Fresh Orange Juice", category: "Snack", color: "orange", price: 150 },
    ]
  },
  {
    storeName: "Barista", location: "GF", products: [
      { name: "Cappuccino", category: "Coffee", color: "brown", price: 280 },
      { name: "Iced Latte", category: "Coffee", color: "brown", price: 320 },
      { name: "Blueberry Muffin", category: "Snack", color: "blue", price: 180 },
    ]
  },

  // ── ELECTRONICS ────────────────────────────────────────────
  {
    storeName: "Croma", location: "GF", products: [
      { name: "Bluetooth Earbuds", category: "Electronics", color: "white", price: 2999 },
      { name: "Smart Watch Series 8", category: "Watch", color: "black", price: 24999 },
      { name: "Portable Bluetooth Speaker", category: "Electronics", color: "black", price: 3499 },
      { name: "USB-C Fast Charger 65W", category: "Electronics", color: "white", price: 999 },
      { name: "Laptop Backpack", category: "Bag", color: "grey", price: 2499 },
      { name: "LED Desk Lamp", category: "Home", color: "white", price: 1299 },
      { name: "Gaming Mouse", category: "Electronics", color: "black", price: 1999 },
    ]
  },

  // ── HOME & HYPERMARKET ─────────────────────────────────────
  {
    storeName: "Home Centre", location: "GF", products: [
      { name: "Cotton Bed Sheet King", category: "Home", color: "white", price: 1999 },
      { name: "Ceramic Dinner Set 12pc", category: "Home", color: "white", price: 3499 },
      { name: "Decorative Cushion Covers", category: "Home", color: "teal", price: 899 },
      { name: "Aroma Diffuser", category: "Gift", color: "white", price: 2499 },
      { name: "Non-stick Cookware Set", category: "Home", color: "black", price: 4999 },
      { name: "Wall Photo Frame Set", category: "Home", color: "brown", price: 799 },
    ]
  },

  {
    storeName: "Suvidha", location: "GF", products: [
      { name: "Grocery Essentials Pack", category: "Grocery", color: "mixed", price: 1200 },
      { name: "Organic Honey 500g", category: "Grocery", color: "yellow", price: 449 },
      { name: "Premium Dates Box", category: "Gift", color: "brown", price: 699 },
      { name: "Mixed Dry Fruits Pack", category: "Snack", color: "mixed", price: 599 },
    ]
  },

  {
    storeName: "Easybuy", location: "GF", products: [
      { name: "Men Casual Jeans", category: "Jeans", color: "blue", price: 1299 },
      { name: "Women Printed Kurta", category: "Ethnic", color: "pink", price: 799 },
      { name: "Basic T-Shirts 3-Pack", category: "T-Shirt", color: "mixed", price: 999 },
      { name: "Denim Shorts (Women)", category: "Shorts", color: "blue", price: 899 },
    ]
  },

  // ── JEWELLERY ──────────────────────────────────────────────
  {
    storeName: "Jewellery", location: "GF", products: [
      { name: "Gold-plated Necklace Set", category: "Jewellery", color: "gold", price: 1899 },
      { name: "Silver Anklet Pair", category: "Jewellery", color: "silver", price: 799 },
      { name: "Pearl Earrings", category: "Gift", color: "white", price: 1299 },
      { name: "Diamond Pendant (Gift)", category: "Gift", color: "silver", price: 4999 },
      { name: "Kundan Bangle Set", category: "Jewellery", color: "gold", price: 2499 },
    ]
  },
];

export const resolvers = {
  Query: {
    shop: async (_, { input }) => {
      const intent = await analyzeIntent(input);
      let parsedBudget = intent.budget
        ? parseInt(intent.budget.replace(/[^0-9]/g, ""))
        : null;

      let matches = [];

      try {
        const query = {};
        if (intent.product) {
          // Clean the product string of budget-related keywords for cleaner DB search
          const cleanProduct = intent.product
            .replace(/(?:under|below|less than|within|max)\s*(?:₹|rs)?\s*(\d+(?:,\d+)*)/i, "")
            .trim();
          
          const products = cleanProduct.split(", ").map(p => p.trim());
          query.$or = products.flatMap(p => [
            { item: { $regex: p, $options: "i" } },
            { category: { $regex: p, $options: "i" } },
            { category: p } // Exact match for mapped categories like "Office"
          ]);
        }
        if (intent.color) query.color = { $regex: intent.color, $options: "i" };
        // Improved budget detection from product string if budget field is missing
        if (!parsedBudget && intent.product) {
          const budgetMatch = intent.product.match(/(?:under|below|less than|within|max)\s*(?:₹|rs)?\s*(\d+(?:,\d+)*)/i);
          if (budgetMatch) {
            parsedBudget = parseInt(budgetMatch[1].replace(/,/g, ""));
          }
        }

        if (parsedBudget) query.price = { $lte: parsedBudget };

        const dbMatches = await Inventory.find(query).maxTimeMS(2000);
        matches = dbMatches.map(item => ({
          store: item.store,
          location: (item.floor || item.floor === 0) ? `F${item.floor}` : "GF",
          product: item.item,
          price: item.price,
          category: item.category, // internal use
          item: item.item         // internal use
        }));
      } catch (err) {
        console.warn(`⚠️ MongoDB query failed (${err.message}).`);
      }

      // ── FALLBACK TRIGGER (If DB is empty or failed) ──────────────────────
      if (matches.length === 0) {
        console.log("ℹ️ No DB matches, checking fallback stores...");
        const searchTerm = (intent.product || "").toLowerCase();
        const parsedBudget = intent.budget ? parseInt(intent.budget.replace(/[^0-9]/g, "")) : null;

        fallbackStores.forEach((store) => {
          store.products.forEach((item) => {
            const nameMatch = searchTerm ? item.name.toLowerCase().includes(searchTerm) : false;
            const categoryMatch = searchTerm ? item.category.toLowerCase().includes(searchTerm) : false;
            const colorMatch = intent.color ? item.color.toLowerCase() === intent.color.toLowerCase() : true;
            const priceMatch = parsedBudget ? item.price <= parsedBudget : true;

            if ((nameMatch || categoryMatch) && colorMatch && priceMatch) {
              matches.push({ 
                store: store.storeName, 
                location: store.location, 
                product: item.name, 
                price: item.price,
                category: item.category, // internal use
                item: item.name          // internal use
              });
            }
          });
        });

        // Budget-only query: return top picks if still empty
        if (!searchTerm && matches.length === 0) {
          fallbackStores.forEach(store => {
            store.products.forEach(item => {
                if (!parsedBudget || item.price <= parsedBudget) {
                  matches.push({ 
                    store: store.storeName, 
                    location: store.location, 
                    product: item.name, 
                    price: item.price,
                    category: item.category,
                    item: item.name
                  });
                }
            });
          });
          matches = matches.slice(0, 10);
        }
      }

      // ── FINAL MESSAGE BUILDER ────────────────────────────────────────────
      if (!intent.message) {
        if (matches.length > 0) {
          intent.message = `I've found some great options for ${intent.product}! Check out the map to see where to find them.`;
        } else {
          intent.message = `I couldn't find any exact matches for "${input}" in our live inventory. Would you like me to suggest something similar?`;
        }
      }

      let navigation = null;
      if (matches.length > 0) {
        // 1. Identify which unique products were requested (handles "and", "+", "&", and commas)
        let productStr = intent.product || "";
        const queries = productStr
          .split(/,|\band\b|\+|\&/i)
          .map(p => p.trim())
          .filter(p => p.length > 0);

        let stops = [];
        let tempPos = "Entrance";

        // Pick exactly one closest store for each query
        queries.forEach(q => {
          const lowerQ = q.toLowerCase();
          const catMatches = matches.filter(m => {
            const itemMatch = m.item && m.item.toLowerCase().includes(lowerQ);
            const catMatch = m.category && m.category.toLowerCase().includes(lowerQ);
            const reverseMatch = m.item && lowerQ.includes(m.item.toLowerCase());
            return itemMatch || catMatch || reverseMatch;
          });
          
          if (catMatches.length > 0) {
            catMatches.sort((a, b) => {
              const dA = findShortestPath(tempPos, a.store).distance || 999;
              const dB = findShortestPath(tempPos, b.store).distance || 999;
              return dA - dB;
            });
            const bestStore = catMatches[0].store;
            stops.push(bestStore);
            tempPos = bestStore;
          }
        });

        if (stops.length === 0 && matches.length > 0) {
          matches.sort((a, b) => {
            const dA = findShortestPath("Entrance", a.store).distance || 999;
            const dB = findShortestPath("Entrance", b.store).distance || 999;
            return dA - dB;
          });
          stops.push(matches[0].store);
        }

        // 2. Build the final unified path
        stops = [...new Set(stops)];
        let totalDistance = 0;
        let fullPath = ["Entrance"];
        let currentPos = "Entrance";

        stops.forEach(store => {
          const navResult = findShortestPath(currentPos, store);
          if (navResult && navResult.path) {
            totalDistance += navResult.distance || 0;
            fullPath.push(...navResult.path.slice(1));
            currentPos = store;
          }
        });

        navigation = {
          distance: totalDistance,
          path: fullPath
        };

        const stopNames = stops.join(" and ");
        intent.message = `I've found the perfect route for you! 🛍️\n\nYou'll visit **${stopNames}**, which are the closest matches for your request. The total walk is only **${totalDistance} minutes**.`;
      }

      return {
        product: intent.product,
        color: intent.color,
        budget: intent.budget,
        additional_request: intent.additional_request,
        recommendations: matches,
        navigation
      };
    }
  }
};