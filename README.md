# What are we eating?

Juego de cartas de cocina en HTML/CSS/JS puro (sin build tool, ES modules nativos).

## Estructura

```
index.html            shell: markup + <link style.css> + <script type="module" src="js/main.js">
style.css              todo el CSS (antes inline)
js/
  data/                catalogos de datos (ya existian): ingredients, dishes, diets, levels
  state.js             estado compartido del juego + catalogos comprables (kitchenware, skills)
  eventBus.js           bus de eventos minimo para comunicar pantallas sin acoplarlas
  utils.js               helpers puros: getCategoryLetter, shuffle, sleep
  ui/
    mainMenu.js         pantalla: start screen + seleccion de mazo
    game.js             pantalla: HUD, mano, tabla de cortar, modales de recetas/review/level-complete
    shop.js             pantalla: supermarket
  main.js               punto de entrada, inicializa las 3 pantallas
```

Las pantallas nunca se importan entre si. Se comunican por `eventBus.js`:
`game:start`, `level:next`, `shop:open`, `state:changed`. Si quieres tocar solo
la tienda, entras a `js/ui/shop.js` y no necesitas leer nada de `game.js`.

## Paso 1 — Subir a GitHub

```bash
cd game
git init
git add .
git commit -m "Reestructurar en modulos de UI"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

Si ya tenias el repo creado en GitHub, cambia la URL de `origin` por la tuya.

## Paso 2 — Activar GitHub Pages

1. En el repo en GitHub: **Settings → Pages**.
2. En "Build and deployment" → Source: **Deploy from a branch**.
3. Branch: **main**, carpeta: **/ (root)**.
4. Guarda. En 1-2 minutos tu juego queda publicado en:
   `https://TU-USUARIO.github.io/TU-REPO/`

Como el proyecto usa `<script type="module">` con imports relativos
(`./ingredients.js`, `../state.js`, etc.), funciona directamente servido como
archivos estaticos — no necesita build ni bundler. Esto es justo lo que
GitHub Pages hace (servir archivos estaticos), por eso es el camino mas
directo para este proyecto.

## Paso 3 — Probar en tu celular

- Abre esa URL directamente en el navegador del telefono (Chrome/Safari).
- Para iterar rapido sin hacer push cada vez: en el celular, conectado a la
  misma red WiFi que tu computadora, corre un servidor local en tu compu:
  ```bash
  cd game
  python3 -m http.server 8000
  ```
  y en el celular entra a `http://IP-DE-TU-COMPUTADORA:8000` (obten la IP
  local con `ipconfig` en Windows o `ifconfig`/`ip addr` en Mac/Linux).
- **Importante:** no abras `index.html` con doble click (`file://...`) — los
  navegadores bloquean `import` de ES modules bajo el protocolo `file://`.
  Siempre necesitas servirlo por `http://` (ya sea GitHub Pages o el server
  local del paso anterior).

## Notas sobre el refactor

- Todo el HTML/CSS/animaciones se preservaron exactamente igual — este fue
  un refactor de estructura de codigo, no un rediseño visual.
- `js/ui/game.js` quedo como el modulo mas grande a proposito: las funciones
  de animacion (`cookSelected`, `drawHand`) intercalan mutacion de estado con
  `await sleep(...)` + `classList` turno a turno. Separar eso en "logica
  pura" + "render" hubiera significado reescribir la coreografia completa de
  animaciones con alto riesgo de romperla, sin beneficio real ya que de
  cualquier forma toda esa logica pertenece a la pantalla "juego".
- Si compras algo en la tienda que afecta el HUD o los slots del juego,
  `shop.js` no llama directo a funciones de `game.js` — emite el evento
  `state:changed` y `game.js` decide como reaccionar. Asi ninguna pantalla
  conoce los detalles internos de renderizado de la otra.
