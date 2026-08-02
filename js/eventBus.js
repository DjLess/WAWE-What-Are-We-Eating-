// Bus de eventos minimo para que las pantallas (mainMenu, game, shop) no se
// importen entre si directamente. Cada pantalla emite lo que le pasa y
// escucha solo lo que le interesa.
const target = new EventTarget();

export const bus = {
  emit(type, detail) {
    target.dispatchEvent(new CustomEvent(type, { detail }));
  },
  on(type, handler) {
    target.addEventListener(type, (e) => handler(e.detail));
  }
};
