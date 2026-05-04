import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-to-prevent-crash",
});

// ── Keyword → category mapping (ORDER MATTERS: specific first) ──────────────
// Each entry: [keyword_in_input, category_to_search]
const PRODUCT_KEYWORDS = [
  // Specific product types first (before generic words)
  ["mom jeans",      "Jeans"],
  ["skinny jeans",   "Jeans"],
  ["slim jeans",     "Jeans"],
  ["ripped jeans",   "Jeans"],
  ["wide leg jeans", "Jeans"],
  ["bootcut jeans",  "Jeans"],
  ["denim jeans",    "Jeans"],
  ["jeans",          "Jeans"],
  ["denim shorts",   "Shorts"],
  ["cargo shorts",   "Shorts"],
  ["shorts",         "Shorts"],
  ["midi dress",     "Dress"],
  ["mini dress",     "Dress"],
  ["maxi dress",     "Dress"],
  ["evening dress",  "Dress"],
  ["party dress",    "Dress"],
  ["dress",          "Dress"],
  ["skirt",          "Skirt"],
  ["kurta",          "Ethnic"],
  ["saree",          "Ethnic"],
  ["sherwani",       "Ethnic"],
  ["salwar",         "Ethnic"],
  ["dupatta",        "Accessory"],
  ["ethnic",         "Ethnic"],
  ["kurti",          "Ethnic"],
  ["palazzo",        "Pants"],
  ["track pant",     "Pants"],
  ["jogger",         "Pants"],
  ["trousers",       "Trousers"],
  ["pants",          "Pants"],
  ["hoodie",         "Hoodie"],
  ["sweatshirt",     "Hoodie"],
  ["t-shirt",        "T-Shirt"],
  ["tshirt",         "T-Shirt"],
  ["tee",            "T-Shirt"],
  ["crop top",       "T-Shirt"],
  ["top",            "T-Shirt"],
  ["formal shirt",   "Shirt"],
  ["linen shirt",    "Shirt"],
  ["shirts",         "Shirt"],
  ["shirt",          "Shirt"],
  ["blazer",         "Blazer"],
  ["suit",           "Suit"],
  ["jacket",         "Jacket"],
  ["sneakers",       "Sneakers"],
  ["sneaker",        "Sneakers"],
  ["running shoes",  "Sneakers"],
  ["shoes",          "Footwear"],
  ["sandals",        "Footwear"],
  ["loafers",        "Footwear"],
  ["footwear",       "Footwear"],
  ["slides",         "Footwear"],
  ["heels",          "Footwear"],
  ["lipstick",       "Makeup"],
  ["lip gloss",      "Makeup"],
  ["foundation",     "Makeup"],
  ["kajal",          "Makeup"],
  ["kohl",           "Makeup"],
  ["eyeshadow",      "Makeup"],
  ["eyeliner",       "Makeup"],
  ["bb cream",       "Makeup"],
  ["blush",          "Makeup"],
  ["mascara",        "Makeup"],
  ["nail polish",    "Makeup"],
  ["makeup",         "Makeup"],
  ["cosmetics",      "Makeup"],
  ["beauty",         "Makeup"],
  ["serum",          "Skincare"],
  ["moisturiser",    "Skincare"],
  ["moisturizer",    "Skincare"],
  ["face mask",      "Skincare"],
  ["sunscreen",      "Skincare"],
  ["spf",            "Skincare"],
  ["toner",          "Skincare"],
  ["skincare",       "Skincare"],
  ["perfume",        "Gift"],
  ["fragrance",      "Gift"],
  ["necklace",       "Jewellery"],
  ["earrings",       "Jewellery"],
  ["bangles",        "Jewellery"],
  ["anklet",         "Jewellery"],
  ["pendant",        "Jewellery"],
  ["jewellery",      "Jewellery"],
  ["jewelry",        "Jewellery"],
  ["watch",          "Watch"],
  ["smartwatch",     "Watch"],
  ["earbuds",        "Electronics"],
  ["headphones",     "Electronics"],
  ["speaker",        "Electronics"],
  ["charger",        "Electronics"],
  ["electronics",    "Electronics"],
  ["bag",            "Bag"],
  ["backpack",       "Bag"],
  ["gym bag",        "Bag"],
  ["belt",           "Accessory"],
  ["tie",            "Accessory"],
  ["cufflinks",      "Accessory"],
  ["coffee",         "Coffee"],
  ["chai",           "Coffee"],
  ["latte",          "Coffee"],
  ["cappuccino",     "Coffee"],
  ["pizza",          "Pizza"],
  ["sandwich",       "Sandwich"],
  ["wrap",           "Wrap"],
  ["lunch",          "Lunch"],
  ["snack",          "Snack"],
  ["muffin",         "Snack"],
  ["pastry",         "Snack"],
  ["juice",          "Snack"],
  ["cold brew",      "Coffee"],
  ["bed sheet",      "Home"],
  ["cushion",        "Home"],
  ["cookware",       "Home"],
  ["home decor",     "Home"],
  ["diffuser",       "Home"],
  ["frame",          "Home"],
  ["home",           "Home"],
  ["grocery",        "Grocery"],
  ["honey",          "Grocery"],
  ["kids",           "Kids"],
  ["children",       "Kids"],
  ["birthday",       "Kids"],
  ["sports",         "Sports"],
  ["gym",            "Sports"],
  ["training",       "Sports"],
  ["athletic",       "Sports"],
  ["formal",         "Office"],
  ["office",         "Office"],
  // Generic gift LAST so specific items match first
  ["gift for mom",   "Gift"],
  ["gift for dad",   "Gift"],
  ["gift for wife",  "Gift"],
  ["pillows",        "Home"],
  ["bedsheets",      "Home"],
  ["gift",           "Gift"],
];

const COLOR_KEYWORDS = [
  "blue", "black", "white", "red", "pink", "grey", "gray", "navy",
  "green", "olive", "beige", "khaki", "brown", "gold", "silver",
  "yellow", "orange", "maroon", "teal", "nude", "floral", "mixed",
];

export async function analyzeIntent(userInput) {
  // ── FALLBACK PARSER (no OpenAI key) ─────────────────────────────────────
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "dummy-key-to-prevent-crash") {
    console.log("No OPENAI_API_KEY found, using enhanced fallback parser.");
    const intent = { product: "", color: "", budget: "", additional_request: "" };
    const lower = userInput.toLowerCase();

    // 1. Product — collect all matching categories
    const matchedCategories = [];
    for (const [keyword, category] of PRODUCT_KEYWORDS) {
      if (lower.includes(keyword)) {
        if (!matchedCategories.includes(category)) {
          matchedCategories.push(category);
        }
      }
    }
    
    intent.product = matchedCategories.length > 0 ? matchedCategories.join(", ") : userInput.trim();

    // 2. Color
    for (const color of COLOR_KEYWORDS) {
      if (lower.includes(color)) { intent.color = color; break; }
    }

    // 3. Budget — handles "under 2k", "under ₹2000", "under 500", etc.
    const budgetMatch = lower.match(/under\s*(?:rs\.?|₹)?\s*(\d+(?:[.,]\d+)?)\s*(k)?/);
    if (budgetMatch) {
      let num = parseFloat(budgetMatch[1].replace(",", ""));
      if (budgetMatch[2] === "k") num *= 1000;
      intent.budget = num.toString();
    }

    return intent;
  }

  // ── OPENAI PATH ──────────────────────────────────────────────────────────
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a retail AI for an Indian mall concierge.
Extract structured JSON from user shopping queries. 
"Mom Jeans" is a type of jeans, NOT a gift for mom.
Return ONLY valid JSON:
{
  "product": "<specific product type e.g. Jeans, Dress, Lipstick, Sneakers, Coffee>",
  "color": "<color if mentioned, else empty>",
  "budget": "<number only if mentioned e.g. '2000', else empty>",
  "additional_request": "<any other preference>"
}`,
        },
        { role: "user", content: userInput },
      ],
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : content);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return { product: userInput, color: "", budget: "", additional_request: "" };
  }
}