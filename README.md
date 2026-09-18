# NGE — cinematic portfolio

An original layered scene: sunset background, rocky summit, and seated man with dog. Scroll drives the close-to-wide camera illusion; a short WebGL image-fragment distortion disappears before the final composition. No video autoplay and no frame-sequence preload.

This delivery preserves the approved hero and adds About, a filterable work collection, grouped skills, film/music credits, an interactive NGE Layer Method and contact links. The RAG assistant is intentionally reserved, not implemented. No audio player is supplied because recordings were not provided.

## Run on Windows

Extract the source ZIP into your preferred folder, such as `D:\3d interactive portoflio`, then open a terminal there. Node.js 22.12+ or a compatible newer LTS is required.

```powershell
npm ci
npm run dev
```

Open the local URL printed by Vite. `npm run build` creates `dist/`; `npm run preview` serves that production build. The downloadable archive also includes `ready-to-host/`, a copy of the built static site. Serve that folder with an HTTP server; opening the HTML through `file://` is not supported for ES modules.

## Files

- `index.html`: accessible content, metadata and scene elements.
- `src/style.css`: typography, responsive composition and reduced-motion presentation.
- `src/timeline.js`: one reversible camera/scene timeline shared by GPU and DOM rendering.
- `src/renderer.js`: small native WebGL renderer and GLSL displacement/fragment shader.
- `src/main.js`: loading, native scroll, elapsed-time damping, pointer response, quality adaptation and lifecycle cleanup.
- `src/sections.css`: all new post-hero layout, responsive styles and reveal states.
- `src/sections.js`: project filtering, progressive reveals, chapter indication and optional LinkedIn-name copying.
- `src/data/projects.json`: accurate project records.
- `scripts/content.mjs`: build-time project HTML rendering through a tiny Vite plugin; every project is present in the built HTML without JavaScript. Restart the dev server after changing project data.

The approved hero markup, `src/main.js`, `src/renderer.js`, `src/timeline.js` and `src/style.css` are unchanged from the previous delivery. New modules are loaded separately in `index.html`.
- `public/assets/`: original generated artwork compressed to desktop/mobile WebP, plus exact byte/dimension metadata.
- `ASSET-PROMPTS.json`: exact image-generation prompts. Built-in image generation was used; the other portfolio's artwork was not downloaded or included.
- `qa/mobile.html`: development-only iframe fixture for checking narrow browser layouts. It is not part of the production build.
- `QA.md`: completed checks and remaining limits.

Vite is the only dependency and is used for development/build tooling. There are no runtime frameworks, CDN libraries, tracking scripts, external font requests or API keys.

## Behavior and budgets

Desktop images total **906,444 bytes**; mobile images total **373,572 bytes**. Only one rendition set is loaded. The scene uses three textures, one draw call and one shader pass. The shader's extra blur/channel samples only run during the transition and are disabled for mobile/low quality. Pixel ratio is capped at 1.5 desktop / 1.25 mobile and steps down under sustained slow active-frame timing. Drawing stops when the scene settles, leaves view or the tab is hidden.

The fragment effect is deterministic at a given scroll position. Reversing scroll reverses the transition. There is no elapsed-time camera animation and no decorative idle render loop.

The Reduce motion button persists locally and initially follows the OS preference. It shows the wide composition without the long cinematic scroll. If WebGL is unavailable or the context is lost, the same layered composition remains scrollable as ordinary images. `?no-webgl` explicitly exercises this fallback. Image failure/timeout removes the blocking loader and preserves readable content.

## Future edits

Update the new portfolio copy in `index.html` and featured projects in `src/data/projects.json`. All content is sourced from the provided brief; project URLs are included only where supplied. LinkedIn shows the supplied name rather than a guessed profile. On secure origins with Clipboard API support, its Copy name button is enabled. GitHub and Instagram are direct links. Add your exact LinkedIn and artist URLs when available.

`<section id="ask-ai" hidden>` is intentionally empty and commented. The navigation marks it as coming soon, without a broken anchor. A future chatbot needs a secure server endpoint; never place a Groq key in this static frontend.

The lower sections use native details/summary for keyboard-friendly disclosures; they work without JavaScript. Filters are only exposed after initialization. Reveals are optional and respect the existing motion setting and OS preference. No extra animation loop, imagery, fonts, libraries or network services were added.

The editorial scale and interactive presentation of https://crency.agency/ informed the lower sections. Its copy, typography combination, colors, graphics and source code were not copied.

## Hero reference (currently locked)

Adjust scale, anchors and phase ranges in `src/timeline.js`. Hill and character placement share a summit anchor, keeping the subject seated as the scene scales. Desktop and mobile have separate framing. Update image paths in `src/main.js` if replacing the assets; keep true alpha on the hill and subject layers.

Change title, description, links and copy in `index.html`. Once a public custom domain is selected, add its absolute canonical URL and Open Graph URL there. No canonical domain is guessed in this version. Publishing and any backend for the future assistant are separate from these static files.
