export class Diet {
  constructor(id, name, description, type, costForks = 5, allowDuplicateCategories = false) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.costForks = costForks;
    this.allowDuplicateCategories = allowDuplicateCategories;
  }

  // Misma forma que kitchenware: {chips, mult, multX, label} | null. Se evalua
  // como su propia fase de puntuacion, despues de kitchenware.
  scoreEffect(selectedCards) {
    // Excluye frozen/rotten -- aunque en la practica un plato con una carta
    // dañada ya es invalido antes de llegar aqui, esto evita doble conteo.
    const validCards = selectedCards.filter(c => c.state !== 'frozen' && c.state !== 'rotten');

    if (this.type === 'veg') {
      const hasMeat = validCards.some(c => c.tags && (c.tags.includes('meat') || c.tags.includes('fish')));
      return hasMeat ? { chips: -15, label: '-15 Chips' } : null;
    }

    if (this.type === 'sweet') {
      const hasExtra = validCards.some(c => c.type === 'extra');
      return hasExtra ? { chips: 30, label: '+30 Chips' } : null;
    }

    if (this.type === 'keto') {
      const hasCarb = validCards.some(c => c.type === 'carb' || c.type === 'carbs');
      if (hasCarb) return { chips: -25, label: '-25 Chips' };
      const proteinCount = validCards.filter(c => c.type === 'protein').length;
      return proteinCount > 0 ? { chips: proteinCount * 20, label: `+${proteinCount * 20} Chips` } : null;
    }

    if (this.type === 'comfort') {
      const hasMeta = validCards.some(c => c.tags && c.tags.includes('meta'));
      return hasMeta ? { chips: 40, label: '+40 Chips' } : null;
    }

    if (this.type === 'zero_waste') {
      return validCards.length === 5 ? { chips: 50, label: '+50 Chips' } : null;
    }

    if (this.type === 'buffet') {
      return { chips: 15, label: '+15 Chips' };
    }

    return null;
  }
}

export const BASE_DIETS = [
  new Diet('d1', 'Vegetarian', 'Penalizes meat/fish (-15 pts)', 'veg', 5),
  new Diet('d2', 'Sweet Tooth', '+30 pts when Extras are included', 'sweet', 5),
  new Diet('d3', 'Keto Craze', '+20 pts per Protein, but -25 pts if Carbs present', 'keto', 7),
  new Diet('d4', 'Hearty Comfort', '+40 pts when using Metaphorical cards', 'comfort', 6),
  new Diet('d5', 'Zero Waste', '+50 pts when cooking exactly 5 cards at once', 'zero_waste', 8),
  new Diet('d6', 'All-You-Can-Eat', 'Allows multiple ingredients of same category in 1 dish (+15 pts)', 'buffet', 8, true)
];