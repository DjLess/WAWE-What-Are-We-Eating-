// Sistema de niveles de receta: subir de nivel una proteina hace que CUALQUIER
// plato generico basado en ella (proteina + carb/veg, sin combo especifico)
// pase de "home cook" a un nombre de plato mas elevado y especifico, con mas
// Chips y Multiplicador. 3 niveles por proteina, tanto para el mazo regular
// (carne/pescado/huevo) como para el vegetariano (sus sustitutos veganos).
//
// Formato uniforme por nivel: { name, icon, multiplier, basePoints }

export const PROTEIN_TIERS = {
  // --- Mazo Regular ---
  beef: [
    { name: 'Sautéed Beef & Veggies', icon: '🥘', multiplier: 3, basePoints: 18 },
    { name: 'Beef Bourguignon', icon: '🍷', multiplier: 6, basePoints: 30 },
    { name: 'Wagyu Beef Wellington', icon: '👑', multiplier: 9, basePoints: 45 }
  ],
  chicken: [
    { name: 'Chicken Rice Bowl', icon: '🍲', multiplier: 3, basePoints: 18 },
    { name: 'Coq au Vin', icon: '🍷', multiplier: 6, basePoints: 30 },
    { name: 'Truffled Roast Chicken Supreme', icon: '👑', multiplier: 9, basePoints: 45 }
  ],
  fish: [
    { name: 'Pan-Seared Fish Plate', icon: '🐟', multiplier: 3, basePoints: 18 },
    { name: 'Miso Glazed Salmon', icon: '🍶', multiplier: 6, basePoints: 30 },
    { name: 'Omakase Sushi Platter', icon: '🍣', multiplier: 9, basePoints: 45 }
  ],
  egg: [
    { name: 'Cheesy Veggie Omelette', icon: '🍳', multiplier: 3, basePoints: 18 },
    { name: 'Eggs Benedict', icon: '🍋', multiplier: 6, basePoints: 30 },
    { name: 'Soufflé Royale', icon: '👑', multiplier: 9, basePoints: 45 }
  ],

  // --- Mazo Vegetariano/Vegano (sustituto de cada proteina de arriba) ---
  seitan: [ // sustituto de beef
    { name: 'Sautéed Seitan & Veggies', icon: '🥘', multiplier: 3, basePoints: 18 },
    { name: 'Seitan Bourguignon', icon: '🍷', multiplier: 6, basePoints: 30 },
    { name: 'Wellington-Style Seitan Roast', icon: '👑', multiplier: 9, basePoints: 45 }
  ],
  tofu: [ // sustituto de chicken
    { name: 'Tofu Rice Bowl', icon: '🍲', multiplier: 3, basePoints: 18 },
    { name: 'Tofu Katsu Curry', icon: '🍛', multiplier: 6, basePoints: 30 },
    { name: 'Truffled Tofu Supreme', icon: '👑', multiplier: 9, basePoints: 45 }
  ],
  tempeh: [ // sustituto de egg
    { name: 'Tempeh Breakfast Scramble', icon: '🍳', multiplier: 3, basePoints: 18 },
    { name: 'Golden Tempeh Benedict', icon: '🍋', multiplier: 6, basePoints: 30 },
    { name: 'Tempeh Soufflé Deluxe', icon: '👑', multiplier: 9, basePoints: 45 }
  ],
  veggie_burger: [ // sustituto de fish
    { name: 'Pan-Seared Veggie Patty Plate', icon: '🥬', multiplier: 3, basePoints: 18 },
    { name: 'Miso Glazed Veggie Patty', icon: '🍶', multiplier: 6, basePoints: 30 },
    { name: 'Omakase Veggie Platter', icon: '🍣', multiplier: 9, basePoints: 45 }
  ]
};

// Pequeño bono adicional para recetas de combo especifico (pasta, curry,
// wasabi, trufa, etc.) cuando incluyen una proteina ya mejorada -- asi subir
// de nivel una proteina vale la pena en TODAS las recetas que la usan, no
// solo en el plato generico.
export function getProteinTierBonus(ingredients, proteinLevels) {
  const proteinCard = ingredients.find(i => i.type === 'protein' && PROTEIN_TIERS[i.id]);
  if (!proteinCard) return { multBonus: 0, chipsBonus: 0 };

  const level = (proteinLevels && proteinLevels[proteinCard.id]) || 1;
  if (level >= 3) return { multBonus: 3, chipsBonus: 12 };
  if (level === 2) return { multBonus: 1.5, chipsBonus: 6 };
  return { multBonus: 0, chipsBonus: 0 };
}
