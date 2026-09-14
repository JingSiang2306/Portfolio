# Project 02 mechanical assembly viewer

Interactive viewer for **Edge AI Low-Power Water Leak Detection**, matching Project 01's layout, theme, and controls. Open `/viewer02/` through a static HTTP server or the Project 02 card's **3D Viewer** button on the portfolio.

## Model

`models/Device.glb` is the supplied SOLIDWORKS export, preserved byte-for-byte: 3,250,960 bytes (3.10 MiB), 30 nodes, 26 mesh definitions/selectable parts, and 33 materials. The other nodes are Device, Top Assembly, Bottom Assembly, and the exported CAD camera.

The model is already upright in Y-up, so `MODEL_ROTATION_Z` is zero. The viewer uses its own perspective camera and frames the geometry bounds; it does not use the exported CAD camera. No part transforms or geometry are changed on disk.

## Component labels

`component-info.js` supplies short display names for all parts and assemblies, including Pipe, Breadboard, SPC Holder, Top Holder, Battery Holder, SPC1520, Slide Switch, Battery, Lower Clamp, Upper Clamp, Bottom Holder, STM32U5 Board, and numbered fasteners. The original CAD name appears in the inspector.

Entries use source node indices because several screws have identical source names. Each entry also checks `sourceName` before applying a label. If the model is replaced, inspect its hierarchy and update the configuration; unmatched nodes fall back to their original names.

```js
"14": {
  "sourceName": "D Battery-1",
  "displayName": "Battery",
  "description": "D-size battery."
}
```

SPC1520 retains its source identifier because the export does not specify its function. Open `/viewer02/?debug=1` for the hierarchy, bounds, component table, and read-only diagnostics.

## Controls

- Drag or use one finger to rotate freely through 360 degrees in pitch and yaw.
- Scroll/pinch to zoom; right-drag or use two fingers to pan.
- Click/tap a component, or select it in the nested list, to inspect, hide, or isolate it.
- ISO, FRONT, TOP, and RIGHT restore consistent views. Reset restores upright ISO, assembled positions, all visibility, and original materials.
- Explode/Assemble and the slider separate/reassemble the parts. Wireframe toggles mesh edges.
- Focus the canvas for arrow-key pan, plus/minus zoom, and Escape to clear selection.

Rotation follows the pointer without inertia. Preset and explosion transitions respect reduced motion. Explosion is illustrative, not a physical disassembly sequence. Parent-first world-to-local positioning handles the nested assembly transforms and restores local positions exactly.

## Running and verification

Production is static HTML/CSS/JavaScript with no build step or backend. Three.js 0.180.0, GLTFLoader, and TrackballControls load through the pinned jsDelivr import map. Theme shares the portfolio's `portfolio-theme` setting. Rendering pauses when idle or when the tab is hidden.

The development checks require Node, Chrome, and `playwright-core`. Set `PLAYWRIGHT_MODULE` to an external installation's absolute `index.mjs` path if needed, and `CHROME_PATH` when Chrome is not at its usual Windows location.

```text
node viewer02/verify.mjs --serve  # http://127.0.0.1:4174/viewer02/
node viewer02/verify.mjs          # browser checks; screenshots in OS temp directory
```

Checks cover model integrity, 26 unique display labels, orientation, framing, four presets, full forward/reverse pitch turns, selection, materials, visibility/isolation, explosion, exact reassembly, keyboard and emulated touch navigation, narrow layouts, themes, reduced motion, idle rendering, one GLB download, the portfolio link, missing-model errors, and a synthetic nested assembly. A replacement GLB requires updating the expected model metadata/hash in the test.

Vercel can serve this folder alongside the portfolio. Include the case-sensitive `models/Device.glb` path. Module/model loading failures show an error message, and fonts have system fallbacks. Physical-device performance and live deployment require separate verification.
