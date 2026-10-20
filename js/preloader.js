/** Curva de animação "ease-in-out quart" para t entre 0 e 1. */
export const easeInOutQuart = (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

/** Desenho SVG da borda curva da cortina; progress 0 = curva cheia, 1 = reta. */
export const curtainPath = (progress) => `M0 0 H1000 Q500 ${320 * (1 - progress)} 0 0 Z`;

const LOADING_CLASS = 'is-loading';
const REDUCED_WORD_MS = 250;

/**
 * Tela de abertura: mostra uma sequência de palavras e depois sobe como cortina.
 * Recebe os elementos e as opções por parâmetro, então não conhece seletores nem textos.
 */
export class Preloader {
  #root;
  #element;
  #word;
  #path;
  #words;
  #wordMs;
  #exitMs;
  #reducedMotion;

  constructor({ root, element, wordElement, pathElement }, { words, wordMs = 1000, exitMs = 900, reducedMotion = false }) {
    if (!words?.length) throw new Error('Preloader precisa de ao menos uma palavra.');
    this.#root = root;
    this.#element = element;
    this.#word = wordElement;
    this.#path = pathElement;
    this.#words = words;
    this.#wordMs = reducedMotion ? REDUCED_WORD_MS : wordMs;
    this.#exitMs = exitMs;
    this.#reducedMotion = reducedMotion;
  }

  start() {
    this.#root.classList.add(LOADING_CLASS);
    this.#showWord(0);
  }

  #showWord(index) {
    if (index >= this.#words.length) {
      this.#exit();
      return;
    }
    this.#word.textContent = this.#words[index];
    setTimeout(() => this.#showWord(index + 1), this.#wordMs);
  }

  #exit() {
    if (this.#reducedMotion) {
      this.#finish();
      return;
    }
    const startedAt = performance.now();
    const step = (now) => {
      const t = Math.min((now - startedAt) / this.#exitMs, 1);
      const eased = easeInOutQuart(t);
      this.#element.style.transform = `translateY(${-100 * eased}%)`;
      this.#path.setAttribute('d', curtainPath(eased));
      if (t < 1) requestAnimationFrame(step);
      else this.#finish();
    };
    requestAnimationFrame(step);
  }

  #finish() {
    this.#element.hidden = true;
    this.#root.classList.remove(LOADING_CLASS);
  }
}
