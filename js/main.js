import { Preloader } from './preloader.js';
import { revealWords } from './reveal-words.js';

// Textos e tempos do preloader ficam aqui; a classe não sabe nada sobre esta página.
const PRELOADER_OPTIONS = {
  words: ['O olhar', 'A emoção', 'A memória'],
  wordMs: 1000,
  exitMs: 900,
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
};

const element = document.getElementById('preloader');
const wordElement = document.getElementById('preloader-word');
const pathElement = document.getElementById('preloader-path');

if (element && wordElement && pathElement) {
  new Preloader({ root: document.documentElement, element, wordElement, pathElement }, PRELOADER_OPTIONS).start();
}

// Título e subtítulo da home surgem palavra por palavra; os botões só entram quando o texto termina.
const WORD_FADE_MS = 500; // mesma duração da animação tg-in em css/styles.css
const SUBTITLE_STEP_MS = 80;
const hero = document.querySelector('.hero');
if (hero) {
  const titleEnd = revealWords(hero.querySelector('h1'), { stepMs: 200 });
  const subtitleEnd = revealWords(hero.querySelector('p'), { startMs: titleEnd, stepMs: SUBTITLE_STEP_MS });
  // subtitleEnd é quando a próxima palavra começaria; a última começou um passo antes
  const textVisible = subtitleEnd - SUBTITLE_STEP_MS + WORD_FADE_MS;
  hero.querySelector('.row').style.animationDelay = `${textVisible}ms`;
}
