// Slim audio player for Ganesh's own tracks.
// Never autoplays: the bar and the Audio element only exist after an explicit
// tap/click on a track row. One shared Audio = one track at a time.
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
if (group) {
  const rows = [...group.querySelectorAll('li')].filter(li => {
    const name = li.querySelector('span')?.textContent.trim();
    return name && TRACKS[name];
  });
  if (rows.length) init(rows);
}

function init(rows) {
  let audio = null, bar = null, current = null;

  rows.forEach(li => {
    const title = li.querySelector('span').textContent.trim();
    li.classList.add('nge-track');
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.setAttribute('aria-pressed', 'false');
    li.setAttribute('aria-label', `Play ${title}`);
    li.addEventListener('click', () => toggle(title, li));
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(title, li); }
    });
  });

  function toggle(title, li) {
    build();
    if (current === title && !audio.paused) { pause(); return; }
    if (current !== title) {
      audio.src = base + TRACKS[title];
      current = title;
      bar.querySelector('.nge-player-title strong').textContent = title;
      bar.querySelector('.nge-player-range').value = 0;
      bar.querySelector('.nge-player-time').textContent = '0:00 / –:––';
      announce(`Playing ${title}`);
    }
    audio.play().catch(() => announce(`Couldn't play ${title}`));
    paint();
  }

  function pause() { audio.pause(); paint(); announce(`Paused ${current}`); }

  function build() {
    if (bar) return;
    audio = new Audio();
    audio.preload = 'none';
    bar = document.createElement('div');
    bar.className = 'nge-player';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Music player');
    bar.innerHTML = `
      <button type="button" class="nge-player-play" aria-label="Pause"><span></span></button>
      <p class="nge-player-title"><strong></strong><small>NAGA GANESH ESWAR</small></p>
      <input type="range" class="nge-player-range" min="0" max="1000" value="0" step="1" aria-label="Seek">
      <span class="nge-player-time">0:00 / –:––</span>
      <button type="button" class="nge-player-mute" aria-label="Mute">SOUND ON</button>
      <button type="button" class="nge-player-close" aria-label="Close player">×</button>
      <span class="nge-visually-hidden" aria-live="polite"></span>`;
    document.body.appendChild(bar);
    requestAnimationFrame(() => requestAnimationFrame(() => bar.classList.add('is-open')));
    document.body.classList.add('nge-player-open');

    const playBtn = bar.querySelector('.nge-player-play');
    const range = bar.querySelector('.nge-player-range');
    const time = bar.querySelector('.nge-player-time');
    const muteBtn = bar.querySelector('.nge-player-mute');

    playBtn.addEventListener('click', () => {
      if (!current) return;
      audio.paused ? audio.play().catch(() => {}) : audio.pause();
      paint();
    });
    muteBtn.addEventListener('click', () => {
      audio.muted = !audio.muted;
      muteBtn.textContent = audio.muted ? 'MUTED' : 'SOUND ON';
      muteBtn.setAttribute('aria-label', audio.muted ? 'Unmute' : 'Mute');
    });
    bar.querySelector('.nge-player-close').addEventListener('click', () => {
      audio.pause();
      bar.classList.remove('is-open');
      document.body.classList.remove('nge-player-open');
      current = null;
      paint();
    });
    range.addEventListener('input', () => {
      if (audio.duration) audio.currentTime = (range.value / 1000) * audio.duration;
    });
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        range.value = Math.round((audio.currentTime / audio.duration) * 1000);
        time.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
      }
    });
    audio.addEventListener('loadedmetadata', () => {
      time.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
    });
    audio.addEventListener('ended', paint);
    audio.addEventListener('play', paint);
    audio.addEventListener('pause', paint);
  }

  function paint() {
    const playing = current && !audio.paused && !audio.ended;
    bar.querySelector('.nge-player-play').classList.toggle('is-playing', !!playing);
    bar.querySelector('.nge-player-play').setAttribute('aria-label', playing ? 'Pause' : 'Play');
    rows.forEach(li => {
      const name = li.querySelector('span').textContent.trim();
      const isCurrent = name === current;
      li.classList.toggle('is-playing', isCurrent && !!playing);
      li.classList.toggle('is-paused', isCurrent && !playing && !audio.ended);
      li.setAttribute('aria-pressed', isCurrent && playing ? 'true' : 'false');
      li.setAttribute('aria-label', `${isCurrent && playing ? 'Pause' : 'Play'} ${name}`);
    });
  }

  function announce(msg) { bar.querySelector('[aria-live]').textContent = msg; }
  function fmt(s) { if (!isFinite(s)) return '–:––'; s = Math.floor(s); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }
}
