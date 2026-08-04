// Pantalla: Supermarket (tienda entre niveles).
// Nunca importa game.js: cuando compra algo que afecta slots/HUD del juego,
// avisa por eventBus ('state:changed') en vez de llamar renderSlots/updateHUD
// directamente. Cuando el jugador confirma "Next Level", emite 'level:next'
// y es game.js quien decide que hacer (incrementar semana, reiniciar).

import { state, KITCHENWARE_DB, CHEF_SKILLS_DB } from '../state.js';
import { BASE_INGREDIENTS, SUPERMARKET_INGREDIENTS } from '../data/ingredients.js';
import { BASE_DIETS } from '../data/diets.js';
import { bus } from '../eventBus.js';

// Las ofertas de la tienda se generan una vez al abrir (o al re-rollar) y
// viven solo en este modulo -- no necesitan persistir en el estado global,
// re-renderizar tras una compra no debe cambiar lo que se esta ofreciendo.
let shopOffers = null;

export function initShop() {
  document.getElementById('ui-next-week-btn').onclick = () => {
    document.getElementById('ui-shop').classList.add('hidden');
    bus.emit('level:next');
  };

  document.getElementById('ui-shop-reroll-btn').onclick = () => rerollOffers();

  bus.on('shop:open', () => {
    generateOffers();
    document.getElementById('ui-shop').classList.remove('hidden');
    renderShopItems();
  });
}

// Toma `count` elementos distintos al azar de `pool`, sin repetir dentro de
// la misma tanda de ofertas.
function pickRandomUnique(pool, count) {
  const copy = [...pool];
  const picked = [];
  for (let i = 0; i < count && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(idx, 1)[0]);
  }
  return picked;
}

function generateShopCard() {
  // El shelf mezcla ingredientes base con las salsas/especialidades avanzadas
  // (Soy Sauce, Truffle Oil, etc.) -- esa es la via normal para conseguirlas
  // fuera del mazo especial, que ya las trae incluidas desde el inicio.
  const pool = [...BASE_INGREDIENTS, ...SUPERMARKET_INGREDIENTS];
  const randomBase = pool[Math.floor(Math.random() * pool.length)];
  const card = { ...randomBase };

  const randState = Math.random();
  if (randState < 0.25) {
    card.state = 'gourmet';
    card.name = `Gourmet ${card.name}`;
    card.costForks = (card.costForks || 3) + 2;
  } else if (randState < 0.45) {
    card.state = 'frozen';
    card.frozenTimer = 1;
    card.name = `Frozen ${card.name}`;
    card.costForks = (card.costForks || 3) + 1;
  } else if (randState < 0.60) {
    card.state = 'expiring';
    card.name = `Fresh ${card.name} (Expiring)`;
    card.costForks = (card.costForks || 3) + 1;
  } else {
    card.state = 'normal';
  }

  return card;
}

function generateOffers() {
  shopOffers = {
    kitchenware: pickRandomUnique(KITCHENWARE_DB, 2).map(item => ({ item, bought: false })),
    diets: pickRandomUnique(BASE_DIETS, 2).map(item => ({ item, bought: false })),
    skills: pickRandomUnique(CHEF_SKILLS_DB, 2).map(item => ({ item, bought: false })),
    ingredients: Array.from({ length: 4 }, () => ({ item: generateShopCard(), bought: false }))
  };
}

// El reroll (maquina de casino) cuesta 1 Fork y vuelve a barajar Kitchenware,
// Diets y Chef Skills. El shelf de ingredientes queda fuera a proposito.
function rerollOffers() {
  if (state.forks < 1) return alert("Not enough Forks to reroll! (Costs 🍴1)");
  state.forks -= 1;

  shopOffers.kitchenware = pickRandomUnique(KITCHENWARE_DB, 2).map(item => ({ item, bought: false }));
  shopOffers.diets = pickRandomUnique(BASE_DIETS, 2).map(item => ({ item, bought: false }));
  shopOffers.skills = pickRandomUnique(CHEF_SKILLS_DB, 2).map(item => ({ item, bought: false }));

  bus.emit('state:changed');
  renderShopItems();
}

function renderOfferCard(containerEl, offer, kind) {
  const item = offer.item;
  const cost = item.costForks || 3;

  let stateBadge = '';
  if (item.state === 'frozen') stateBadge = ' 🧊';
  if (item.state === 'gourmet') stateBadge = ' ✨';
  if (item.state === 'expiring') stateBadge = ' 🔥';

  const desc = item.desc || item.description || (item.multiplierBonus ? `+${item.multiplierBonus}x Mult` : `+${item.points} pts`);

  const cardEl = document.createElement('div');
  cardEl.className = `shop-item${offer.bought ? ' shop-item-bought' : ''}`;
  cardEl.innerHTML = `
    <div class="shop-item-icon">${item.icon || '📜'}</div>
    <div class="shop-item-name">${item.name}${stateBadge}</div>
    <div class="shop-item-desc">${desc}</div>
    <button class="shop-buy-btn" ${offer.bought ? 'disabled' : ''}>${offer.bought ? '✅ Bought' : `Buy 🍴${cost}`}</button>
  `;

  if (!offer.bought) {
    cardEl.querySelector('.shop-buy-btn').onclick = () => buyOffer(offer, kind, cost);
  }

  containerEl.appendChild(cardEl);
}

function renderShopItems() {
  document.getElementById('ui-shop-forks').innerText = state.forks;

  const kitchenwareEl = document.getElementById('ui-shop-kitchenware');
  const dietsEl = document.getElementById('ui-shop-diets');
  const skillsEl = document.getElementById('ui-shop-skills');
  const ingredientsEl = document.getElementById('ui-shop-ingredients');

  kitchenwareEl.innerHTML = '';
  dietsEl.innerHTML = '';
  skillsEl.innerHTML = '';
  ingredientsEl.innerHTML = '';

  shopOffers.kitchenware.forEach(offer => renderOfferCard(kitchenwareEl, offer, 'kitchenware'));
  shopOffers.diets.forEach(offer => renderOfferCard(dietsEl, offer, 'diet'));
  shopOffers.skills.forEach(offer => renderOfferCard(skillsEl, offer, 'skill'));
  shopOffers.ingredients.forEach(offer => renderOfferCard(ingredientsEl, offer, 'ingredient'));
}

function buyOffer(offer, kind, cost) {
  if (state.forks < cost) return alert("Not enough Forks!");

  if (kind === 'kitchenware') {
    if (state.kitchenware.length >= 3) return alert("Kitchenware slots full (3/3)!");
    state.kitchenware.push(offer.item);
  } else if (kind === 'skill') {
    if (state.chefSkills.length >= 2) return alert("Chef Skill slots full (2/2)!");
    state.chefSkills.push(offer.item);
  } else if (kind === 'diet') {
    if (state.activeDiets.length >= 2) return alert("Diet slots full (2/2)!");
    state.activeDiets.push(offer.item);
  } else {
    state.fridgeDeck.push({ ...offer.item });
  }

  state.forks -= cost;
  offer.bought = true;

  bus.emit('state:changed');
  renderShopItems();
}
