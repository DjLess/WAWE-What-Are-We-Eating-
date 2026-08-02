// Estado compartido del juego + catalogos de items comprables en la tienda.
// Cualquier pantalla puede leer/mutar 'state'; los cambios se anuncian via eventBus
// (ver ui/game.js escuchando 'state:changed').

export const MAX_HAND_SIZE = 9;

export const TYPE_ORDER = { carbs: 1, vegetable: 2, protein: 3, spice: 4, dairy: 4, special: 4 };

export const KITCHENWARE_DB = [
  { id: 'skillet', name: 'Cast Iron Skillet', icon: '🍳', costForks: 4, desc: '+3 Mult if dish has Protein' },
  { id: 'blender', name: 'High-Speed Blender', icon: '🌪️', costForks: 4, desc: '+15 Pts for every Vegetable' },
  { id: 'knife', name: "Chef's Knife", icon: '🔪', costForks: 3, desc: '+2 Mult if dish has exactly 1 Protein' },
  { id: 'airfryer', name: 'Air Fryer', icon: '🍟', costForks: 5, desc: '+50 Pts if no Dairy in dish' },
  { id: 'garlic_press', name: 'Garlic Press', icon: '🧄', costForks: 3, desc: '+1 Mult on Spice/Herb dishes' },
  { id: 'spicerack', name: 'Spice Rack', icon: '🌶️', costForks: 4, desc: 'Spice cards give +0.5 Mult' },
  { id: 'containers', name: 'Prep Containers', icon: '🍱', costForks: 6, desc: '+1 Hand Size bonus' },
  { id: 'deepfryer', name: 'Deep Fryer', icon: '🍤', costForks: 5, desc: 'x1.5 Mult bonus on all dishes' },
  { id: 'sousvide', name: 'Sous Vide', icon: '🌡️', costForks: 4, desc: '+20 Pts bonus on Protein cards' },
  { id: 'wok', name: 'Golden Wok', icon: '🥘', costForks: 5, desc: '+$2 Forks on valid Rice/Carb dishes' }
];

export const CHEF_SKILLS_DB = [
  { id: 'flash_freeze', name: 'Flash Freeze', icon: '❄️', costForks: 2, desc: 'Freeze 1 card (1 turn timer)' },
  { id: 'gourmet_touch', name: 'Gourmet Touch', icon: '✨', costForks: 3, desc: 'Make 1 selected card Gourmet (+0.5 Mult)' },
  { id: 'tenderize', name: 'Tenderize', icon: '🔨', costForks: 2, desc: '+15 Base Points to 1 selected card' },
  { id: 'restock', name: 'Pantry Restock', icon: '🔄', costForks: 2, desc: 'Redraw selected cards instantly' },
  { id: 'ferment', name: 'Quick Ferment', icon: '🧪', costForks: 2, desc: 'Add +2 Mult bonus to 1 card' },
  { id: 'marinate', name: 'Marinate', icon: '🥩', costForks: 3, desc: 'Convert 1 card into Protein' },
  { id: 'julienne', name: 'Julienne', icon: '🥕', costForks: 2, desc: 'Convert 1 card into Vegetable' },
  { id: 'grandma_secret', name: 'Grandma Secret', icon: '👵', costForks: 4, desc: "Spawn a Grandma's Hug card" },
  { id: 'clean', name: 'Deep Clean', icon: '🧹', costForks: 2, desc: 'Remove all low-point cards from hand' },
  { id: 'duplicate', name: 'Duplication', icon: '👯', costForks: 4, desc: 'Duplicate 1 selected card' }
];

export let state = {
  week: 1,
  targetScore: 100,
  targetDishes: 2,
  score: 0,
  handsLeft: 4,
  discardsLeft: 3,
  forks: 0,
  fridgeDeck: [],
  hand: [],
  selectedIndices: [],
  kitchenware: [],
  activeDiets: [],
  chefSkills: [],
  finishedDishes: [],
  isAnimating: false,
  sortScoreAscending: false,
  selectedDeckType: 'regular',
  reduceMotion: false
};
