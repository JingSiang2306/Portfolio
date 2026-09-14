# Project 01 mechanical assembly viewer

Open `/viewer01/` through a static HTTP server or Vercel. All production code runs in the browser. No build step, backend, API key, CAD software or Python is needed.

## Model and temporary names

The current source is `models/Holder_v7.glb`, used exactly as supplied. It is 13,981,424 bytes (13.33 MiB), with 13 independent mesh nodes and 13 materials. The source hierarchy is flat:

```text
empty_1
├── 000-002-398 → Component 01
├── 000-002-399 → Component 02
├── 000-002-400 → Component 03
├── 000-002-401 → Component 04
├── 000-002-402 → Component 05
├── 000-002-403 → Component 06
├── 000-002-404 → Component 07
├── 000-002-405 → Component 08
├── 000-002-406 → Component 09
├── 000-002-407 → Component 10
├── 000-002-408 → Component 11
├── 000-002-409 → Component 12
└── 000-002-410 → Component 13
```

Bounds are approximately 0.277009 × 0.353627 × 0.339271 model units, or 277 × 354 × 339 mm **if** the converter preserved glTF's meter convention. No node transforms declare a mechanical orientation. The current converter's incorrect alignment is preserved; this is development geometry.

Edit **`component-info.js`** to change names and descriptions. Keep the key equal to the source node name, then change the values:

```js
'000-002-398': {
  displayName: 'Your component name',
  description: 'Your verified component description.'
}
```

These are display labels only; the GLB is never rewritten. Unconfigured names fall back to source names and a neutral description. For duplicate source names, configuration applies to all matches; selection still uses separate object identities.

Replace the model at the same path, or change `MODEL_URL` at the top of `script.js` if your corrected export uses `project01.glb`. Update the configuration keys to match new node names and remove the development-preview note in `index.html` when appropriate. Open `/viewer01/?debug=1` to print the actual loaded hierarchy, component table and bounds in the console. That option also exposes read-only diagnostics for tests.

## Implementation

- Three.js **0.180.0**, GLTFLoader and OrbitControls use a version-pinned jsDelivr import map. This follows the [Three.js static CDN setup](https://threejs.org/manual/en/installation.html). All addons use the same version.
- A source glTF mesh node is a component. Multiple material primitives remain grouped. Meaningful nested groups appear in the generated component list; redundant transform wrappers collapse.
- Raycaster maps visible meshes to their owning source node. Separate cached material clones supply selection and wireframe effects; clearing/resetting restores original material references.
- Visibility uses a non-rendered layer for owned meshes, so hiding a parent component does not hide independently selectable children.
- Camera framing uses loaded world bounds, an enclosing sphere and both viewport FOVs. ISO, FRONT (+Z), TOP (+Y) and RIGHT (+X) use a single perspective camera with smooth transitions and standard Y-up orientation. They are directional inspection views, not orthographic measurement views.
- Explosion uses each component's world bounding-box center relative to the assembly center. Distance scales with assembly radius. Centered parts receive a deterministic spherical fallback. Parent-first conversion of world targets to local positions accounts for nested rotation and scale. Assemble restores saved local positions exactly.
- Rendering runs only during interaction, damping, transitions or invalidation, and pauses in a hidden tab. No repeated downloads or per-frame geometry scans are needed.
- Theme reads/writes the existing `portfolio-theme` setting. Reduced motion disables transition animation. Selection/visibility/isolation, presets and the slider are keyboard-accessible; focus the canvas for arrow-key pan and +/− zoom.

## Verification

`verify.mjs` is development tooling only. It serves static files temporarily and uses installed Chrome through `playwright-core`. Install Node and `playwright-core` in your development environment; alternatively set `PLAYWRIGHT_MODULE` to an external installation's absolute `index.mjs` path. Set `CHROME_PATH` if Chrome is not at the default Windows path.

```text
node viewer01/verify.mjs --serve  # static preview at http://127.0.0.1:4173
node viewer01/verify.mjs          # browser checks; screenshots saved in OS temp directory
```

The checks cover loading, bounds, mouse navigation, four presets, raycast selection before/after explosion, materials, visibility/isolation, slider, exact reassembly, reset, keyboard controls, idle rendering, one model download, themes, narrow layouts, reduced motion, the portfolio same-tab link, emulated touch gestures and loading failure. An unrelated synthetic in-memory assembly tests replacement behavior with nested transforms, multiple material primitives and a centered part. It never rewrites the supplied model.

## Deployment and limits

Vercel serves this folder as static assets alongside the existing portfolio. Include the case-sensitive `models/Holder_v7.glb` path in deployment. No existing API routes or project settings need changing. Internet access to jsDelivr and Google Fonts is used; font failure falls back to system fonts, and module/model failures show a clean loading error.

The generic explosion is illustrative, not a collision-free assembly/disassembly procedure. Parts with similar centers may still overlap. This viewer cannot recover alignment, part semantics, missing geometry or orientation lost by the converter. Compressed Draco/KTX2 exports would need their corresponding decoder setup. Animated/skinned/instanced CAD exports are outside this static mesh milestone. Physical-phone performance and live Vercel deployment need checking on those targets; local mobile checks use Chromium touch emulation.
