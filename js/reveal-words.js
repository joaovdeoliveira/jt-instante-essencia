const TEXT_NODE = 3;

export function revealWords(element, { startMs = 0, stepMs = 200 } = {}) {
  let delay = startMs;
  const visit = (node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType !== TEXT_NODE) {
        visit(child);
        continue;
      }
      const parts = child.textContent.split(/(\s+)/).filter(Boolean).map((part) => {
        if (!part.trim()) return part;
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
