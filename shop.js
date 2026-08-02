// Pantalla: Supermarket (tienda entre niveles).
// Nunca importa game.js: cuando compra algo que afecta slots/HUD del juego,
// avisa por eventBus ('state:changed') en vez de llamar renderSlots/updateHUD
// directamente. Cuando el jugador confirma "Next Level", emite 'level:next'
// y es game.js quien decide que hacer (incrementar semana, reiniciar).

import { state, KITCHENWARE_DB, CHEF_SKILLS_DB } from '../state.js';
import { BASE_INGREDIENTS } from '../data/ingredients.js';
import { BASE_DIETS } from '../data/diets.js';
import { bus } from '../eventBus.js';

export function initShop() {
  document.getElementById('ui-next-week-btn').onclick = () => {
    document.getElementById('ui-shop').classList.add('hidden');
    bus.emit('level:next');
  };

  bus.on('shop:open', () => {
    document.getElementById('ui-shop').classList.remove('hidden');
    renderShopItems();
  });
}

  function generateShopCard() {
    const randomBase = BASE_INGREDIENTS[Math.floor(Math.random() * BASE_INGREDIENTS.length)];
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

  function renderShopItems() {
    const shopGrid = document.getElementById('ui-shop-items');
    shopGrid.innerHTML = '';

    const shopOptions = [
      KITCHENWARE_DB[Math.floor(Math.random() * KITCHENWARE_DB.length)],
      CHEF_SKILLS_DB[Math.floor(Math.random() * CHEF_SKILLS_DB.length)],
      BASE_DIETS[Math.floor(Math.random() * BASE_DIETS.length)],
      generateShopCard()
    ];

    shopOptions.forEach((item, idx) => {
      const isKitchenware = KITCHENWARE_DB.some(k => k.id === item.id);
      const isSkill = CHEF_SKILLS_DB.some(s => s.id === item.id);
      const isDiet = 'description' in item || BASE_DIETS.some(d => d.name === item.name);

      let stateBadge = '';
      if (item.state === 'frozen') stateBadge = ' 🧊 [Frozen]';
      if (item.state === 'gourmet') stateBadge = ' ✨ [Gourmet]';
      if (item.state === 'expiring') stateBadge = ' 🔥 [Expiring]';

      const cost = item.costForks || 3;
      const itemEl = document.createElement('div');
      itemEl.className = 'shop-item';
      itemEl.innerHTML = `
        <div style="font-size:1.6rem;">${item.icon || '📜'}</div>
        <div style="font-weight:bold; font-size:0.9rem;">${item.name}${stateBadge}</div>
        <div style="font-size: 0.75rem; color: #666;">${item.desc || item.description || (item.multiplierBonus ? `+${item.multiplierBonus}x Mult` : `+${item.points} pts`)}</div>
        <button class="btn btn-cook" style="padding: 6px; font-size: 0.85rem;" id="buy-${idx}">Buy (🍴${cost})</button>
      `;
      shopGrid.appendChild(itemEl);

      document.getElementById(`buy-${idx}`).onclick = () => buyItem(item, cost, isKitchenware, isSkill, isDiet);
    });
  }

  function buyItem(item, cost, isKitchenware, isSkill, isDiet) {
    if (state.forks < cost) return alert("Not enough Forks!");

    if (isKitchenware) {
      if (state.kitchenware.length >= 3) return alert("Kitchenware slots full (3/3)!");
      state.kitchenware.push(item);
    } else if (isSkill) {
      if (state.chefSkills.length >= 2) return alert("Chef Skill slots full (2/2)!");
      state.chefSkills.push(item);
    } else if (isDiet) {
      if (state.activeDiets.length >= 2) return alert("Diet slots full (2/2)!");
      state.activeDiets.push(item);
    } else {
      state.fridgeDeck.push({ ...item });
    }

    state.forks -= cost;
    bus.emit('state:changed');
  }

