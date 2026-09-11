# Project 01 browser playground

This is a static HTML/CSS/JavaScript page. All image decoding, preprocessing,
inference and annotation happen in the visitor's browser. No image is uploaded,
and there is no inference API, Python/PyTorch/Ultralytics deployment dependency,
or API key. The existing portfolio chatbot API is unrelated and unchanged.

## Files

```text
playground01/
  index.html
  style.css
  script.js
  README.md
  weights/
    best.onnx       # supplied model, not generated or modified by this integration
tests/
  playground_browser.py  # development-only browser tests
```

The only existing portfolio file changed for this feature is the root
`index.html`: Project 01 now has a `Playground ↗` link using the existing
`project-links` styling, `target="_blank"`, and `rel="noopener noreferrer"`.

## Model and configuration

The supplied model was present during implementation (10,640,960 bytes).
Read-only inspection confirmed ONNX IR 8, opset 17, one embedded
`NonMaxSuppression` node and these tensors:

| Direction | Name | Type | Shape |
| --- | --- | --- | --- |
| Input | `images` | float32 | `[1,3,640,640]` |
| Output | `output0` | float32 | `[1,300,6]` |

Its metadata contains **six classes**, not one:

| Class ID | Name |
| --- | --- |
| 0 | Car |
| 1 | Cow |
| 2 | Elephant |
| 3 | Human |
| 4 | Motorbike |
| 5 | Sheep |

Edit `CONFIDENCE_THRESHOLD`, `CLASS_NAMES` and `ELEPHANT_CLASS_ID` near the top
of `script.js` if replacing the model. The default browser threshold is `0.25`.
Since filtering/NMS is baked into this export, lowering the browser threshold
cannot recover detections already removed inside the model. Replace the model
only with an export matching the documented input and output contract.

Original and post-verification SHA-256:
`C09D3F34D02C383716246957172FEBB3939E9B4C49D90697EBB717A1D99D624C`.

## Runtime loading and fallback

`index.html` loads the pinned browser script:
`https://cdn.jsdelivr.net/npm/onnxruntime-web@1.29.0/dist/ort.webgpu.min.js`.
`ort.env.wasm.wasmPaths` points at the matching version's `dist/` directory.
Update both locations together if upgrading the runtime. No bundler is needed.

`loadModel()` shares one initialization promise and caches the model bytes.
On a secure browser with WebGPU it tries `['webgpu', 'wasm']`: WebGPU handles
supported operations, with CPU support for operations such as shape handling.
If WebGPU is absent or creation fails, it creates a WASM-only session using
the same downloaded bytes. GPU inference failure also retries once on WASM,
then keeps that session for subsequent images. It does not recreate the
session on every detection. A user-initiated retry is available after load failure.

WASM uses one thread so no COOP/COEP or SharedArrayBuffer configuration is
needed. The runtime and model need network access on first load; the CDN also
serves the runtime's JavaScript/WASM support files. Existing Google Fonts are
used for the same typography as the portfolio.

## Preprocessing, parsing and drawing

1. Validate JPEG, PNG or WebP, a maximum of 10 MiB, and successful browser decode.
   A 40-megapixel decoded-image limit prevents extreme compressed images from
   exhausting browser memory. Object URLs stay local and are revoked on replacement.
2. Use `scale = min(640 / width, 640 / height)` and round the resized dimensions
   with ties-to-even, matching Python's `round()`. Center the image on a 640×640
   Canvas filled with RGB `(114,114,114)`. Odd padding goes to the right/bottom.
   The top/left offsets are retained as `paddingX` and `paddingY`.
3. Read RGBA pixels, divide RGB channels by 255, and write three Float32Array
   planes in R, G, B order. Create `ort.Tensor('float32', data, [1,3,640,640])`.
4. Run `session.run({ images: tensor })` and validate `output0` type and dimensions.
   Walk 300 rows of six values: `[x1,y1,x2,y2,confidence,class_id]`. Ignore empty,
   non-finite, low-confidence or degenerate rows. Report unknown class IDs as
   an output mismatch rather than silently labelling them Elephant. There is
   **no additional NMS** and no xywh conversion or sigmoid.
5. Map corners using `(x - paddingX) / scale` and `(y - paddingY) / scale`.
   Clamp to the original width/height and discard boxes with no remaining area.
6. Draw a separate result Canvas with the original aspect ratio. Its longest
   edge is capped at 2048 pixels for memory efficiency; mapped boxes are scaled
   by the same display factor. The original image is never modified. Boxes,
   class names and one-decimal confidence percentages are also represented in
   an accessible text summary. Elephant boxes are copper; other classes are teal.

For example, 1920×1080 becomes 640×360, with `scale=1/3`, `paddingX=0`,
`paddingY=140`. Model box `[64,176,576,464]` maps to source
`[192,108,1728,972]`.

Canvas uses browser image interpolation. Its pixel values are not guaranteed
bit-for-bit identical to OpenCV interpolation. The original `.pt` model was
not loaded, and no original-Ultralytics numerical equivalence claim is made.

## Run locally

Serve the **repository root**, rather than opening `index.html` via `file://`.
For example, if Python is installed:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

This command only serves static files; it does not run inference. Alternatively,
use VS Code Live Server or `npx --yes serve . -l 8000` if Node.js is installed.
Open `http://localhost:8000/`, then click Project 01's Playground link, or go
directly to `http://localhost:8000/playground01/`.

## Verify before pushing

The automated checks need Python, the **development-only** Playwright package,
and an installed Chrome browser:

```sh
python -m pip install playwright
python tests/playground_browser.py
```

The test starts a temporary static server, runs inference in Chrome, checks the
model hash, and writes screenshots to the printed temporary directory. It
does not execute inference in Python or require PyTorch/Ultralytics. Internet
access is needed to download ONNX Runtime Web and fonts.

Verified on 2026-09-11:

- Real WebGPU model load and inference with the exact tensor contract.
- Existing `Image/Y3GP/1_ImageDetection.jpg`: one Elephant at 84.1% confidence.
- Real WASM inference with WebGPU absent, and after a simulated WebGPU session
  creation failure: the same Elephant at 84.1% confidence.
- Numerical letterbox/RGB/CHW checks for landscape, portrait, square and odd
  dimensions; inverse coordinate mapping and clipping.
- Confidence labels, padded/invalid rows, and no second NMS.
- Real portrait and square blank-image inference with no detections.
- Repeated images without refresh or a second model download.
- File-picker and WebP drag/drop; unsupported, oversized and corrupt files.
- Unexpected output, simulated inference failure, missing model and retry.
- Light theme, mobile stacking, reduced motion, no page overflow.
- Project link opens the correct path in a new tab.
- Only GET requests during the image flow; no image uploads.

For a manual check, wait for Model ready, select an image, run detection, then
use Try Another Image. Test an elephant image and an image without elephants.
Check the browser Network panel: the model loads once and there are no image
POST requests. Review the Console for technical diagnostics if something fails.
Testing on real mobile Safari/Android hardware is still recommended.

## Vercel

Keep the existing portfolio deployment settings and API routes. This feature
adds static files only: no build command, inference function or environment
variable is needed. Ensure `playground01/weights/best.onnx` is included in the
Git commit/deployment; a local untracked model will not appear in a Git-based
deployment. No new `vercel.json` or global security headers are required.

Vercel HTTPS supplies the secure context WebGPU needs; browsers without WebGPU
use WASM. `./weights/best.onnx` resolves relative to `/playground01/`, and all
page assets use relative paths. If adding a Content Security Policy later,
allow the pinned runtime/CDN JavaScript, WASM execution, Google Fonts, and local
`blob:` image previews. Do not rewrite the `.onnx` URL to an HTML page.

After a Preview deployment, repeat the manual check there and confirm the
model URL returns binary data with HTTP 200. This implementation was verified
locally; it has not been deployed or tested on a Vercel Preview by the agent.

References:
- https://onnxruntime.ai/docs/tutorials/web/deploy.html
- https://onnxruntime.ai/docs/tutorials/web/env-flags-and-session-options.html
- https://onnxruntime.ai/docs/get-started/with-javascript/web.html
