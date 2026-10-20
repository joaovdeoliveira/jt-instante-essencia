import { test } from 'node:test';
import assert from 'node:assert/strict';
import { revealWords } from '../js/reveal-words.js';

const doc = { createElement: () => ({ nodeType: 1, childNodes: [], style: {} }) };
const asNode = (n) => (typeof n === 'string' ? { nodeType: 3, textContent: n } : n);
function el(...children) {
  const node = { nodeType: 1, childNodes: [], ownerDocument: doc };
  for (const child of children.map(asNode)) {
    child.replaceWith = (...parts) => node.childNodes.splice(node.childNodes.indexOf(child), 1, ...parts.map(asNode));
    node.childNodes.push(child);
  }
  return node;
}
const words = (node) => node.childNodes.filter((n) => n.className === 'tg-word');

test('revealWords envolve cada palavra, mantém tags internas e escalona os atrasos', () => {
  const em = el('a sua história.');
  const h1 = el('O meu olhar, ', em);

  const end = revealWords(h1, { startMs: 100, stepMs: 200 });

  assert.deepEqual(words(h1).map((w) => w.textContent), ['O', 'meu', 'olhar,']);
  assert.equal(h1.childNodes.at(-1), em, 'o <em> continua no lugar');
  assert.deepEqual(words(em).map((w) => w.textContent), ['a', 'sua', 'história.']);
  assert.deepEqual([...words(h1), ...words(em)].map((w) => w.style.animationDelay), ['100ms', '300ms', '500ms', '700ms', '900ms', '1100ms']);
  assert.equal(end, 1300);
  assert.equal(h1.childNodes.filter((n) => n.nodeType === 3).map((n) => n.textContent).join(''), '   ', 'os espaços entre palavras ficam');
});
