export const RECIPE_BOOK = [
  // --- NAMED CLASSIC REAL-LIFE DISHES ---
  {
    id: 'stir_fry_beef',
    name: 'Sautéed Beef & Veggies',
    icon: '🥘',
    multiplier: 4,
    basePoints: 25,
    desc: 'Beef + Rice/Potato + Onion/Tomato',
    check: (counts, ingredients) => {
      const hasBeef = ingredients.some(i => i.id === 'beef');
      const hasCarb = counts.carbs > 0;
      const hasVeg = counts.vegetable > 0;
      return hasBeef && hasCarb && hasVeg;
    }
  },
  {
    id: 'chicken_rice_veggies',
    name: 'Chicken Rice Bowl',
    icon: '🍲',
    multiplier: 3,
    basePoints: 20,
    desc: 'Chicken + Rice + Any Vegetable',
    check: (counts, ingredients) => {
      const hasChicken = ingredients.some(i => i.id === 'chicken');
      const hasRice = ingredients.some(i => i.id === 'rice');
      return hasChicken && hasRice && counts.vegetable > 0;
    }
  },
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
    id: 'veggie_omelette',
    name: 'Cheesy Veggie Omelette',
    icon: '🍳',
    multiplier: 3,
    basePoints: 15,
    desc: 'Egg + Vegetable + Cheese/Butter',
    check: (counts, ingredients) => {
      const hasEgg = ingredients.some(i => i.id === 'egg');
      const hasDairy = counts.dairy > 0;
      return hasEgg && counts.vegetable > 0 && hasDairy;
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

  // --- VEGAN DISHES (Vegetarian Deck) ---
  {
    id: 'vegan_stir_fry',
    name: 'Sautéed Tofu & Veggies',
    icon: '🥘',
    multiplier: 4,
    basePoints: 25,
    desc: 'Plant Protein + Rice/Potato + Onion/Tomato',
    check: (counts, ingredients) => {
      const hasPlantProtein = ingredients.some(i => i.tags && i.tags.includes('plant_protein'));
      return hasPlantProtein && counts.carbs > 0 && counts.vegetable > 0;
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
  {
    id: 'vegan_scramble',
    name: 'Vegan Tofu Scramble',
    icon: '🍳',
    multiplier: 3,
    basePoints: 15,
    desc: 'Plant Protein + Vegetable + Vegan Cheese/Butter',
    check: (counts, ingredients) => {
      const hasPlantProtein = ingredients.some(i => i.tags && i.tags.includes('plant_protein'));
      const hasVeganDairy = ingredients.some(i => i.tags && i.tags.includes('vegan') && i.type === 'dairy');
      return hasPlantProtein && counts.vegetable > 0 && hasVeganDairy;
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
  static evaluate(selectedCards, activeDiets = []) {
    if (!selectedCards || selectedCards.length === 0) {
      return this.invalidDish("Empty Plate");
    }

    // Regla dura: si CUALQUIER carta seleccionada esta congelada o podrida,
    // el plato COMPLETO es invalido -- ya no se descarta solo esa carta y se
    // evalua el resto, un solo ingrediente en mal estado arruina el plato.
    const hasSpoiledCard = selectedCards.some(c => c.state === 'frozen' || c.state === 'rotten');
    if (hasSpoiledCard) {
      return this.invalidDish("Spoiled Ingredient");
    }

    const validCards = selectedCards;

    // Category counters
    const counts = { carbs: 0, vegetable: 0, protein: 0, spice: 0, dairy: 0, sauce: 0, special: 0 };
    validCards.forEach(c => {
      if (counts[c.type] !== undefined) counts[c.type]++;
      else counts.special++;
    });

    // Regla: no mezclar ingredientes DISTINTOS dentro de las categorias
    // "estructurales" (carbs, protein) -- ej. pescado+carne, arroz+pasta no
    // van juntos en la mayoria de los casos. La dieta "All-You-Can-Eat"
    // (allowDuplicateCategories) permite saltarse esta regla. Repetir el
    // MISMO ingrediente (ej. 2x Arroz) siempre esta permitido y se marca
    // como porcion "XL".
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

    // Check for Emotional / Metaphorical modifiers in the dish
    let emotionalNote = "";
    if (validCards.some(i => i.id === 'love')) emotionalNote = " (Made with Love)";
    else if (validCards.some(i => i.id === 'patience')) emotionalNote = " (Cooked with Patience)";
    else if (validCards.some(i => i.id === 'grandma_hug')) emotionalNote = " (Grandma's Style)";

    const validIndices = selectedCards.map((_, i) => i);

    // 1. Check Specific Named Recipes
    for (const recipe of RECIPE_BOOK) {
      if (recipe.check(counts, validCards)) {
        return {
          name: `${recipe.name}${emotionalNote}${xlNote}`,
          icon: recipe.icon,
          multiplier: recipe.multiplier,
          basePoints: recipe.basePoints,
          validCardIndices: validIndices
        };
      }
    }

    // 2. Descriptive Household Plate (Full Trio: Protein + Carb + Veggie)
    if (counts.protein > 0 && counts.carbs > 0 && counts.vegetable > 0) {
      const mainProtein = validCards.find(i => i.type === 'protein')?.name || 'Protein';
      const mainCarb = validCards.find(i => i.type === 'carbs')?.name || 'Carbs';

      return {
        name: `${mainProtein} with ${mainCarb} and Veggies${emotionalNote || " (Home Cooked)"}${xlNote}`,
        icon: '🍽️',
        multiplier: 2,
        basePoints: 10,
        validCardIndices: validIndices
      };
    }

    // 3. Basic Home Meal (Protein + Carb OR Protein + Veggie)
    if ((counts.protein > 0 && counts.carbs > 0) || (counts.protein > 0 && counts.vegetable > 0)) {
      const mainProtein = validCards.find(i => i.type === 'protein')?.name || 'Protein';
      const side = validCards.find(i => i.type === 'carbs' || i.type === 'vegetable')?.name || 'Side';

      return {
        name: `${mainProtein} with ${side}${emotionalNote}${xlNote}`,
        icon: '🍱',
        multiplier: 2,
        basePoints: 8,
        validCardIndices: validIndices
      };
    }

    // 4. CHECK ACTIVE DIET CARDS (Validates non-standard combos)
    const hasKeto = activeDiets.some(d => d.id === 'keto');
    if (hasKeto && counts.protein >= 2 && counts.carbs === 0) {
      return {
        name: `Keto Protein Feast${emotionalNote}${xlNote}`,
        icon: '🥩',
        multiplier: 3,
        basePoints: 15,
        validCardIndices: validIndices
      };
    }

    const hasCarbLoad = activeDiets.some(d => d.id === 'carbs_only');
    if (hasCarbLoad && counts.carbs >= 2 && counts.protein === 0) {
      return {
        name: `Carb Load Platter${emotionalNote}${xlNote}`,
        icon: '🍞',
        multiplier: 2,
        basePoints: 12,
        validCardIndices: validIndices
      };
    }

    // 5. DOES NOT MAKE REAL-LIFE SENSE -> INEDIBLE MIX
    return this.invalidDish("Inedible Mix");
  }

  static invalidDish(reason) {
    return {
      name: `${reason} (Invalid)`,
      icon: '🤢',
      multiplier: 0,
      basePoints: 0,
      validCardIndices: [] // Cards won't score
    };
  }
}
