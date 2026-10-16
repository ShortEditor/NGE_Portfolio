// Splits the big section headlines into letter spans so each letter can
// answer a hover or a tap with a small lift. Decorative only: the text is
// unchanged for readers, selection and screen readers, and the site's
// Reduce motion toggle (or OS setting) turns the response off.
for (const line of document.querySelectorAll('.nge-hline-in')) splitNode(line);

function splitNode(node) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      for (const ch of child.textContent) {
        if (ch === ' ') { frag.appendChild(document.createTextNode(' ')); continue; }
        const s = document.createElement('span');
        s.className = 'nge-h2-l';
        s.textContent = ch;
        frag.appendChild(s);
      }
      node.replaceChild(frag, child);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      splitNode(child);
    }
  }
}
