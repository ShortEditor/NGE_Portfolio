import { readFileSync } from 'node:fs';

const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Build-time HTML keeps every project readable and indexable without client JavaScript.
export function projectMarkup() {
  const projects = JSON.parse(readFileSync(new URL('../src/data/projects.json', import.meta.url), 'utf8'));
  return projects.map((p, i) => `<article class="nge-project ${p.feature ? 'nge-feature' : ''}" id="project-${escape(p.id)}" data-category="${escape(p.category)}" data-reveal>
    <div class="nge-project-meta"><span>${String(i + 1).padStart(2, '0')} / ${escape(p.label)}</span>${p.link ? `<span aria-hidden="true">↗</span>` : `<span class="nge-project-unlinked">CASE STUDY</span>`}</div>
    ${p.feature ? `<div class="nge-project-specimen" aria-hidden="true"><span>${p.id === 'palzy' ? 'palzy.' : 'NEON<br>COAST'}</span><small>${escape(p.headline).replace('\n','<br>')}</small></div>` : ''}
    <h3>${escape(p.name)}</h3>${p.subtitle ? `<p class="nge-subtitle">${escape(p.subtitle)}</p>` : ''}
    <p class="nge-project-description">${escape(p.description)}</p>
    <details class="nge-project-details"><summary><span>Inside the build</span><span class="nge-plus" aria-hidden="true">+</span></summary>
      <div class="nge-project-content"><p>${escape(p.details)}</p><ul class="nge-tags" aria-label="Technologies">${p.tech.map(t => `<li>${escape(t)}</li>`).join('')}</ul>${p.link ? `<a class="nge-link" href="${escape(p.link)}" target="_blank" rel="noopener noreferrer">${escape(p.linkLabel)} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>` : ''}</div>
    </details>
  </article>`).join('\n');
}
