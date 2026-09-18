# Validation — 17 September 2026

## Completed

- Ran the application in a browser against the live development server.
- Inspected desktop close composition and wide identity reveal.
- Used mouse movement and verified the foreground transform changed.
- Scrolled through the pull-back, made large scroll jumps and reversed direction.
- Clicked introduction/replay anchors and checked keyboard focus navigation.
- Toggled reduced motion; confirmed the stored button state and static wide timeline position.
- Tested 390 × 844 and 320 × 640 iframe viewports, including resize and no horizontal document overflow.
- Fixed the mobile subject framing and 320-pixel headline wrapping.
- Exercised the actual WebGL-unavailable branch: this browser cannot create a WebGL context. The DOM layer scene remains usable.
- Inspected application console messages. The browser extension emitted an unrelated metadata error; the application reported its expected WebGL fallback, with no application runtime exception during these checks.
- Compiled a GLSL 330 translation of the vertex/fragment shaders in a standalone Mesa llvmpipe OpenGL context and rendered eight timeline positions. Visually inspected the peak image-fragment effect. This verifies shader logic in a separate software renderer, not browser WebGL compatibility or physical GPU performance.
- Also compiled and linked the original, unmodified GLSL ES 1.00 shader sources through Mesa's ES compatibility mode. This adds an exact shader-language check; it is still separate from browser WebGL execution.
- Checked all six WebP images decode, have the expected dimensions and preserve transparent layer edges.
- Production build succeeded. Initial JS is about 7.3 KB before gzip; the lazily loaded renderer is about 5 KB. See build output for exact hashed sizes.
- Reviewed lifecycle cleanup: listeners, observer, RAF, buffers, textures and shader program disposal; async renderer generation guard prevents toggle/import races.

## Remaining limits

- Browser WebGL shader execution, hardware frame pacing, GPU-memory profiling and prolonged memory-leak testing could not be measured because the available browser has no WebGL context.
- No 60 fps benchmark is claimed. The standalone software renderer is a functional shader check, not a device performance benchmark.
- Mobile tests use real narrow iframe viewport layout and scroll behavior, not a physical phone or touch-device performance measurement.
- The explicit motion control was tested; OS reduced-motion emulation, network throttling, CPU throttling and GPU/context-loss injection were not available through the browser controls used here.
- Actual image-load timeout/failure and quality downgrade paths are implemented but were not fault-injected in this browser session.

Before a public portfolio launch, check the GPU transition in current desktop Chrome/Safari/Firefox and on a mid-range phone. The original hero validation remains applicable; the post-hero additions are covered below.


# Post-hero completion — 18 September 2026

## Verified

- Ran the updated application in the browser, inspected About, Work and the Layer Method visually.
- Verified the approved hero markup and all four locked JS/CSS source files remain byte-identical to the approved delivery.
- Tested 375 × 812, 768 × 1024 and 1440 × 900 iframe viewports. Document scrollWidth equals clientWidth in each; the browser reserves 15 px for a scrollbar. These are viewport-layout checks, not physical device tests.
- Tested project filters: AI & systems shows GRIB, IP-SAKTI and APIT (3); Worlds shows Neon Coast (1); Everything restores all 7.
- Opened project technical details with mouse and keyboard. Checked APIT's source link.
- Opened education disclosure; checked college, GPA and semester data.
- Selected Story, Sound design and Mix in the native exclusive Layer Method accordion; the selected layer opens and the previous one closes.
- Tested chapter navigation, contact link destinations, return-to-hero anchor and the existing reduced-motion toggle. New reveals become static in reduced-motion mode.
- Reserved AI section is empty, commented and hidden; navigation status is disabled/coming soon. No client API key or fake assistant.
- Fixed mobile word spacing and expanded mobile nav tap heights.
- Checked browser error logs: observed extension metadata errors, no application runtime exception during these checks. Browser WebGL remains unavailable, so the original fallback handles the hero.
- No new images or runtime dependencies. Desktop image set remains 906,444 bytes; mobile remains 373,572 bytes.
- Build-time rendering includes all 7 project records in production HTML. Native disclosures remain functional without JS; no-script behavior is supported by markup, not an automated browser JS-disable test.

## Scope / limits

Clipboard copy is conditional on secure-origin API support. The HTTP preview correctly omits it; hosted HTTPS clipboard permissions were not exercised. Direct GitHub and Instagram links remain available. The exact LinkedIn profile and Apple Music artist URLs were not supplied, so none are guessed.

No audio, fake film previews or chatbot answers are generated. The six layer explanations are concise portfolio UI copy around the user's named framework, not quotations. Performance numbers above are payload measurements, not a hardware FPS benchmark.
