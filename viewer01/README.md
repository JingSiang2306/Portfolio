# Project 01 mechanical assembly viewer

Open `/viewer01/` through a static HTTP server or Vercel. Production code runs in the browser with no build step or backend.

## Current model and component names

`models/Holder_v7.glb` is the corrected SOLIDWORKS export, with 163 selectable mesh nodes, 162 mesh definitions (one is shared), 18 assembly/group nodes, one CAD camera node, and 130 materials. The renamed file is 46,579,172 bytes (44.42 MiB).

All 182 nodes and 162 mesh definitions have short names. Main assemblies include Device, Camera V3, Solar Charger, Case Fan Assembly, Pi 5, SSD HAT, and Pi Cooler. Parts include Mic, Camera V2, Battery, Holder, Gasket, Cam Lens, NVMe SSD, and numbered screws, spacers, and washers. Names are unique across nodes and no longer than 22 characters.

Names come from the source CAD labels. Unspecified electronics retain neutral labels such as HAT Part 01, Cam Rear 01, and Pi Part 01; these are not verified functional identifications. Original CAD names are preserved in each node's `extras.originalName`, shown in the inspector, and recorded alongside short names and node/mesh indices in `models/component-names.json`.

`rename-model.mjs` is an idempotent development utility for this specific inspected export. It changes name metadata and records original names, checks that all other JSON data is unchanged, and copies the binary geometry chunk byte-for-byte. Reinspect and update its mapping before using it with another export. Geometry, materials, hierarchy, and local transforms were preserved.

Edit `component-info.js` to add descriptions or optional display labels using the short GLB node name:

```js
Battery: {
  displayName: 'Battery',
  description: '18 Ah battery.'
}
```

The tree lists 110 parts. Its 53 screws, nuts, bolts, washers, spacers, and springs are omitted from the list, but remain rendered and selectable in the viewport. The shared logic is in `../js/assembly-layout.js`.

Unconfigured parts use their short GLB names. Duplicate names in future models remain independently selectable by object identity.

## Orientation and navigation

The supplied assembly is upside down relative to the viewer's Y-up convention. `MODEL_ROTATION_Z = Math.PI` in `script.js` applies a single 180-degree rotation around Z to the loaded scene before measuring bounds and calculating explosion offsets. This is a viewer correction: no individual part transform or GLB geometry is altered. Review this setting when replacing the export.

Three.js 0.180.0, GLTFLoader, and TrackballControls use the version-pinned jsDelivr import map. TrackballControls supports continuous full pitch and yaw rotation across both poles. See the [Three.js control implementation](https://github.com/mrdoob/three.js/blob/r180/examples/jsm/controls/TrackballControls.js).

- Left-drag or one finger: rotate freely, including repeated 360-degree pitch turns.
- Wheel or pinch: zoom. Right-drag or two fingers: pan.
- Focus the canvas: arrow keys pan, plus/minus zoom, Escape clears selection.
- ISO, FRONT (+Z), TOP (+Y), and RIGHT (+X) restore a consistent orientation. TOP uses -Z as screen-up; other presets use +Y. Reset restores the upright ISO view and clears explosion, selection, hidden parts, and wireframe.
- Rotation follows the pointer without inertia. Preset and explosion transitions are smooth unless reduced motion is requested. Explosion and resize framing preserve the camera's current roll.

## Implementation

A source glTF mesh node is one selectable component; multiple material primitives stay grouped. Named nested groups appear in the component tree and redundant wrappers collapse. Raycasts map meshes to their owning source node. Cached material variants provide selection and wireframe effects; clearing/resetting restores original material references.

Visibility uses a non-rendered layer so hiding a parent component does not hide independently selectable children. Explosion uses the straight-axis groups in `explosion-layout.js`: casing layers separate along Z, the battery and board stack along Y, and the case fan along X. Camera, charger, Pi, SSD HAT, and cooler subcomponents share their group translation. Loose hardware follows the nearest main part. Offsets are scaled by assembly radius; unknown replacement parts use ordered vertical layers. Camera framing recenters on the separated assembly. Parent-first world-to-local conversion respects nested rotation and scale. Assemble restores local positions exactly. The explosion is illustrative, not a collision-free disassembly procedure.

Camera framing uses an enclosing sphere and both viewport FOVs. Rendering runs only during input, transitions, or invalidation and pauses in a hidden tab. The model is downloaded once per page load. Theme uses the existing `portfolio-theme` setting.

Open `/viewer01/?debug=1` for the loaded hierarchy, component table, bounds, and read-only test diagnostics.

## Verification

`verify.mjs` serves static files temporarily and checks the viewer with installed Chrome through `playwright-core`. Install Node and `playwright-core` in your development environment, or set `PLAYWRIGHT_MODULE` to an external installation's absolute `index.mjs` path. Set `CHROME_PATH` if Chrome is not in its default Windows location.

```text
node viewer01/verify.mjs --serve  # http://127.0.0.1:4173
node viewer01/verify.mjs          # browser checks; screenshots in OS temp directory
```

Checks cover the current model counts, every node/mesh name, upright correction, initial framing, presets, full forward and reverse 360-degree pitch via real pointer drags, both poles, preserving roll while exploded, upright reset, mouse/touch/keyboard navigation, selection including unlisted hardware, filtered tree counts, rigid group offsets, materials, visibility, exact reassembly, idle rendering, one model download, themes, narrow layouts, reduced motion, portfolio navigation, and loading failure. A synthetic nested assembly checks grouped primitives, transformed parents, centered parts, child isolation, and exact reset. Tests do not modify the GLB.

## Deployment and limits

Vercel serves this folder as static assets alongside the portfolio. Include the case-sensitive `models/Holder_v7.glb` path. jsDelivr and Google Fonts require internet access; module/model failures show a loading error, and fonts have system fallbacks. Compressed Draco/KTX2 exports require decoder setup. Animated/skinned/instanced exports are outside this static viewer. Physical-phone performance and live deployment are not covered by local Chromium touch emulation.
