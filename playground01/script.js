'use strict';

// Model configuration. Names come from this best.onnx file's export metadata.
const CONFIDENCE_THRESHOLD = 0.25;
const DEBUG_DETECTIONS = true; // Show raw, filtered and annotated rows in DevTools.
const RESET_TRANSITION_MS = 300;
const CLASS_NAMES = ['Car', 'Cow', 'Elephant', 'Human', 'Motorbike', 'Sheep'];
const ELEPHANT_CLASS_ID = 2;
const MODEL_URL = './weights/best.onnx';
const INPUT_SIZE = 640;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 40 * 1000 * 1000;
const MAX_CANVAS_EDGE = 2048;
// Keep this version identical to the script tag in index.html.
const ORT_BASE_URL = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.29.0/dist/';

const ui = Object.fromEntries([
  'themeToggle', 'modelIndicator', 'modelStatus', 'runtimeLabel', 'modelError',
  'modelErrorText', 'retryModel', 'imageInput', 'dropzone', 'imageError',
  'selectionInfo', 'fileName', 'imageDimensions', 'runButton', 'resetButton',
  'detectionStatus', 'comparison', 'originalImage', 'resultCanvas',
  'resultPlaceholder', 'resultSummary', 'detectionCount', 'detectionList',
  'emptyResult', 'inferenceTime', 'thresholdNote', 'exampleSelect', 'exampleStatus', 'resultsRegion'
].map(id => [id, document.getElementById(id)]));

let session = null;
let modelPromise = null;
let modelBytes = null;
let runtimeProvider = '';
let selectedImage = null;
let imageURL = null;
let imageVersion = 0;
let decoding = false;
let running = false;
let resetting = false;
let dragDepth = 0;
let examples = [];

function applyTheme(theme) {
  document.documentElement.toggleAttribute('data-theme', theme === 'light');
  if (theme === 'light') document.documentElement.dataset.theme = 'light';
  ui.themeToggle.textContent = theme === 'light' ? '☾' : '☀';
  ui.themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  ui.themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
}
function updateControls() {
  ui.runButton.disabled = !session || !selectedImage || running || decoding || resetting;
  ui.runButton.textContent = running ? 'Running detection...' : 'Run Detection';
  ui.dropzone.disabled = running || resetting;
  ui.imageInput.disabled = running || resetting;
  ui.exampleSelect.disabled = running || resetting || !examples.length;
  ui.resetButton.disabled = running || resetting;
  ui.resetButton.hidden = !selectedImage && !decoding;
  ui.comparison.setAttribute('aria-busy', String(running));
}
function setModelStatus(text, state) {
  ui.modelStatus.textContent = text;
  ui.modelIndicator.dataset.state = state;
}
function clearResults() {
  ui.resultCanvas.hidden = true;
  ui.resultPlaceholder.hidden = false;
  ui.resultSummary.hidden = true;
  ui.detectionList.replaceChildren();
}

async function createSession(provider) {
  const candidate = await ort.InferenceSession.create(modelBytes, {
    executionProviders: provider === 'webgpu' ? ['webgpu', 'wasm'] : ['wasm'],
    graphOptimizationLevel: 'all'
  });
  if (candidate.inputNames.length !== 1 || candidate.inputNames[0] !== 'images' || !candidate.outputNames.includes('output0')) {
    await candidate.release();
    throw new Error('Unexpected model input/output names. Expected images and output0.');
  }
  const input = candidate.inputMetadata.find(value => value.name === 'images');
  const output = candidate.outputMetadata.find(value => value.name === 'output0');
  if (!input?.isTensor || input.type !== 'float32' || String(input.shape) !== '1,3,640,640' ||
      !output?.isTensor || output.type !== 'float32' || String(output.shape) !== '1,300,6') {
    await candidate.release();
    throw new Error('Model tensor metadata does not match the validated Project 01 export.');
  }
  console.info('[Playground 01] Session ready', { provider, inputs: candidate.inputNames, outputs: candidate.outputNames });
  return candidate;
}

async function initializeModel() {
  setModelStatus('Loading AI model...', 'loading');
  ui.modelError.hidden = true;
  ui.retryModel.disabled = true;
  try {
    if (location.protocol === 'file:') throw new Error('Use an HTTP server, not file://, to load ONNX and WASM.');
    if (!window.ort) throw new Error('ONNX Runtime Web could not be downloaded from the CDN.');
    // One WASM thread avoids requiring cross-origin-isolation headers on the portfolio.
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.wasmPaths = ORT_BASE_URL;
    if (!modelBytes) {
      const response = await fetch(MODEL_URL);
      if (!response.ok) throw new Error(`Model request failed: HTTP ${response.status}`);
      modelBytes = await response.arrayBuffer();
    }
    if (navigator.gpu && window.isSecureContext) {
      try {
        session = await createSession('webgpu');
        runtimeProvider = 'webgpu';
      } catch (error) {
        console.warn('[Playground 01] WebGPU unavailable; trying WebAssembly.', error);
      }
    }
    if (!session) {
      session = await createSession('wasm');
      runtimeProvider = 'wasm';
    }
    ui.runtimeLabel.textContent = `Runtime: ${runtimeProvider === 'webgpu' ? 'WebGPU' : 'WebAssembly'}`;
    setModelStatus('Model ready', 'ready');
    return session;
  } catch (error) {
    console.error('[Playground 01] Model initialization failed.', error);
    setModelStatus('Model unavailable', 'error');
    ui.runtimeLabel.textContent = 'Runtime: unavailable';
    ui.modelErrorText.textContent = location.protocol === 'file:'
      ? 'Open this page through a local web server or the hosted portfolio to load the AI model.'
      : !window.ort ? 'The AI runtime could not load. Check your connection, then reload this page.'
        : 'The AI model could not load. Check your connection and try again. If this continues, please return to the portfolio and try later.';
    ui.modelError.hidden = false;
    return null;
  } finally {
    ui.retryModel.disabled = false;
    updateControls();
  }
}
function loadModel() {
  // Share both the in-flight initialization and the successful session.
  if (!modelPromise) modelPromise = initializeModel();
  return modelPromise;
}

function validateImage(file) {
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!file || !/\.(jpe?g|png|webp)$/i.test(file.name) || (file.type && !supportedTypes.includes(file.type))) {
    throw new Error('Please choose a JPG, JPEG, PNG or WEBP image.');
  }
  if (file.size > MAX_FILE_BYTES) throw new Error('This image exceeds 10 MB. Please choose a smaller file.');
  if (!file.size) throw new Error('This image is empty or unreadable. Please choose another image.');
}
async function loadExamples() {
  try {
    const response = await fetch('./test/images.json');
    if (!response.ok) throw new Error(`Example manifest: HTTP ${response.status}`);
    const manifest = await response.json();
    if (!Array.isArray(manifest) || !manifest.every(item =>
      item && typeof item.name === 'string' && item.name.trim() &&
      typeof item.file === 'string' && /^[^/\\]+\.(jpe?g|png|webp)$/i.test(item.file))) {
      throw new Error('Invalid example manifest. Expected an array of { name, file } entries.');
    }
    examples = manifest;
    examples.forEach((example, index) => {
      ui.exampleSelect.add(new Option(example.name, String(index)));
    });
    ui.exampleStatus.textContent = examples.length
      ? 'Choose an example, then run detection.'
      : 'No example images are available yet. You can upload your own image above.';
  } catch (error) {
    console.warn('[Playground 01] Example list failed to load.', error);
    ui.exampleStatus.textContent = 'Examples are unavailable right now. You can still upload your own image.';
  }
  updateControls();
}
async function loadExample() {
  if (running || resetting) return;
  if (ui.exampleSelect.value === '') { resetPlayground(); return; }
  const example = examples[Number(ui.exampleSelect.value)];
  if (!example) return;
  const version = ++imageVersion;
  decoding = true;
  ui.imageError.hidden = true;
  ui.exampleStatus.textContent = 'Loading example image...';
  updateControls();
  try {
    // Encode filenames such as human&elephant1.webp; never rely on directory listing.
    const response = await fetch(`./test/${encodeURIComponent(example.file)}`);
    if (!response.ok) throw new Error(`Example image: HTTP ${response.status}`);
    const blob = await response.blob();
    if (version !== imageVersion) return; // A newer upload/example/reset takes priority.
    await loadImageFile(new File([blob], example.file, { type: blob.type }), version);
    if (version === imageVersion) ui.exampleStatus.textContent = 'Choose an example, then run detection.';
  } catch (error) {
    if (version === imageVersion) {
      ui.imageError.textContent = 'This example image could not be loaded. Please try another example or upload your own image.';
      ui.imageError.hidden = false;
      ui.exampleSelect.value = '';
      ui.exampleStatus.textContent = 'Choose another example, or try again.';
    }
    console.warn('[Playground 01] Example image failed to load.', error);
  } finally {
    if (version === imageVersion) { decoding = false; updateControls(); }
  }
}
async function loadImageFile(file, selectionVersion) {
  if (running || resetting) return;
  const version = selectionVersion ?? ++imageVersion;
  if (selectionVersion === undefined) {
    ui.exampleSelect.value = '';
    if (examples.length) ui.exampleStatus.textContent = 'Choose an example, then run detection.';
  }
  ui.imageError.hidden = true;
  let candidateURL = null;
  decoding = true;
  updateControls();
  try {
    validateImage(file);
    candidateURL = URL.createObjectURL(file);
    const image = new Image();
    image.src = candidateURL;
    try { await image.decode(); }
    catch { throw new Error('This image could not be read. It may be corrupted. Please choose another image.'); }
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('This image could not be read. Please choose another image.');
    if (image.naturalWidth * image.naturalHeight > MAX_IMAGE_PIXELS) {
      throw new Error('This image has too many pixels for this browser demo. Please resize it below 40 megapixels.');
    }
    if (version !== imageVersion) return;
    if (imageURL) URL.revokeObjectURL(imageURL);
    imageURL = candidateURL;
    candidateURL = null;
    selectedImage = image;
    ui.originalImage.src = imageURL;
    ui.originalImage.alt = `Original image: ${file.name}`;
    ui.fileName.textContent = file.name;
    ui.imageDimensions.textContent = `${image.naturalWidth} × ${image.naturalHeight} px · ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    ui.selectionInfo.hidden = false;
    ui.comparison.hidden = false;
    clearResults();
    ui.detectionStatus.textContent = 'Image ready. Run detection when the model is ready.';
  } catch (error) {
    if (version === imageVersion) {
      ui.imageError.textContent = error.message;
      ui.imageError.hidden = false;
    }
    console.warn('[Playground 01] Image validation/decode failed.', error);
  } finally {
    if (candidateURL) URL.revokeObjectURL(candidateURL);
    if (version === imageVersion) { decoding = false; updateControls(); }
    ui.imageInput.value = '';
  }
}

function roundResize(value) {
  // Python/Ultralytics round() uses ties-to-even, unlike JavaScript Math.round().
  const floor = Math.floor(value);
  return value - floor === 0.5 ? floor + (floor % 2) : Math.round(value);
}
function preprocessImage(image) {
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const scale = Math.min(INPUT_SIZE / width, INPUT_SIZE / height);
  const resizedWidth = Math.max(1, roundResize(width * scale));
  const resizedHeight = Math.max(1, roundResize(height * scale));
  const paddingX = Math.round((INPUT_SIZE - resizedWidth) / 2 - 0.1);
  const paddingY = Math.round((INPUT_SIZE - resizedHeight) / 2 - 0.1);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = INPUT_SIZE;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas preprocessing is unavailable.');
  context.fillStyle = 'rgb(114,114,114)';
  context.fillRect(0, 0, INPUT_SIZE, INPUT_SIZE);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'low'; // Browser bilinear resize; do not stretch to a square.
  context.drawImage(image, paddingX, paddingY, resizedWidth, resizedHeight);
  const rgba = context.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE).data;
  const plane = INPUT_SIZE * INPUT_SIZE;
  const data = new Float32Array(3 * plane);
  for (let pixel = 0; pixel < plane; pixel++) {
    data[pixel] = rgba[pixel * 4] / 255;
    data[plane + pixel] = rgba[pixel * 4 + 1] / 255;
    data[plane * 2 + pixel] = rgba[pixel * 4 + 2] / 255;
  }
  return { tensor: new ort.Tensor('float32', data, [1, 3, INPUT_SIZE, INPUT_SIZE]), scale, paddingX, paddingY, width, height };
}
function mapBoxToOriginal(box, transform) {
  const { scale, paddingX, paddingY, width, height } = transform;
  const clamp = (value, max) => Math.max(0, Math.min(value, max));
  return [clamp((box[0] - paddingX) / scale, width), clamp((box[1] - paddingY) / scale, height),
    clamp((box[2] - paddingX) / scale, width), clamp((box[3] - paddingY) / scale, height)];
}
function logRawDetections(output, transform) {
  if (!DEBUG_DETECTIONS) return;
  console.groupCollapsed(`[Playground 01] RAW MODEL OUTPUT — ${ui.fileName.textContent}`);
  console.info('Exported output0 is already post-NMS; this is before browser filtering.', {
    shape: output?.dims, type: output?.type, runtime: runtimeProvider,
    scale: transform.scale, paddingX: transform.paddingX, paddingY: transform.paddingY
  });
  if (!output || String(output.dims) !== '1,300,6' || !output.data || output.data.length !== 1800) {
    console.warn('Unexpected output contract; parsing will report an error.');
  } else {
    const rows = [];
    for (let offset = 0; offset < output.data.length; offset += 6) {
      const [x1, y1, x2, y2, confidence, classId] = output.data.slice(offset, offset + 6);
      if ([x1, y1, x2, y2, confidence, classId].every(value => value === 0)) continue;
      rows.push({ row: offset / 6, class_id: classId, class_name: CLASS_NAMES[classId] ?? 'Unknown', confidence, x1, y1, x2, y2 });
    }
    console.info(`${rows.length} non-empty rows; ${300 - rows.length} empty/padded rows. Coordinates are in the letterboxed input.`);
    console.table(rows);
  }
  console.groupEnd();
}
function logDetectionStage(stage, detections) {
  if (!DEBUG_DETECTIONS) return;
  console.groupCollapsed(`[Playground 01] ${stage} — ${ui.fileName.textContent}`);
  console.info(`Count: ${detections.length}; confidence threshold: ${CONFIDENCE_THRESHOLD}. Coordinates are in the original image.`);
  console.table(detections.map(({ box, confidence, classId, label }) => ({
    class_id: classId, class_name: label, confidence,
    x1: box[0], y1: box[1], x2: box[2], y2: box[3]
  })));
  console.groupEnd();
}
function parseDetections(output, transform) {
  if (!output || output.type !== 'float32' || output.dims.length !== 3 ||
      output.dims[0] !== 1 || output.dims[1] !== 300 || output.dims[2] !== 6 || output.data.length !== 1800) {
    throw new Error('Unexpected ONNX output. Expected output0: float32 [1,300,6].');
  }
  const detections = [];
  for (let offset = 0; offset < output.data.length; offset += 6) {
    const row = Array.from(output.data.subarray(offset, offset + 6));
    const [x1, y1, x2, y2, confidence, classId] = row;
    if (!row.every(Number.isFinite) || confidence <= 0 || confidence < CONFIDENCE_THRESHOLD || confidence > 1 || x2 <= x1 || y2 <= y1) continue;
    if (!Number.isInteger(classId) || !CLASS_NAMES[classId]) {
      throw new Error(`Unknown model class ${classId}. Check CLASS_NAMES against model metadata.`);
    }
    const box = mapBoxToOriginal([x1, y1, x2, y2], transform);
    if (box[2] <= box[0] || box[3] <= box[1]) continue;
    detections.push({ box, confidence, classId, label: CLASS_NAMES[classId] });
  }
  // NMS is already part of best.onnx. Do not suppress these rows again.
  return detections;
}
function drawDetections(image, detections) {
  const scale = Math.min(1, MAX_CANVAS_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = ui.resultCanvas;
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const fontSize = Math.max(13, Math.round(canvas.width / 38));
  context.font = `600 ${fontSize}px Inter, sans-serif`;
  context.lineWidth = Math.max(2, canvas.width / 260);
  context.textBaseline = 'top';
  for (const detection of detections) {
    const [x1, y1, x2, y2] = detection.box.map(value => value * scale);
    const label = `${detection.label} ${(detection.confidence * 100).toFixed(1)}%`;
    const color = detection.classId === ELEPHANT_CLASS_ID ? '#FF8C42' : '#5EEAD4';
    context.strokeStyle = color;
    context.strokeRect(x1, y1, x2 - x1, y2 - y1);
    const labelWidth = Math.min(canvas.width, context.measureText(label).width + 12);
    const labelHeight = fontSize + 10;
    const labelX = Math.max(0, Math.min(x1, canvas.width - labelWidth));
    const labelY = Math.max(0, Math.min(y1 >= labelHeight ? y1 - labelHeight : y1, canvas.height - labelHeight));
    context.fillStyle = '#08131F';
    context.fillRect(labelX, labelY, labelWidth, labelHeight);
    context.fillStyle = color;
    context.fillText(label, labelX + 6, labelY + 5, labelWidth - 12);
  }
  canvas.setAttribute('aria-label', `Detection result: ${detections.length} detections. See the summary for class names and confidence.`);
  canvas.hidden = false;
  ui.resultPlaceholder.hidden = true;
}
function showSummary(detections, elapsed) {
  const elephants = detections.filter(item => item.classId === ELEPHANT_CLASS_ID).length;
  ui.detectionCount.textContent = `Detections: ${detections.length} · Elephants: ${elephants}`;
  ui.emptyResult.hidden = elephants > 0;
  ui.detectionList.replaceChildren();
  for (const detection of detections) {
    const item = document.createElement('li');
    item.textContent = `${detection.label} — ${(detection.confidence * 100).toFixed(1)}%`;
    ui.detectionList.appendChild(item);
  }
  ui.inferenceTime.textContent = `${(elapsed / 1000).toFixed(2)} s`;
  ui.thresholdNote.textContent = `Confidence threshold: ${(CONFIDENCE_THRESHOLD * 100).toFixed(0)}% · Model classes: ${CLASS_NAMES.join(', ')}`;
  ui.resultSummary.hidden = false;
}
async function runDetection() {
  if (!session || !selectedImage || running || decoding || resetting) return;
  running = true;
  clearResults();
  ui.detectionStatus.textContent = 'Running detection...';
  updateControls();
  let input;
  let outputs;
  try {
    // Give the browser a chance to paint the busy state before CPU work starts.
    await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));
    const start = performance.now();
    const transform = preprocessImage(selectedImage);
    input = transform.tensor;
    try { outputs = await session.run({ images: input }); }
    catch (error) {
      if (runtimeProvider !== 'webgpu') throw error;
      console.warn('[Playground 01] GPU inference failed; retrying this image on WASM.', error);
      await session.release().catch(() => {});
      session = null;
      session = await createSession('wasm');
      runtimeProvider = 'wasm';
      ui.runtimeLabel.textContent = 'Runtime: WebAssembly';
      outputs = await session.run({ images: input });
    }
    logRawDetections(outputs.output0, transform);
    const detections = parseDetections(outputs.output0, transform);
    logDetectionStage('DETECTIONS AFTER CONFIDENCE / UI FILTERING', detections);
    drawDetections(selectedImage, detections);
    logDetectionStage('ANNOTATED DETECTIONS', detections);
    showSummary(detections, performance.now() - start);
    ui.detectionStatus.textContent = 'Detection complete. Try another image when you’re ready.';
  } catch (error) {
    console.error('[Playground 01] Detection failed.', error);
    ui.detectionStatus.textContent = 'Detection could not finish. Try again or choose another image.';
    if (!session) {
      setModelStatus('Model unavailable', 'error');
      ui.modelErrorText.textContent = 'The AI runtime needs to be restarted. Please retry model loading.';
      ui.modelError.hidden = false;
    }
  } finally {
    input?.dispose();
    if (outputs) Object.values(outputs).forEach(tensor => tensor.dispose());
    running = false;
    updateControls();
  }
}
async function resetPlayground() {
  if (running || resetting) return;
  resetting = true;
  // Invalidate pending image downloads before the exit transition begins.
  imageVersion++;
  decoding = false;
  updateControls();
  const region = ui.resultsRegion;
  const height = region.getBoundingClientRect().height;
  let collapse;
  if (height > 0 && !matchMedia('(prefers-reduced-motion: reduce)').matches && region.animate) {
    // Keep the preview intact while its container folds upward, then clear it.
    region.style.overflow = 'hidden';
    collapse = region.animate([
      { height: `${height}px`, opacity: 1, transform: 'translateY(0)' },
      { height: '0px', opacity: 0, transform: 'translateY(-8px)' }
    ], { duration: RESET_TRANSITION_MS, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' });
    await collapse.finished.catch(() => {});
  }
  selectedImage = null;
  ui.originalImage.removeAttribute('src');
  if (imageURL) URL.revokeObjectURL(imageURL);
  imageURL = null;
  ui.imageInput.value = '';
  ui.exampleSelect.value = '';
  if (examples.length) ui.exampleStatus.textContent = 'Choose an example, then run detection.';
  ui.selectionInfo.hidden = true;
  ui.comparison.hidden = true;
  ui.imageError.hidden = true;
  clearResults();
  ui.resultCanvas.width = ui.resultCanvas.height = 1;
  ui.detectionStatus.textContent = 'Choose an image to get started.';
  collapse?.cancel();
  region.style.removeProperty('overflow');
  resetting = false;
  updateControls();
  ui.dropzone.focus({ preventScroll: true });
}

ui.themeToggle.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(theme);
  try { localStorage.setItem('portfolio-theme', theme); } catch {}
});
window.addEventListener('storage', event => { if (event.key === 'portfolio-theme') applyTheme(event.newValue || 'dark'); });
applyTheme(document.documentElement.dataset.theme || 'dark');
ui.dropzone.addEventListener('click', () => ui.imageInput.click());
ui.imageInput.addEventListener('change', () => { if (ui.imageInput.files[0]) loadImageFile(ui.imageInput.files[0]); });
ui.dropzone.addEventListener('dragenter', event => { event.preventDefault(); if (!running) { dragDepth++; ui.dropzone.classList.add('is-dragging'); } });
ui.dropzone.addEventListener('dragover', event => { event.preventDefault(); event.dataTransfer.dropEffect = running ? 'none' : 'copy'; });
ui.dropzone.addEventListener('dragleave', event => { event.preventDefault(); if (--dragDepth <= 0) ui.dropzone.classList.remove('is-dragging'); });
ui.dropzone.addEventListener('drop', event => {
  event.preventDefault();
  dragDepth = 0;
  ui.dropzone.classList.remove('is-dragging');
  if (running) return;
  if (event.dataTransfer.files.length !== 1) {
    ui.imageError.textContent = 'Please choose one image at a time.';
    ui.imageError.hidden = false;
  } else loadImageFile(event.dataTransfer.files[0]);
});
// Prevent a missed drop from navigating away and opening the image in the tab.
window.addEventListener('dragover', event => event.preventDefault());
window.addEventListener('drop', event => event.preventDefault());
ui.runButton.addEventListener('click', runDetection);
ui.resetButton.addEventListener('click', resetPlayground);
ui.exampleSelect.addEventListener('change', loadExample);
ui.retryModel.addEventListener('click', () => {
  if (!window.ort) { location.reload(); return; }
  if (session) return;
  modelPromise = null;
  loadModel();
});
loadModel();
loadExamples();
