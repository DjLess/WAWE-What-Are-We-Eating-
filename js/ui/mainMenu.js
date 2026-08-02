// Pantalla: Menu principal (start screen + seleccion de mazo)
// No conoce nada de game.js ni de shop.js: solo emite 'game:start'
// por el eventBus cuando el jugador elige un mazo.

import { bus } from '../eventBus.js';

export function initMainMenu() {
  document.getElementById('ui-btn-goto-deck-select').onclick = () => {
    document.getElementById('ui-start-screen').classList.add('hidden');
    document.getElementById('ui-deck-screen').classList.remove('hidden');
  };

  document.getElementById('ui-btn-back-start').onclick = () => {
    document.getElementById('ui-deck-screen').classList.add('hidden');
    document.getElementById('ui-start-screen').classList.remove('hidden');
  };

  document.getElementById('deck-regular').onclick = () => selectDeck('regular');
  document.getElementById('deck-vegetarian').onclick = () => selectDeck('vegetarian');
  document.getElementById('deck-special').onclick = () => selectDeck('special');
}

function selectDeck(deckType) {
  document.getElementById('ui-deck-screen').classList.add('hidden');
  bus.emit('game:start', { deckType });
}
