// The lower portfolio is independent of the approved scene and its render loop.
const root = document.querySelector('.nge-below');
const abort = new AbortController();
const options = { signal: abort.signal };
const projects = [...root.querySelectorAll('.nge-project')];
const filters = [...root.querySelectorAll('[data-filter]')];
const toolbar = root.querySelector('.nge-work-toolbar');

for (const button of filters) {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    for (const project of projects) {
      const visible = category === 'all' || project.dataset.category === category;
      project.hidden = !visible;
      if (visible) { count++; project.classList.remove('nge-awaiting'); }
    }
    root.querySelector('#nge-result-count').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`;
  }, options);
}
filters[0].querySelector('span').textContent = String(projects.length).padStart(2, '0');
root.querySelector('#nge-result-count').textContent = `${projects.length} projects`;
toolbar.hidden = false;

// Native details remain useful without JS. One project at a time keeps long pages manageable.
const projectDetails = [...root.querySelectorAll('.nge-project-details')];
for (const details of projectDetails) {
  details.addEventListener('toggle', () => {
    if (details.open) projectDetails.forEach(other => { if (other !== details) other.open = false; });
  }, options);
}

let revealObserver;
if ('IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.remove('nge-awaiting');
      revealObserver.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px 40px 0px', threshold: 0.01 });
  // Only conceal content below the current viewport; hash links never land on an invisible heading.
  for (const el of root.querySelectorAll('[data-reveal]')) {
    if (el.getBoundingClientRect().top > innerHeight) el.classList.add('nge-awaiting');
    revealObserver.observe(el);
  }
}

const navLinks = [...root.querySelectorAll('.nge-nav-links a')];
let sectionObserver;
if ('IntersectionObserver' in window) {
  sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-15% 0px -65% 0px' });
  root.querySelectorAll('.nge-section').forEach(el => sectionObserver.observe(el));
}

const copy = root.querySelector('#nge-copy-name');
const status = root.querySelector('.nge-copy-status');
if (navigator.clipboard?.writeText) {
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('Gangisetty Naga Ganesh Eswar');
      status.textContent = 'Name copied. Search for it on LinkedIn.';
    } catch {
      status.textContent = 'Copy unavailable. Select the name above to search on LinkedIn.';
    }
  }, options);
}

function dispose() {
  abort.abort(); revealObserver?.disconnect(); sectionObserver?.disconnect();
  root.querySelectorAll('.nge-awaiting').forEach(el => el.classList.remove('nge-awaiting'));
}
addEventListener('pagehide', e => { if (!e.persisted) dispose(); }, options);
if (import.meta.hot) import.meta.hot.dispose(dispose);
