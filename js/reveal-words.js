const TEXT_NODE = 3;

/**
 * Envolve cada palavra de `element` num <span class="tg-word"> com atraso crescente,
 * mantendo as tags internas (<em>, <br>...). O CSS faz a palavra surgir.
 * Devolve o instante, em ms, em que a próxima palavra começaria.
 */
export function revealWords(element, { startMs = 0, stepMs = 200 } = {}) {
  let delay = startMs;
  const visit = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType !== TEXT_NODE) {
        visit(child);
        continue;
      }
      const parts = child.textContent.split(/(\s+)/).filter(Boolean).map((part) => {
        if (!part.trim()) return part; // espaço continua texto puro
        const span = element.ownerDocument.createElement('span');
        span.className = 'tg-word';
        span.textContent = part;
        span.style.animationDelay = `${delay}ms`;
        delay += stepMs;
        return span;
      });
      child.replaceWith(...parts);
    }
  };
  visit(element);
  return delay;
}
