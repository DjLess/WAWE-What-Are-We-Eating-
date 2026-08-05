import { PROTEIN_TIERS, getProteinTierBonus } from './recipeTiers.js';

export const RECIPE_BOOK = [
  // --- SPECIFIC COMBO RECIPES ---
  {
    id: 'pasta_bolognese',
    name: 'Classic Beef Pasta',
    icon: '🍝',
    multiplier: 3,
    basePoints: 18,
    desc: 'Pasta + Beef + Tomato',
    check: (counts, ingredients) => {
      const hasPasta = ingredients.some(i => i.id === 'pasta');
      const hasBeef = ingredients.some(i => i.id === 'beef');
      const hasTomato = ingredients.some(i => i.id === 'tomato');
      return hasPasta && hasBeef && hasTomato;
    }
  },
  {
    id: 'fish_and_chips',
    name: 'Classic Fish and Chips',
    icon: '🍟',
    multiplier: 3,
    basePoints: 18,
    desc: 'Fish + Potatoes',
    check: (counts, ingredients) => {
      const hasFish = ingredients.some(i => i.id === 'fish');
      const hasPotatoes = ingredients.some(i => i.id === 'potato');
      return hasFish && hasPotatoes;
    }
  },
  {
    id: 'steak_frites',
    name: 'Steak Frites',
    icon: '🥩',
    multiplier: 4,
    basePoints: 24,
    desc: 'Beef + Potatoes + Butter/Garlic',
    check: (counts, ingredients) => {
      const hasBeef = ingredients.some(i => i.id === 'beef');
      const hasPotatoes = ingredients.some(i => i.id === 'potato');
      const hasSeasoning = ingredients.some(i => i.id === 'butter' || i.id === 'garlic');
      return hasBeef && hasPotatoes && hasSeasoning;
    }
  },
  {
    id: 'mediterranean_breakfast',
    name: 'Mediterranean Breakfast Plate',
    icon: '🍳',
    multiplier: 3,
    basePoints: 16,
    desc: 'Egg/Tempeh + Tomato + Onion + Bread',
    check: (counts, ingredients) => {
      const hasProtein = ingredients.some(i => i.id === 'egg' || i.id === 'tempeh');
      const hasBread = ingredients.some(i => i.id === 'bread');
      const hasTomato = ingredients.some(i => i.id === 'tomato');
      const hasOnion = ingredients.some(i => i.id === 'onion');
      return hasProtein && hasBread && hasTomato && hasOnion;
    }
  },
  {
    id: 'spicy_stir_fry',
    name: 'Spicy Asian Stir-Fry',
    icon: '🍱',
    multiplier: 4,
    basePoints: 22,
    desc: 'Rice + Chicken/Tofu + Chili Pepper + Soy Sauce',
    check: (counts, ingredients) => {
      const hasRice = ingredients.some(i => i.id === 'rice');
      const hasProtein = ingredients.some(i => i.id === 'chicken' || i.id === 'tofu');
      const hasChili = ingredients.some(i => i.id === 'chili');
      const hasSoy = ingredients.some(i => i.id === 'soy_sauce');
      return hasRice && hasProtein && hasChili && hasSoy;
    }
  },
  {
    id: 'katsu_curry_deluxe',
    name: 'Katsu Curry Deluxe',
    icon: '🍛',
    multiplier: 5,
    basePoints: 28,
    desc: 'Rice + Curry Paste + Chicken/Tofu/Veggie Patty',
    check: (counts, ingredients) => {
      const hasRice = ingredients.some(i => i.id === 'rice');
      const hasCurry = ingredients.some(i => i.id === 'curry_paste');
      const hasProtein = ingredients.some(i => i.id === 'chicken' || i.id === 'tofu' || i.id === 'veggie_burger');
      return hasRice && hasCurry && hasProtein;
    }
  },
  {
    id: 'garden_soup',
    name: 'Hearty Garden Soup',
    icon: '🥣',
    multiplier: 2,
    basePoints: 12,
    desc: 'At least 3 different vegetables',
    check: (counts, ingredients) => {
      const uniqueVegs = new Set(ingredients.filter(i => i.type === 'vegetable').map(i => i.id));
      return uniqueVegs.size >= 3;
    }
  },
  {
    id: 'vegan_pasta',
    name: 'Vegan Pasta Marinara',
    icon: '🍝',
    multiplier: 3,
    basePoints: 18,
    desc: 'Pasta + Plant Protein + Tomato',
    check: (counts, ingredients) => {
      const hasPasta = ingredients.some(i => i.id === 'pasta');
      const hasPlantProtein = ingredients.some(i => i.tags && i.tags.includes('plant_protein'));
      const hasTomato = ingredients.some(i => i.id === 'tomato');
      return hasPasta && hasPlantProtein && hasTomato;
    }
  },

  // --- ADVANCED DISHES (Special Sauces, Supermarket / Special Deck only) ---
  {
    id: 'umami_stir_fry',
    name: 'Umami Stir Fry',
    icon: '🍱',
    multiplier: 5,
    basePoints: 30,
    desc: 'Any Protein + Soy Sauce/Miso + Vegetable',
    check: (counts, ingredients) => {
      const hasProtein = counts.protein > 0;
      const hasSauce = ingredients.some(i => i.type === 'sauce');
      return hasProtein && hasSauce && counts.vegetable > 0;
    }
  },
  {
    id: 'truffle_gourmet_plate',
    name: 'Truffle Gourmet Plate',
    icon: '✨',
    multiplier: 6,
    basePoints: 35,
    desc: 'Truffle Oil + Any Protein + Carb',
    check: (counts, ingredients) => {
      const hasTruffle = ingredients.some(i => i.id === 'truffle_oil');
      return hasTruffle && counts.protein > 0 && counts.carbs > 0;
    }
  },
  {
    id: 'curry_bowl',
    name: 'Curry Rice Bowl',
    icon: '🍛',
    multiplier: 4,
    basePoints: 22,
    desc: 'Rice + Curry Paste + Protein/Vegetable',
    check: (counts, ingredients) => {
      const hasRice = ingredients.some(i => i.id === 'rice');
      const hasCurry = ingredients.some(i => i.id === 'curry_paste');
      return hasRice && hasCurry && (counts.protein > 0 || counts.vegetable > 0);
    }
  },
  {
    id: 'wasabi_fish_plate',
    name: 'Wasabi Fish Plate',
    icon: '🍣',
    multiplier: 5,
    basePoints: 28,
    desc: 'Fish + Wasabi + Rice',
    check: (counts, ingredients) => {
      const hasFish = ingredients.some(i => i.id === 'fish');
      const hasWasabi = ingredients.some(i => i.id === 'wasabi');
      const hasRice = ingredients.some(i => i.id === 'rice');
      return hasFish && hasWasabi && hasRice;
    }
  }
];

export class DishEvaluator {
  static evaluate(selectedCards = [], activeDiets = [], proteinLevels = {}) {
    if (!selectedCards || selectedCards.length === 0) {
      return this.invalidDish("Empty Plate");
    }

    const hasSpoiledCard = selectedCards.some(c => c.state === 'frozen' || c.state === 'rotten');
    if (hasSpoiledCard) {
      return this.invalidDish("Spoiled Ingredient");
    }

    const validCards = selectedCards;
    const counts = { carbs: 0, vegetable: 0, protein: 0, spice: 0, dairy: 0, sauce: 0, special: 0 };
    validCards.forEach(c => {
      if (counts[c.type] !== undefined) counts[c.type]++;
      else counts.special++;
    });

    const allowMixedCategories = activeDiets.some(d => d.allowDuplicateCategories);
    let isXL = false;

    for (const cat of ['carbs', 'protein']) {
      const catCards = validCards.filter(c => c.type === cat);
      const uniqueIds = new Set(catCards.map(c => c.id));

      if (uniqueIds.size > 1 && !allowMixedCategories) {
        return this.invalidDish("Mismatched Ingredients");
      }
      if (catCards.length > 1 && uniqueIds.size === 1) {
        isXL = true;
      }
    }

    const xlNote = isXL ? " (XL)" : "";

    let emotionalNote = "";
    if (validCards.some(i => i.id === 'love')) emotionalNote = " (Made with Love)";
    else if (validCards.some(i => i.id === 'patience')) emotionalNote = " (Cooked with Patience)";
    else if (validCards.some(i => i.id === 'grandma_hug')) emotionalNote = " (Grandma's Style)";

    // Detect protein upgrade level for suffix labeling (+) or (++)
    const proteinCard = validCards.find(i => i.type === 'protein' && PROTEIN_TIERS[i.id]);
    let levelSuffix = "";
    if (proteinCard) {
      const currentLevel = proteinLevels[proteinCard.id] || 1;
      if (currentLevel === 2) levelSuffix = " (+)";
      else if (currentLevel >= 3) levelSuffix = " (++)";
    }

    const validIndices = selectedCards.map((_, i) => i);
    const tierBonus = getProteinTierBonus(validCards, proteinLevels);

    // Extract side descriptions (carb & veggies) dynamically
    const carbCard = validCards.find(i => i.type === 'carbs');
    const vegCards = validCards.filter(i => i.type === 'vegetable');
    
    let sideDescription = "";
    if (carbCard && vegCards.length === 1) {
      sideDescription = ` over ${carbCard.name} & ${vegCards[0].name}`;
    } else if (carbCard && vegCards.length >= 2) {
      sideDescription = ` over ${carbCard.name} with Sautéed Veggies`;
    } else if (carbCard) {
      sideDescription = ` over ${carbCard.name}`;
    } else if (vegCards.length === 1) {
      sideDescription = ` with ${vegCards[0].name}`;
    } else if (vegCards.length >= 2) {
      sideDescription = ` with Sautéed Veggies`;
    }

    // 1. Specific combo named recipes (take priority)
    for (const recipe of RECIPE_BOOK) {
      if (recipe.check(counts, validCards)) {
        return {
          name: `${recipe.name}${levelSuffix}${emotionalNote}${xlNote}`,
          icon: recipe.icon,
          multiplier: recipe.multiplier + tierBonus.multBonus,
          basePoints: recipe.basePoints + tierBonus.chipsBonus,
          validCardIndices: validIndices
        };
      }
    }

    // 2. Generic protein-based recipes with dynamic side integration
    if (counts.protein > 0 && (counts.carbs > 0 || counts.vegetable > 0)) {
      if (proteinCard) {
        const level = proteinLevels[proteinCard.id] || 1;
        const tier = PROTEIN_TIERS[proteinCard.id][level - 1];
        return {
          name: `${tier.name}${sideDescription}${levelSuffix}${emotionalNote}${xlNote}`,
          icon: tier.icon,
          multiplier: tier.multiplier,
          basePoints: tier.basePoints,
          validCardIndices: validIndices
        };
      }

      const mainProtein = validCards.find(i => i.type === 'protein')?.name || 'Protein';
      return {
        name: `${mainProtein}${sideDescription}${levelSuffix}${emotionalNote || " (Home Cooked)"}${xlNote}`,
        icon: '🍽️',
        multiplier: 2,
        basePoints: 10,
        validCardIndices: validIndices
      };
    }

    // 3. Active Diet Cards
    const hasKeto = activeDiets.some(d => d.id === 'keto');
    if (hasKeto && counts.protein >= 2 && counts.carbs === 0) {
      return {
        name: `Keto Protein Feast${sideDescription}${levelSuffix}${emotionalNote}${xlNote}`,
        icon: '🥩',
        multiplier: 3,
        basePoints: 15,
        validCardIndices: validIndices
      };
    }

    const hasCarbLoad = activeDiets.some(d => d.id === 'carbs_only');
    if (hasCarbLoad && counts.carbs >= 2 && counts.protein === 0) {
      return {
        name: `Carb Load Platter${sideDescription}${levelSuffix}${emotionalNote}${xlNote}`,
        icon: '🍞',
        multiplier: 2,
        basePoints: 12,
        validCardIndices: validIndices
      };
    }

    return this.invalidDish("Inedible Mix");
  }

  static invalidDish(reason) {
    return {
      name: `${reason} (Invalid)`,
      icon: '🤢',
      multiplier: 0,
      basePoints: 0,
      validCardIndices: []
    };
  }
}
