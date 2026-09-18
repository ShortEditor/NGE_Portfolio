export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const mix = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, t) => { const x = clamp((t - a) / (b - a)); return x * x * (3 - 2 * x); };

/** One reversible master timeline. Nothing here depends on elapsed playback time. */
export function sampleTimeline(progress, width, height, pointer, aspects) {
  const p = clamp(progress);
  const mobile = width < 801;
  const pull = smooth(.32, .84, p);
  const burst = smooth(.36, .49, p) * (1 - smooth(.53, .70, p));
  const scale = mix(mobile ? 2.32 : 2.8, 1, pull);
  const anchorX = mix(width * (mobile ? .52 : .67), width * (mobile ? .65 : .76), pull) + pointer.x * (mobile ? 0 : 10);
  const anchorY = mix(height * (mobile ? .60 : .76), height * (mobile ? .40 : .59), pull) + pointer.y * (mobile ? 0 : 6);
  const hillH = height * (mobile ? .66 : .77) * scale;
  const hillW = hillH * aspects.hill;
  const subjectH = mobile ? Math.min(height * .17 * scale, width * .84 / aspects.subject) : height * .20 * scale;
  const subjectW = subjectH * aspects.subject;
  const hill = { x: anchorX - hillW * .5, y: anchorY - hillH * .04, w: hillW, h: hillH };
  const subject = { x: anchorX - subjectW * .5, y: anchorY - subjectH * .96, w: subjectW, h: subjectH };
  const bgH = Math.max(height, width / aspects.background) * mix(1.20, 1.04, pull);
  const bgW = bgH * aspects.background;
  const background = { x: (width - bgW) * .52 + pointer.x * 3, y: (height - bgH) * .42 + pointer.y * 2, w: bgW, h: bgH };
  return { p, pull, burst, hill, subject, background, center: [anchorX / width, anchorY / height], reveal: smooth(.72, .89, p), opening: 1 - smooth(.13, .31, p) };
}
