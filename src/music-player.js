// The track rows are the player. Tap a row to play or pause it, tap another
// to switch. The playing title's letters react to the music through a Web
// Audio analyser, and a thin underline inside the row fills as the track
// progresses; drag along the row's lower edge to seek. No separate chrome.
const TRACKS = {
  'Sudarshan Dhari': 'music/sudarshan-dhari.mp3',
  'Venkateshwara Raaga': 'music/venkateshwara-raaga.mp3',
  'Detective Arjun theme': 'music/detective-arjun-theme.mp3',
  'Shantakaram': 'music/shantakaram.mp3',
  'Alien Hand title card': 'music/alien-hand-title-card.mp3',
  'Thunderous Resolve': 'music/thunderous-resolve.mp3',
};

const base = import.meta.env.BASE_URL || '/';
const group = document.querySelectorAll('.nge-catalog-group')[1];
const reduced = () =>
  document.body.classList.contains('is-reduced') ||
  matchMedia('(prefers-reduced-motion: reduce)').matches;

if (group) {
  const rows = [...group.querySelectorAll('li')].filter(li => {
    const name = li.querySelector('span')?.textContent.trim();
    return name && TRACKS[name];
  });
  if (rows.length) init(rows);
}

function init(rows) {
  let audio = null, ctx = null, analyser = null, freq = null;
  let current = null, activeLi = null, letters = [], raf = 0;

  const live = document.createElement('span');
  live.className = 'nge-visually-hidden';
  live.setAttribute('aria-live', 'polite');
  group.appendChild(live);
  const say = msg => { live.textContent = msg; };

  rows.forEach(li => {
    const title = li.querySelector('span').textContent.trim();
    li.classList.add('nge-track');
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.setAttribute('aria-pressed', 'false');
    li.setAttribute('aria-label', `Play ${title}`);

    const strip = document.createElement('span');
    strip.className = 'nge-track-strip';
    strip.setAttribute('aria-hidden', 'true');
    const prog = document.createElement('span');
    prog.className = 'nge-track-progress';
    strip.appendChild(prog);
    li.appendChild(strip);

    li.addEventListener('click', () => toggle(title, li));
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(title, li); }
    });

    strip.addEventListener('pointerdown', e => {
      if (current !== title || !audio || !audio.duration) return;
      e.stopPropagation();
      e.preventDefault();
      try { strip.setPointerCapture(e.pointerId); } catch {}
      const seek = ev => {
        const r = strip.getBoundingClientRect();
        const f = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
        audio.currentTime = f * audio.duration;
        paintProgress(li, f);
      };
      const move = ev => seek(ev);
      const up = () => {
        strip.removeEventListener('pointermove', move);
        strip.removeEventListener('pointerup', up);
        strip.removeEventListener('pointercancel', up);
      };
      strip.addEventListener('pointermove', move);
      strip.addEventListener('pointerup', up);
      strip.addEventListener('pointercancel', up);
      seek(e);
    });
  });

  function ensureGraph() {
    if (audio) return;
    audio = new Audio();
    audio.preload = 'auto';
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        ctx = new AC();
        const src = ctx.createMediaElementSource(audio);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.72;
        src.connect(analyser);
        analyser.connect(ctx.destination);
        freq = new Uint8Array(analyser.frequencyBinCount);
      }
    } catch { ctx = analyser = null; }
    audio.addEventListener('timeupdate', () => {
      if (activeLi && audio.duration) paintProgress(activeLi, audio.currentTime / audio.duration);
    });
    audio.addEventListener('ended', () => {
      if (activeLi) {
        setState(activeLi, '');
        paintProgress(activeLi, 0);
        unwrap(activeLi);
        activeLi.setAttribute('aria-pressed', 'false');
        activeLi.setAttribute('aria-label', `Play ${current}`);
        say(`${current} finished`);
      }
      stopViz();
    });
  }

  function toggle(title, li) {
    ensureGraph();
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
    if (current === title && !audio.paused) {
      audio.pause();
      setState(li, 'is-paused');
      li.setAttribute('aria-label', `Resume ${title}`);
      stopViz();
      say(`Paused ${title}`);
      return;
    }
    if (current !== title) {
      if (activeLi) {
        setState(activeLi, '');
        paintProgress(activeLi, 0);
        unwrap(activeLi);
        activeLi.setAttribute('aria-pressed', 'false');
        activeLi.setAttribute('aria-label', `Play ${current}`);
      }
      audio.src = base + TRACKS[title];
      current = title;
      activeLi = li;
      wrap(li);
      li.setAttribute('aria-pressed', 'true');
    }
    audio.play()
      .then(() => { setState(li, 'is-playing'); li.setAttribute('aria-label', `Pause ${title}`); say(`Playing ${title}`); startViz(); })
      .catch(() => say(`Couldn't play ${title}`));
  }

  function setState(li, cls) {
    li.classList.remove('is-playing', 'is-paused');
    if (cls) li.classList.add(cls);
  }

  function paintProgress(li, f) {
    const p = li.querySelector('.nge-track-progress');
    if (p) p.style.width = `${(f * 100).toFixed(1)}%`;
  }

  // Split the title into per-letter spans once; restore plain text on unwrap.
  function wrap(li) {
    const span = li.querySelector('span');
    if (!span || span.dataset.vizReady) { letters = span ? [...span.querySelectorAll('.nge-viz-l')] : []; return; }
    const text = span.textContent;
    span.dataset.vizReady = '1';
    span.dataset.plain = text;
    span.textContent = '';
    for (const ch of text) {
      if (ch === ' ') { span.appendChild(document.createTextNode(' ')); continue; }
      const s = document.createElement('span');
      s.className = 'nge-viz-l';
      s.textContent = ch;
      span.appendChild(s);
    }
    letters = [...span.querySelectorAll('.nge-viz-l')];
  }

  function unwrap(li) {
    stopViz();
    const span = li.querySelector('span');
    if (span && span.dataset.vizReady) {
      span.textContent = span.dataset.plain;
      delete span.dataset.vizReady;
      delete span.dataset.plain;
    }
    letters = [];
  }

  function startViz() {
    stopViz();
    if (!analyser || !letters.length) return;
    const n = letters.length;
    const bins = freq.length;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (reduced()) { letters.forEach(l => { l.style.transform = ''; }); return; }
      analyser.getByteFrequencyData(freq);
      for (let i = 0; i < n; i++) {
        // Bias toward the low end so the letters ride the beat, not the hiss.
        const bin = Math.min(bins - 1, Math.floor(Math.pow(i / n, 1.7) * bins * 0.55) + 2);
        const v = freq[bin] / 255;
        const lift = (-v * 3.2).toFixed(2);
        const grow = (1 + v * 0.18).toFixed(3);
        letters[i].style.transform = `translateY(${lift}px) scaleY(${grow})`;
      }
    };
    tick();
  }

  function stopViz() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    letters.forEach(l => { l.style.transform = ''; });
  }
}
