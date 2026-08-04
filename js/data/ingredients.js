export const BASE_INGREDIENTS = [
  // Carbs (C)
  { id: 'rice', name: 'Rice', type: 'carbs', points: 5, icon: '🍚', state: 'normal' },
  { id: 'pasta', name: 'Pasta', type: 'carbs', points: 5, icon: '🍝', state: 'normal' },
  { id: 'potato', name: 'Potatoes', type: 'carbs', points: 6, icon: '🥔', state: 'normal' },
  { id: 'bread', name: 'Bread', type: 'carbs', points: 4, icon: '🍞', state: 'normal' },

  // Vegetables (V)
  { id: 'tomato', name: 'Tomato', type: 'vegetable', points: 4, icon: '🍅', state: 'normal' },
  { id: 'onion', name: 'Onion', type: 'vegetable', points: 4, icon: '🧅', state: 'normal' },
  { id: 'carrot', name: 'Carrot', type: 'vegetable', points: 5, icon: '🥕', state: 'normal' },
  { id: 'broccoli', name: 'Broccoli', type: 'vegetable', points: 6, icon: '🥦', state: 'normal' },

  // Proteins (P) - Standard Meat Proteins
  { id: 'beef', name: 'Beef', type: 'protein', points: 12, icon: '🥩', tags: ['meat'], state: 'normal' },
  { id: 'chicken', name: 'Chicken', type: 'protein', points: 10, icon: '🍗', tags: ['meat'], state: 'normal' },
  { id: 'egg', name: 'Egg', type: 'protein', points: 7, icon: '🥚', tags: ['animal_product'], state: 'normal' },
  { id: 'fish', name: 'Fish', type: 'protein', points: 11, icon: '🐟', tags: ['meat', 'fish'], state: 'normal' },

  // Seasonings & Dairy (S)
  { id: 'garlic', name: 'Garlic & Herbs', type: 'spice', points: 3, multiplierBonus: 1, icon: '🧄', state: 'normal' },
  { id: 'cheese', name: 'Cheese', type: 'dairy', points: 6, multiplierBonus: 1, icon: '🧀', state: 'normal' },
  { id: 'butter', name: 'Butter', type: 'dairy', points: 4, multiplierBonus: 1, icon: '🧈', state: 'normal' },
  { id: 'chili', name: 'Chili Pepper', type: 'spice', points: 2, multiplierBonus: 2, icon: '🌶️', state: 'normal' }
];

// Vegetarian Proteins for Vegetarian Deck
export const VEGETARIAN_PROTEINS = [
  { id: 'seitan', name: 'Seitan', type: 'protein', points: 12, icon: '🫘', tags: ['plant_protein'], state: 'normal' },
  { id: 'tofu', name: 'Tofu', type: 'protein', points: 10, icon: '🧊', tags: ['plant_protein'], state: 'normal' },
  { id: 'tempeh', name: 'Tempeh', type: 'protein', points: 7, icon: '🥜', tags: ['plant_protein'], state: 'normal' },
  { id: 'veggie_burger', name: 'Veggie Patty', type: 'protein', points: 11, icon: '🍔', tags: ['plant_protein'], state: 'normal' }
];

// Vegan Dairy Substitutes for the Vegetarian Deck (replaces Cheese/Butter,
// which are animal products and don't belong in a strictly vegan deck)
export const VEGAN_DAIRY = [
  { id: 'vegan_cheese', name: 'Vegan Cheese', type: 'dairy', points: 6, multiplierBonus: 1, icon: '🧀', tags: ['vegan'], state: 'normal' },
  { id: 'vegan_butter', name: 'Plant Butter', type: 'dairy', points: 4, multiplierBonus: 1, icon: '🧈', tags: ['vegan'], state: 'normal' }
];

// Advanced sauces & specialty ingredients. Not part of the Regular or
// Vegetarian starting decks -- only obtainable from the Supermarket, unless
// the player is running the Special deck (where they're included from the start).
export const SUPERMARKET_INGREDIENTS = [
  { id: 'soy_sauce', name: 'Soy Sauce', type: 'sauce', points: 6, multiplierBonus: 1, icon: '🍶', costForks: 4, state: 'normal' },
  { id: 'truffle_oil', name: 'Truffle Oil', type: 'sauce', points: 10, multiplierBonus: 2, icon: '🍾', costForks: 6, state: 'normal' },
  { id: 'curry_paste', name: 'Curry Paste', type: 'sauce', points: 8, multiplierBonus: 1, icon: '🍛', costForks: 5, state: 'normal' },
  { id: 'wasabi', name: 'Wasabi', type: 'sauce', points: 5, multiplierBonus: 2, icon: '🟩', costForks: 5, state: 'normal' },
  { id: 'miso_paste', name: 'Miso Paste', type: 'sauce', points: 7, multiplierBonus: 1, icon: '🥣', costForks: 4, state: 'normal' }
];

// Metaphorical / Emotional Special Ingredients (Only 1 copy per deck)
export const METAPHORICAL_INGREDIENTS = [
  { id: 'love', name: 'Love', type: 'special', points: 15, multiplierBonus: 2, icon: '💖', state: 'normal' },
  { id: 'patience', name: 'Patience', type: 'special', points: 10, multiplierBonus: 3, icon: '⏳', state: 'normal' },
  { id: 'grandma_hug', name: "Grandma's Hug", type: 'special', points: 25, multiplierBonus: 4, icon: '👵', state: 'normal' }
];