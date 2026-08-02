// Punto de entrada. Su unico trabajo es inicializar las 3 pantallas.
// El orden no importa: ninguna pantalla llama a otra directamente,
// solo se comunican por eventBus (ver js/eventBus.js).

import { initMainMenu } from './ui/mainMenu.js';
import { initGameScreen } from './ui/game.js';
import { initShop } from './ui/shop.js';

initMainMenu();
initGameScreen();
initShop();
