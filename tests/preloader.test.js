import { test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { Preloader, easeInOutQuart, curtainPath } from '../js/preloader.js';

test('easeInOutQuart começa em 0, passa por 0,5 no meio e termina em 1', () => {
  assert.equal(easeInOutQuart(0), 0);
  assert.equal(easeInOutQuart(0.5), 0.5);
  assert.equal(easeInOutQuart(1), 1);
  assert.ok(easeInOutQuart(0.25) < 0.25, 'acelera devagar no início');
});

test('curtainPath vai da curva cheia até a borda reta', () => {
  assert.equal(curtainPath(0), 'M0 0 H1000 Q500 320 0 0 Z');
  assert.equal(curtainPath(1), 'M0 0 H1000 Q500 0 0 0 Z');
});

test('Preloader exige ao menos uma palavra', () => {
  assert.throws(() => new Preloader({}, { words: [] }));
});

test('Preloader mostra as palavras em ordem e libera a rolagem ao final', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const classes = new Set();
  const root = { classList: { add: (c) => classes.add(c), remove: (c) => classes.delete(c) } };
  const element = { hidden: false, style: {} };
  const wordElement = { textContent: '' };
  const pathElement = { setAttribute: mock.fn() };

  new Preloader({ root, element, wordElement, pathElement }, { words: ['A', 'B'], reducedMotion: true }).start();

  assert.equal(wordElement.textContent, 'A');
  assert.ok(classes.has('is-loading'), 'trava a rolagem durante a abertura');
  t.mock.timers.tick(250);
  assert.equal(wordElement.textContent, 'B');
  t.mock.timers.tick(250);
  assert.equal(element.hidden, true);
  assert.ok(!classes.has('is-loading'), 'libera a rolagem no fim');
});

test('Preloader anima a cortina até o fim e esconde o elemento', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const frames = [];
  globalThis.requestAnimationFrame = (cb) => frames.push(cb);
  t.after(() => delete globalThis.requestAnimationFrame);
  const start = performance.now();
  const root = { classList: { add() {}, remove: mock.fn() } };
  const element = { hidden: false, style: {} };
  const pathElement = { setAttribute: mock.fn() };

  new Preloader({ root, element, wordElement: {}, pathElement }, { words: ['A'], wordMs: 10, exitMs: 100 }).start();
  t.mock.timers.tick(10);
  frames.shift()(start + 50);
  assert.equal(element.hidden, false, 'ainda no meio da animação');
  frames.shift()(start + 1000);

  assert.equal(element.style.transform, 'translateY(-100%)');
  assert.equal(pathElement.setAttribute.mock.calls.at(-1).arguments[1], curtainPath(1));
  assert.equal(element.hidden, true);
  assert.equal(root.classList.remove.mock.callCount(), 1);
});
