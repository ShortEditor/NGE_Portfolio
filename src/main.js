import { clamp, sampleTimeline } from './timeline.js';

const $ = selector => document.querySelector(selector);
const stage = $('#stage'), journey = $('.journey'), scene = $('.scene');
const opening = $('#opening-copy'), identity = $('#identity'), meet = $('#meet-link');
const fill = $('#timeline-fill'), cue = $('#scroll-cue');
const toggle = $('#motion-toggle'), loader = $('#loading');
const layerElements = [$('#layer-bg'), $('#layer-hill'), $('#layer-subject')];
const systemMotion = matchMedia('(prefers-reduced-motion: reduce)');
const coarsePointer = matchMedia('(pointer: coarse)');
const query = new URLSearchParams(location.search);
let savedMotion;
try { savedMotion = localStorage.getItem('nge-reduced-motion'); } catch { /* storage is optional */ }
let reduced = savedMotion === null || savedMotion === undefined ? systemMotion.matches : savedMotion === 'true';
let renderer, ready = false, active = true, raf = 0, disposed = false;
let rendererGeneration = 0;
let width = innerWidth, height = innerHeight, target = 0, progress = 0;
let lastTime = 0, slowFrames = 0, sampleCount = 0, frameSum = 0, qualityStep = 0;
const pointer = { x: 0, y: 0 }, pointerTarget = { x: 0, y: 0 };
let aspects = { background: 16 / 9, hill: 2.65, subject: 1.14 };
const abort = new AbortController(), listener = { signal: abort.signal };
let images = [];

function applyMotionPreference() {
  document.body.classList.toggle('is-reduced', reduced);
  toggle.setAttribute('aria-pressed', String(reduced));
  toggle.firstChild.textContent = reduced ? 'Motion reduced ' : 'Reduce motion ';
  if (reduced) { pointer.x = pointer.y = pointerTarget.x = pointerTarget.y = 0; progress = target = 1; }
  resize();
}

function updateTarget() {
  const max = journey.offsetHeight - height;
  target = reduced ? 1 : clamp((scrollY - journey.offsetTop) / Math.max(1, max));
  wake();
}

function wake() {
  if (!raf && ready && active && !document.hidden && !disposed) { lastTime = performance.now(); raf = requestAnimationFrame(tick); }
}

function applyRect(el, rect) {
  el.style.width = `${rect.w.toFixed(2)}px`;
  el.style.height = `${rect.h.toFixed(2)}px`;
  el.style.transform = `translate3d(${rect.x.toFixed(2)}px,${rect.y.toFixed(2)}px,0)`;
}

function render() {
  const state = sampleTimeline(reduced ? 1 : progress, width, height, pointer, aspects);
  if (reduced) state.burst = 0;
  // Shared geometry keeps the no-WebGL presentation aligned with the shader view.
  applyRect(layerElements[0], state.background);
  applyRect(layerElements[1], state.hill);
  applyRect(layerElements[2], state.subject);
  if (renderer) renderer.render(state);
  opening.style.opacity = state.opening;
  const show = state.reveal > .01;
  identity.style.opacity = state.reveal;
  identity.style.visibility = show ? 'visible' : 'hidden';
  identity.style.pointerEvents = show ? 'auto' : 'none';
  identity.setAttribute('aria-hidden', String(!show));
  meet.tabIndex = show ? 0 : -1;
  fill.style.transform = `scaleX(${state.p})`;
  cue.style.opacity = String(reduced ? 1 : Math.max(.3, 1 - state.p));
  stage.dataset.progress = state.p.toFixed(3);
}

function tick(now) {
  raf = 0;
  const dt = Math.min((now - lastTime) / 1000, .06); lastTime = now;
  const damp = 1 - Math.exp(-dt * 10);
  progress += (target - progress) * damp;
  pointer.x += (pointerTarget.x - pointer.x) * damp;
  pointer.y += (pointerTarget.y - pointer.y) * damp;
  if (Math.abs(target - progress) < .00015) progress = target;
  render();
  // Adapt only from sustained active-frame timing, never from idle time or hidden tabs.
  if (renderer && Math.abs(target - progress) > .005 && dt > 0) {
    sampleCount++; frameSum += dt;
    if (sampleCount >= 36) {
      slowFrames = frameSum / sampleCount > .027 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
      sampleCount = frameSum = 0;
      if (slowFrames >= 2 && qualityStep < 2) { qualityStep++; slowFrames=0; resizeRenderer(); }
    }
  }
  const moving = Math.abs(target - progress) > .0001 || Math.abs(pointerTarget.x - pointer.x) > .001 || Math.abs(pointerTarget.y - pointer.y) > .001;
  if (moving && active && !document.hidden) raf = requestAnimationFrame(tick);
}

function resizeRenderer() {
  if (!renderer) return;
  const maxDpr = width < 801 ? 1.25 : 1.5;
  const dpr = Math.max(.75, Math.min(devicePixelRatio || 1, maxDpr) - qualityStep * .25);
  renderer.quality = width < 801 || qualityStep > 0 ? 0 : 1;
  renderer.resize(width, height, dpr);
}

function resize() {
  width = stage.clientWidth; height = stage.clientHeight;
  resizeRenderer(); updateTarget();
  if (ready) { if (reduced) progress = 1; render(); }
}

function fallback() {
  rendererGeneration++;
  scene.classList.remove('has-webgl');
  renderer?.dispose(); renderer = undefined;
  stage.dataset.renderer = 'dom';
  if (ready) render();
}

async function startRenderer() {
  if (query.has('no-webgl') || reduced) { fallback(); return; }
  const generation = ++rendererGeneration;
  try {
    const { SceneRenderer } = await import('./renderer.js');
    if (disposed || reduced || generation !== rendererGeneration) return;
    renderer?.dispose();
    renderer = new SceneRenderer($('#scene-canvas'), images, () => { if (generation === rendererGeneration) fallback(); });
    resizeRenderer(); render(); scene.classList.add('has-webgl'); stage.dataset.renderer = 'webgl';
  } catch (error) {
    // The accessible layered scene stays usable even if the GPU/context is unavailable.
    console.info('NGE: using the layered image fallback.', error.message); fallback();
  }
}

async function loadLayer(name, i, variant) {
  const img = layerElements[i];
  // Vite serves public assets from the document's base URL in development and production.
  img.src = `${import.meta.env.BASE_URL}assets/${name}-${variant}.webp`;
  img.fetchPriority = name === 'background' ? 'high' : 'auto';
  let timer;
  try {
    await Promise.race([img.decode(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Image loading timed out')),15000);})]);
  } finally { clearTimeout(timer); }
  $('#load-count').textContent = `${++loaded} / 3`;
  return img;
}

let loaded = 0;
async function init() {
  applyMotionPreference();
  const variant = innerWidth <= 800 || navigator.connection?.saveData ? 'mobile' : 'desktop';
  const results = await Promise.allSettled(['background','hill','subject'].map((name,i)=>loadLayer(name,i,variant)));
  if (disposed) return;
  const ok = results.every(r=>r.status==='fulfilled');
  if (ok) {
    images = results.map(r=>r.value);
    aspects = { background: images[0].naturalWidth/images[0].naturalHeight, hill: images[1].naturalWidth/images[1].naturalHeight, subject: images[2].naturalWidth/images[2].naturalHeight };
    scene.classList.add('is-ready');
  } else {
    // A failed scene is never a blocking loader or a reason to hide the portfolio text.
    layerElements.forEach(el=>{ if (!el.naturalWidth) el.style.display='none'; });
    reduced = true; applyMotionPreference();
    console.info('NGE: a scene image could not load; showing the readable introduction.');
  }
  ready = true; updateTarget(); progress = target; render();
  document.body.classList.add('is-loaded'); loader.classList.add('is-done');
  loader.setAttribute('aria-hidden','true');
  if (ok) await startRenderer();
}

toggle.addEventListener('click',()=>{
  reduced=!reduced;
  try {localStorage.setItem('nge-reduced-motion',String(reduced));} catch { /* optional preference */ }
  applyMotionPreference();
  if (reduced) fallback(); else if (images.length===3) startRenderer();
},listener);
systemMotion.addEventListener('change',e=>{
  reduced=e.matches;applyMotionPreference();if(reduced)fallback();else if(images.length===3)startRenderer();
},listener);
addEventListener('scroll',updateTarget,{passive:true,...listener});
addEventListener('resize',resize,{passive:true,...listener});
stage.addEventListener('pointermove',e=>{
  if(reduced||coarsePointer.matches||e.pointerType!=='mouse')return;
  pointerTarget.x=(e.clientX/width-.5)*2;pointerTarget.y=(e.clientY/height-.5)*2;wake();
},{passive:true,...listener});
stage.addEventListener('pointerleave',()=>{pointerTarget.x=pointerTarget.y=0;wake();},listener);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;}else wake();},listener);
const observer = new IntersectionObserver(entries=>{
  active=entries[0].isIntersecting;if(active){updateTarget();wake();}else{cancelAnimationFrame(raf);raf=0;}
},{threshold:0});observer.observe(journey);
addEventListener('pagehide',event=>{if(!event.persisted)dispose();},listener);
function dispose(){disposed=true;rendererGeneration++;cancelAnimationFrame(raf);abort.abort();observer.disconnect();renderer?.dispose();}
if(import.meta.hot)import.meta.hot.dispose(dispose);
init();
