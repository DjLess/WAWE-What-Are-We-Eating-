// Helpers puros compartidos por las pantallas. Sin estado, sin DOM.

export function getCategoryLetter(type) {
  if (type === 'carbs') return 'C';
  if (type === 'vegetable') return 'V';
  if (type === 'protein') return 'P';
  return 'S';
}

export function shuffle(arr) {
  arr.sort(() => Math.random() - 0.5);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
