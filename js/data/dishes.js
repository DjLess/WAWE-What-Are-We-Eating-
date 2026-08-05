import { PROTEIN_TIERS, getProteinTierBonus } from './recipeTiers.js';

export const RECIPE_BOOK = [
  // --- SPECIFIC COMBO RECIPES ---
  // Requieren un ingrediente extra distintivo (pasta, salsa, etc.) mas alla
  // de solo "proteina + lado". Tienen prioridad sobre el plato generico por
  // nivel de proteina, y ademas reciben el bono de nivel si la proteina
  // presente ya fue mejorada en el Supermarket.
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
  // proteinLevels: { beef: 1-3, chicken: 1-3, ... } -- ver recipeTiers.js.
  // Determina que version (Home Cook / especifica / avanzada) de un plato
  // generico basado en proteina se sirve.
  static evaluate(selectedCards, activeDiets = [], proteinLevels = {}) {
    if (!selectedCards || selectedCards.length === 0) {
      return this.invalidDish("Empty Plate");
    }

    // Regla dura: si CUALQUIER carta seleccionada esta congelada o podrida,
    // el plato COMPLETO es invalido.
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

    // Regla: no mezclar ingredientes DISTINTOS dentro de carbs/protein (ej.
    // pescado+carne, arroz+pasta), salvo la dieta "All-You-Can-Eat". Repetir
    // el MISMO ingrediente (ej. 2x Arroz) esta permitido y se marca "(XL)".
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

    const validIndices = selectedCards.map((_, i) => i);
    const tierBonus = getProteinTierBonus(validCards, proteinLevels);

    // 1. Specific combo named recipes (pasta, curry, sauces...). Reciben el
    // bono de nivel de proteina si la proteina del plato ya fue mejorada.
    for (const recipe of RECIPE_BOOK) {
      if (recipe.check(counts, validCards)) {
        return {
          name: `${recipe.name}${emotionalNote}${xlNote}`,
          icon: recipe.icon,
          multiplier: recipe.multiplier + tierBonus.multBonus,
          basePoints: recipe.basePoints + tierBonus.chipsBonus,
          validCardIndices: validIndices
        };
      }
    }

    // 2. Plato generico basado en la proteina: Home Cook -> nombre
    // especifico -> version avanzada, segun el nivel comprado en la tienda.
    if (counts.protein > 0 && (counts.carbs > 0 || counts.vegetable > 0)) {
      const proteinCard = validCards.find(i => i.type === 'protein' && PROTEIN_TIERS[i.id]);

      if (proteinCard) {
        const level = proteinLevels[proteinCard.id] || 1;
        const tier = PROTEIN_TIERS[proteinCard.id][level - 1];
        return {
          name: `${tier.name}${emotionalNote}${xlNote}`,
          icon: tier.icon,
          multiplier: tier.multiplier,
          basePoints: tier.basePoints,
          validCardIndices: validIndices
        };
      }

      // Proteina sin niveles definidos (fallback generico de siempre).
      const mainProtein = validCards.find(i => i.type === 'protein')?.name || 'Protein';
      const mainSide = validCards.find(i => i.type === 'carbs' || i.type === 'vegetable')?.name || 'Side';
      return {
        name: `${mainProtein} with ${mainSide}${emotionalNote || " (Home Cooked)"}${xlNote}`,
        icon: '🍽️',
        multiplier: 2,
        basePoints: 10,
        validCardIndices: validIndices
      };
    }

    // 3. CHECK ACTIVE DIET CARDS (Validates non-standard combos)
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

    // 4. DOES NOT MAKE REAL-LIFE SENSE -> INEDIBLE MIX
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
