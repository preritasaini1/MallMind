import mongoose from "mongoose";
import dotenv from "dotenv";
import Inventory from "./models/inventory.js";

dotenv.config();

const items = [
  { store: "Zara", item: "Blue Denim Jacket", category: "Jacket", price: 4500, color: "blue", stock: 5, floor: 1, x: 300, y: 150 },
  { store: "Zara", item: "Classic Blue Suit", category: "Suit", price: 19900, color: "blue", stock: 2, floor: 1, x: 300, y: 150 },
  { store: "Zara", item: "Black Formal Shirt", category: "Shirt", price: 2500, color: "black", stock: 10, floor: 1, x: 300, y: 150 },
  { store: "Zara", item: "White Summer Dress", category: "Dress", price: 4999, color: "white", stock: 15, floor: 1, x: 300, y: 150 },
  { store: "Zara", item: "Red Stiletto Heels", category: "Footwear", price: 3499, color: "red", stock: 8, floor: 1, x: 300, y: 150 },
  { store: "Zara", item: "Slim Fit Jeans", category: "Jeans", price: 3999, color: "blue", stock: 12, floor: 1, x: 300, y: 150 },
  { store: "Zara", item: "Sky Blue Oxford Shirt", category: "Shirt", price: 3990, color: "blue", stock: 10, floor: 1, x: 300, y: 150 },
  { store: "Zara", item: "Navy Blue Linen Shirt", category: "Shirt", price: 4590, color: "blue", stock: 7, floor: 1, x: 300, y: 150 },

  { store: "H&M", item: "Black Suit Jacket", category: "Suit", price: 5999, color: "black", stock: 4, floor: 2, x: 150, y: 170 },
  { store: "H&M", item: "White Sneakers", category: "Sneakers", price: 3500, color: "white", stock: 12, floor: 2, x: 150, y: 170 },
  { store: "H&M", item: "Oversized Hoodie", category: "Hoodie", price: 2299, color: "grey", stock: 20, floor: 2, x: 150, y: 170 },
  { store: "H&M", item: "Regular Jeans", category: "Jeans", price: 2499, color: "blue", stock: 30, floor: 2, x: 150, y: 170 },
  { store: "H&M", item: "Light Blue Cotton Shirt", category: "Shirt", price: 1499, color: "blue", stock: 25, floor: 2, x: 150, y: 170 },
  { store: "H&M", item: "Patterned Blue Shirt", category: "Shirt", price: 2299, color: "blue", stock: 15, floor: 2, x: 150, y: 170 },
  { store: "H&M", item: "Blue Slim Fit Suit", category: "Suit", price: 6999, color: "blue", stock: 5, floor: 2, x: 150, y: 170 },

  { store: "Puma", item: "Running Shoes", category: "Sneakers", price: 4500, color: "blue", stock: 10, floor: 1, x: 302, y: 195 },
  { store: "Puma", item: "Track Pants", category: "Pants", price: 2500, color: "black", stock: 15, floor: 1, x: 302, y: 195 },

  { store: "Croma", item: "Noise Cancelling Headphones", category: "Electronics", price: 14999, color: "black", stock: 5, floor: 1, x: 678, y: 373 },
  { store: "Croma", item: "Smart Watch", category: "Watch", price: 4999, color: "black", stock: 12, floor: 1, x: 678, y: 373 },
  { store: "Croma", item: "Bluetooth Speaker", category: "Electronics", price: 2999, color: "blue", stock: 20, floor: 1, x: 678, y: 373 },
  { store: "Croma", item: "Wireless Mouse", category: "Electronics", price: 999, color: "black", stock: 50, floor: 1, x: 678, y: 373 },
  { store: "Croma", item: "10000mAh Power Bank", category: "Electronics", price: 1599, color: "white", stock: 30, floor: 1, x: 678, y: 373 },

  { store: "Arrow", item: "Navy Slim-Fit Blazer", category: "Blazer", price: 8000, color: "navy", stock: 6, floor: 2, x: 450, y: 130 },
  { store: "Arrow", item: "White Formal Shirt", category: "Shirt", price: 2000, color: "white", stock: 15, floor: 2, x: 450, y: 130 },
  { store: "Arrow", item: "Navy Formal Shirt", category: "Shirt", price: 2499, color: "navy", stock: 10, floor: 2, x: 450, y: 130 },

  { store: "Manyavar", item: "Silk Saree (Mom Gift)", category: "Ethnic", price: 1800, color: "red", stock: 5, floor: 3, x: 300, y: 60 },
  { store: "Manyavar", item: "Kurta Set", category: "Ethnic", price: 1500, color: "blue", stock: 8, floor: 3, x: 300, y: 60 },

  { store: "Blue Tokai", item: "Cold Brew Coffee", category: "Coffee", price: 350, color: "brown", stock: 50, floor: 0, x: 450, y: 210 },
  { store: "Blue Tokai", item: "Sandwich Lunch", category: "Lunch", price: 450, color: "brown", stock: 30, floor: 0, x: 450, y: 210 },

  { store: "Barista", item: "Cappuccino Coffee", category: "Coffee", price: 280, color: "brown", stock: 50, floor: 1, x: 200, y: 300 },
  { store: "Barista", item: "Blueberry Muffin Snack", category: "Snack", price: 180, color: "blue", stock: 20, floor: 1, x: 200, y: 300 },

  { store: "Cafe", item: "Latte Coffee", category: "Coffee", price: 250, color: "brown", stock: 100, floor: 2, x: 150, y: 90 },
  { store: "Cafe", item: "Pizza Slice", category: "Pizza", price: 300, color: "red", stock: 40, floor: 2, x: 150, y: 90 },

  { store: "Nykaa Beauty", item: "Matte Lipstick", category: "Makeup", price: 450, color: "red", stock: 15, floor: 0, x: 270, y: 230 },
  { store: "Nykaa Beauty", item: "Foundation", category: "Makeup", price: 1200, color: "beige", stock: 10, floor: 0, x: 270, y: 230 },

  { store: "Bata", item: "Leather Shoes", category: "Footwear", price: 2999, color: "brown", stock: 25, floor: 0, x: 375, y: 230 },
  { store: "Bata", item: "White Sneakers", category: "Sneakers", price: 1999, color: "white", stock: 15, floor: 0, x: 375, y: 230 },

  { store: "New Me", item: "Graphic Crop Top", category: "T-Shirt", price: 899, color: "pink", stock: 30, floor: 0, x: 180, y: 474 },
  { store: "New Me", item: "Cargo Pants", category: "Pants", price: 1899, color: "grey", stock: 20, floor: 0, x: 180, y: 474 },
  { store: "New Me", item: "Summer Dress", category: "Dress", price: 1499, color: "yellow", stock: 15, floor: 0, x: 180, y: 474 },

  { store: "Only", item: "Skinny Jeans", category: "Jeans", price: 2499, color: "blue", stock: 25, floor: 1, x: 340, y: 145 },
  { store: "Only", item: "Printed T-Shirt", category: "T-Shirt", price: 999, color: "white", stock: 40, floor: 1, x: 340, y: 145 },
  { store: "Only", item: "Denim Jacket", category: "Jacket", price: 3499, color: "blue", stock: 10, floor: 1, x: 340, y: 145 },

  { store: "Azorte", item: "Modern Kurta Set", category: "Ethnic", price: 3999, color: "teal", stock: 12, floor: 1, x: 678, y: 115 },
  { store: "Azorte", item: "Formal Blazer", category: "Blazer", price: 5499, color: "black", stock: 8, floor: 1, x: 678, y: 115 },
  { store: "Azorte", item: "Party Dress", category: "Dress", price: 4599, color: "red", stock: 10, floor: 1, x: 678, y: 115 },

  { store: "Fab India", item: "Cotton Kurta", category: "Ethnic", price: 1899, color: "white", stock: 30, floor: 1, x: 520, y: 195 },
  { store: "Fab India", item: "Silk Scarf", category: "Accessory", price: 899, color: "multi", stock: 50, floor: 1, x: 520, y: 195 },
  { store: "Fab India", item: "Handblock Print Saree", category: "Ethnic", price: 4500, color: "blue", stock: 10, floor: 1, x: 520, y: 195 },

  { store: "Vero Moda", item: "Midi Skirt", category: "Skirt", price: 2299, color: "pink", stock: 15, floor: 1, x: 565, y: 145 },
  { store: "Vero Moda", item: "Lace Top", category: "T-Shirt", price: 1499, color: "white", stock: 20, floor: 1, x: 565, y: 145 },
  { store: "Vero Moda", item: "Tailored Trousers", category: "Trousers", price: 2999, color: "black", stock: 12, floor: 1, x: 565, y: 145 },

  { store: "Portico", item: "Cotton Bed Sheet", category: "Home", price: 1999, color: "white", stock: 20, floor: 0, x: 375, y: 335 },
  { store: "Portico", item: "Comforter Set", category: "Home", price: 4500, color: "blue", stock: 10, floor: 0, x: 375, y: 335 },
  { store: "Portico", item: "Pillows (Pack of 2)", category: "Home", price: 999, color: "white", stock: 30, floor: 0, x: 375, y: 335 },
  { store: "Portico", item: "Bath Towel Set", category: "Home", price: 1299, color: "grey", stock: 25, floor: 0, x: 375, y: 335 },

  { store: "Mia", item: "Diamond Stud Earrings", category: "Jewellery", price: 12500, color: "gold", stock: 5, floor: 0, x: 535, y: 335 },
  { store: "Mia", item: "Gold Pendant", category: "Jewellery", price: 8900, color: "gold", stock: 8, floor: 0, x: 535, y: 335 },
  { store: "Mia", item: "Silver Ring", category: "Jewellery", price: 2500, color: "silver", stock: 20, floor: 0, x: 535, y: 335 },

  { store: "Safari", item: "Hard Shell Suitcase", category: "Bag", price: 5499, color: "black", stock: 10, floor: 0, x: 455, y: 335 },
  { store: "Safari", item: "Laptop Backpack", category: "Bag", price: 1999, color: "blue", stock: 25, floor: 0, x: 455, y: 335 },
  { store: "Safari", item: "Travel Duffle Bag", category: "Bag", price: 2499, color: "red", stock: 15, floor: 0, x: 455, y: 335 },

  { store: "Blue stone", item: "Traditional Necklace", category: "Jewellery", price: 45000, color: "gold", stock: 3, floor: 0, x: 135, y: 495 },
  { store: "Blue stone", item: "Bangle Set", category: "Jewellery", price: 15000, color: "gold", stock: 7, floor: 0, x: 135, y: 495 },
  { store: "Blue stone", item: "Silver Anklet Pair", category: "Jewellery", price: 1200, color: "silver", stock: 15, floor: 0, x: 135, y: 495 },

  { store: "Home Centre", item: "Designer Vase", category: "Home", price: 2500, color: "blue", stock: 10, floor: 0, x: 132, y: 273 },
  { store: "Home Centre", item: "Wall Mirror", category: "Home", price: 4500, color: "gold", stock: 5, floor: 0, x: 132, y: 273 },
  { store: "Home Centre", item: "Lounge Chair", category: "Home", price: 12000, color: "grey", stock: 3, floor: 0, x: 132, y: 273 },
  { store: "Home Centre", item: "Coffee Table", category: "Home", price: 8500, color: "brown", stock: 2, floor: 0, x: 132, y: 273 },
  { store: "Arrow", item: "Blue Formal Suit", category: "Suit", price: 7499, color: "blue", stock: 5, floor: 2, x: 450, y: 130 },
  { store: "Arrow", item: "Navy Slim-Fit Blazer", category: "Blazer", price: 6000, color: "blue", stock: 6, floor: 2, x: 450, y: 130 },

  { store: "H&M", item: "Blue Linen Blazer Suit", category: "Suit", price: 4500, color: "blue", stock: 10, floor: 2, x: 150, y: 170 },
  { store: "H&M", item: "Summer Blue Suit", category: "Suit", price: 5500, color: "blue", stock: 15, floor: 2, x: 150, y: 170 },

  { store: "Toyzone", item: "Superhero Costume", category: "Outfit", price: 1200, color: "red", stock: 10, floor: 0, x: 182, y: 78 },
  { store: "Toyzone", item: "Princess Party Dress", category: "Outfit", price: 1500, color: "pink", stock: 8, floor: 0, x: 182, y: 78 },

  { store: "Chunmun", item: "Kids Tuxedo Set", category: "Outfit", price: 2999, color: "black", stock: 5, floor: 1, x: 507, y: 103 },
  { store: "Chunmun", item: "Glitter Party Frock", category: "Outfit", price: 1899, color: "gold", stock: 12, floor: 1, x: 507, y: 103 }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");

    await Inventory.deleteMany({});
    console.log("Cleared old inventory.");

    await Inventory.insertMany(items);
    console.log("Inserted new comprehensive inventory!");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedDB();
