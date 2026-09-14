import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { COMPONENT_INFO } from './component-info.js';
import { arrangeExplosion, isHardware } from '../js/assembly-layout.js';
import { EXPLOSION_LAYOUT } from './explosion-layout.js';

// This SOLIDWORKS export is upside down in Y-up: correct the whole assembly,
// preserving every component's local transform and alignment.
const MODEL_URL = new URL('./models/Holder_v7.glb', import.meta.url).href;
const MODEL_ROTATION_Z = Math.PI;
const $ = selector => document.querySelector(selector);
const viewport = $('#viewport');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const debug = new URLSearchParams(location.search).has('debug');
const components = [];
const meshOwners = new Map();
const materialStates = new Map();
const raycaster = new THREE.Raycaster();
const presets = {
  ISO: new THREE.Vector3(1, 0.8, 1),
  FRONT: new THREE.Vector3(0, 0, 1),
  TOP: new THREE.Vector3(0, 1, 0),
  RIGHT: new THREE.Vector3(1, 0, 0)
};
let scene, renderer, camera, controls, model;
let assemblyRadius = 1;
let selected = null;
let explosionAmount = 0;
let explosionTarget = 0;
let explosionAnimation = null;
let cameraAnimation = null;
let wireframe = false;
let frameRequest = 0;
let ready = false;
let currentPreset = 'ISO';
let pointerStart = null;
const activePointers = new Set();

initScene();
bindEvents();
loadModel();

function initScene() {
  scene = new THREE.Scene();
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('aria-label', 'Mechanical assembly. Arrow keys pan; plus and minus zoom.');
  canvas.setAttribute('aria-describedby', 'navigationHelp');
  viewport.prepend(canvas);
  camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100);
  controls = new TrackballControls(camera, canvas);
  // Direct manipulation permits repeated full pitch turns without pole clamps.
  controls.staticMoving = true;
  controls.rotateSpeed = 2;
  controls.keys = [];
  controls.enabled = false;
  controls.addEventListener('change', requestRender);
  controls.addEventListener('start', () => {
    cameraAnimation = null;
    setPresetLabel(null);
  });
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  scene.add(new THREE.HemisphereLight(0xcfeaff, 0x7e858a, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 2);
  key.position.set(1, 2, 3);
  const fill = new THREE.DirectionalLight(0xd3f8ef, 0.6);
  fill.position.set(-2, 1, -1);
  scene.add(key, fill);
  new ResizeObserver(resizeViewer).observe(viewport);
  resizeViewer();
}

async function loadModel() {
  try {
    const gltf = await new GLTFLoader().loadAsync(MODEL_URL, event => {
      if (event.total > 0) $('#loadProgress').value = event.loaded / event.total * 100;
    });
    model = gltf.scene;
    model.rotateZ(MODEL_ROTATION_Z);
    model.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(model);
    if (bounds.isEmpty() || !Number.isFinite(bounds.min.length() + bounds.max.length())) {
      throw new Error('The GLB contains no usable geometry.');
    }
    assemblyRadius = bounds.getBoundingSphere(new THREE.Sphere()).radius;
    if (assemblyRadius <= 0) throw new Error('The GLB has zero-size bounds.');
    discoverComponents(gltf);
    if (components.length < 2) {
      throw new Error('The GLB has fewer than two separate components. Re-export separate CAD components.');
    }
    scene.add(model);
    calculateExplodedPositions();
    buildComponentTree();
    if (debug) logHierarchy(model);
    ready = true;
    controls.enabled = true;
    controls.minDistance = assemblyRadius * 0.05;
    controls.maxDistance = assemblyRadius * 50;
    camera.near = assemblyRadius / 1000;
    camera.far = assemblyRadius * 150;
    camera.updateProjectionMatrix();
    frameModel(presets.ISO, 0, true);
    $('#viewerControls').disabled = false;
    $('#showAll').disabled = false;
    $('#loading').hidden = true;
    $('#status').textContent = 'Assembly ready';
    $('#status').dataset.state = 'ready';
    if (debug) exposeDiagnostics();
    requestRender();
  } catch (error) {
    console.error('Assembly loading failed:', error);
    $('#status').textContent = 'The 3D assembly could not be loaded.';
    $('#status').dataset.state = 'error';
    $('#loadingMessage').textContent = components.length === 1
      ? 'This model needs to be re-exported with separate components.'
      : 'The 3D assembly could not be loaded.';
    $('#loadProgress').hidden = true;
  }
}

function discoverComponents(gltf) {
  const nodes = gltf.parser.json.nodes || [];
  const nodeOwners = new Map();
  // Use source glTF nodes, so a mesh with several material primitives stays one part.
  model.traverse(node => {
    const index = gltf.parser.associations.get(node)?.nodes;
    if (index !== undefined) node.userData.sourceName = nodes[index].name;
    if (index === undefined || nodes[index].mesh === undefined) return;
    const sourceName = nodes[index].name || node.name || `Component ${components.length + 1}`;
    const info = COMPONENT_INFO[sourceName];
    const component = {
      id: components.length, node, sourceName,
      name: info?.displayName || sourceName,
      description: info?.description || (/^HAT Part|^Cam Rear|^Pi Part|^Cam Part/.test(sourceName)
        ? 'Subcomponent retained from the CAD export; its exact function is not specified in the source.'
        : `${sourceName} in the mechanical assembly.`),
      originalName: nodes[index].extras?.originalName || sourceName,
      meshes: [], visible: true,
      originalPosition: node.position.clone(),
      originalQuaternion: node.quaternion.clone(),
      originalScale: node.scale.clone(),
      originalWorldPosition: node.getWorldPosition(new THREE.Vector3()),
      bounds: new THREE.Box3(), offset: new THREE.Vector3()
    };
    component.hardware = isHardware(component);
    components.push(component);
    nodeOwners.set(node, component);
  });
  model.traverse(mesh => {
    if (!mesh.isMesh) return;
    let ancestor = mesh;
    while (ancestor && !nodeOwners.has(ancestor)) ancestor = ancestor.parent;
    const component = nodeOwners.get(ancestor);
    if (!component) return;
    component.meshes.push(mesh);
    meshOwners.set(mesh, component);
    mesh.geometry.computeBoundingBox();
    component.bounds.union(mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld));
    const originals = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const variants = highlighted => originals.map(original => {
      const material = original.clone();
      if (highlighted) {
        if (material.color) material.color.lerp(new THREE.Color(0xff8c42), 0.7);
        if (material.emissive) {
          material.emissive.set(0xff8c42);
          material.emissiveIntensity = 0.35;
        }
      }
      return material;
    });
    const highlight = variants(true);
    const wire = variants(false);
    const highlightWire = variants(true);
    [...wire, ...highlightWire].forEach(material => { material.wireframe = true; });
    const shape = list => Array.isArray(mesh.material) ? list : list[0];
    materialStates.set(mesh, { original: mesh.material, highlight: shape(highlight), wire: shape(wire), highlightWire: shape(highlightWire) });
  });
}

function logHierarchy(root) {
  const lines = [];
  function visit(node, prefix, last, isRoot = false) {
    const owner = meshOwners.get(node);
    lines.push(`${prefix}${isRoot ? '' : last ? '└── ' : '├── '}${node.name || node.type}${owner ? ` [${owner.name}]` : ''}`);
    node.children.forEach((child, index) => visit(child, prefix + (isRoot ? '' : last ? '    ' : '│   '), index === node.children.length - 1));
  }
  visit(root, '', true, true);
  console.info('GLB hierarchy:\n' + lines.join('\n'));
  console.table(components.map(part => ({ component: part.name, source: part.sourceName, meshes: part.meshes.length })));
  console.info('Assembly bounds (model units):', new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3()).toArray());
}

function buildComponentTree() {
  const treeParts = components.filter(part => !part.hardware);
  const owners = new Map(treeParts.map(part => [part.node, part]));
  const included = new Set();
  treeParts.forEach(part => {
    for (let node = part.node; node; node = node.parent) included.add(node);
  });
  const list = document.createElement('ul');
  function appendNode(node, parentList) {
    if (!included.has(node)) return;
    const part = owners.get(node);
    const children = node.children.filter(child => included.has(child));
    // Collapse anonymous transform wrappers, retain useful named subassemblies.
    if (!part && (!node.name || node === model || children.length === 1)) {
      children.forEach(child => appendNode(child, parentList));
      return;
    }
    const item = document.createElement('li');
    parentList.append(item);
    let childContainer = item;
    if (part) {
      const row = document.createElement('div');
      row.className = 'component-row';
      row.dataset.component = part.id;
      const select = makeButton(part.name, `Select ${part.name}`, () => selectComponent(part));
      select.className = 'component-select';
      select.setAttribute('aria-pressed', 'false');
      const visibility = makeButton('Hide', `Hide ${part.name}`, () => setComponentVisible(part, !part.visible));
      visibility.className = 'component-visibility';
      const isolate = makeButton('⊙', `Isolate ${part.name}`, () => isolateComponent(part));
      isolate.className = 'component-isolate';
      row.append(select, visibility, isolate);
      item.append(row);
      part.row = row;
    } else {
      const group = document.createElement('details');
      group.open = true;
      const summary = document.createElement('summary');
      summary.textContent = node.name;
      group.append(summary);
      item.append(group);
      childContainer = group;
    }
    if (children.length) {
      const nested = document.createElement('ul');
      childContainer.append(nested);
      children.forEach(child => appendNode(child, nested));
    }
  }
  appendNode(model, list);
  $('#componentTree').replaceChildren(list);
  $('#componentCount').textContent = String(treeParts.length).padStart(2, '0');
}

function makeButton(text, label, handler) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', handler);
  return button;
}

function updateMaterials() {
  meshOwners.forEach((part, mesh) => {
    const state = materialStates.get(mesh);
    mesh.material = part === selected
      ? (wireframe ? state.highlightWire : state.highlight)
      : (wireframe ? state.wire : state.original);
  });
  requestRender();
}

function selectComponent(part) {
  selected = part;
  components.forEach(component => component.row?.querySelector('.component-select').setAttribute('aria-pressed', String(component === part)));
  $('#selectedName').textContent = part?.name || 'Select a component';
  $('#selectedDescription').textContent = part?.description || 'Choose a part in the viewport or component list to inspect it.';
  $('#selectedSource').textContent = part ? `SOURCE / ${part.originalName}` : '';
  $('#selectedVisibility').disabled = !part;
  $('#selectedIsolate').disabled = !part;
  $('#clearSelection').disabled = !part;
  updateVisibilityUI();
  updateMaterials();
}

function clearSelection() { selectComponent(null); }

function setComponentVisible(part, visible) {
  part.visible = visible;
  // Hide only owned renderables, not transform parents of other selectable parts.
  part.meshes.forEach(mesh => {
    mesh.layers.set(visible ? 0 : 1);
  });
  updateVisibilityUI();
  requestRender();
}

function updateVisibilityUI() {
  components.forEach(part => {
    if (!part.row) return;
    part.row.dataset.hidden = String(!part.visible);
    const button = part.row.querySelector('.component-visibility');
    button.textContent = part.visible ? 'Hide' : 'Show';
    button.setAttribute('aria-label', `${part.visible ? 'Hide' : 'Show'} ${part.name}`);
  });
  $('#selectedVisibility').textContent = selected?.visible === false ? 'Show' : 'Hide';
}

function isolateComponent(part) {
  components.forEach(component => setComponentVisible(component, component === part));
  selectComponent(part);
}

function showAllComponents() {
  components.forEach(part => setComponentVisible(part, true));
}

function calculateExplodedPositions() {
  arrangeExplosion(components, EXPLOSION_LAYOUT, assemblyRadius);
}

function applyExplosion(amount) {
  explosionAmount = amount;
  // Components were discovered parent-first. Convert absolute world targets through
  // each updated parent so nested/scaled assemblies don't accumulate displacement.
  components.forEach(part => {
    part.node.quaternion.copy(part.originalQuaternion);
    part.node.scale.copy(part.originalScale);
    if (amount === 0) {
      part.node.position.copy(part.originalPosition);
    } else {
      const target = part.originalWorldPosition.clone().addScaledVector(part.offset, amount);
      part.node.parent.updateWorldMatrix(true, false);
      part.node.position.copy(part.node.parent.worldToLocal(target));
    }
    part.node.updateWorldMatrix(false, true);
  });
  $('#explosion').value = String(Math.round(amount * 100));
  $('#explosionValue').value = `${Math.round(amount * 100)}%`;
  requestRender();
}

function setExplosionAmount(amount, immediate = false) {
  if (!ready) return;
  explosionTarget = THREE.MathUtils.clamp(amount, 0, 1);
  explosionAnimation = null;
  if (immediate || reducedMotion.matches) applyExplosion(explosionTarget);
  else explosionAnimation = { from: explosionAmount, to: explosionTarget, start: performance.now(), duration: 650 };
  const direction = camera.position.clone().sub(controls.target).normalize();
  frameModel(direction, explosionTarget, immediate || reducedMotion.matches);
  requestRender();
}

function fitDistance(amount, center) {
  // A sphere enclosing all original AABB corners plus their calculated offsets is
  // conservative in every view and aspect ratio, including exploded/mobile views.
  let radius = 0;
  components.forEach(part => {
    for (const x of [part.bounds.min.x, part.bounds.max.x]) {
      for (const y of [part.bounds.min.y, part.bounds.max.y]) {
        for (const z of [part.bounds.min.z, part.bounds.max.z]) {
          radius = Math.max(radius, new THREE.Vector3(x, y, z).addScaledVector(part.offset, amount).distanceTo(center));
        }
      }
    }
  });
  const vertical = THREE.MathUtils.degToRad(camera.fov / 2);
  const horizontal = Math.atan(Math.tan(vertical) * camera.aspect);
  return radius * 1.12 / Math.sin(Math.min(vertical, horizontal));
}

function frameModel(direction, amount = explosionTarget, immediate = false, up = camera.up) {
  // Consume pending input before the preset/fit animation takes camera ownership.
  controls.update();
  const bounds = new THREE.Box3();
  components.forEach(part => bounds.union(part.bounds.clone().translate(part.offset.clone().multiplyScalar(amount))));
  const frameCenter = bounds.getCenter(new THREE.Vector3());
  const distance = fitDistance(amount, frameCenter);
  const position = frameCenter.clone().addScaledVector(direction.clone().normalize(), distance);
  cameraAnimation = {
    from: camera.position.clone(), to: position,
    fromTarget: controls.target.clone(), toTarget: frameCenter.clone(),
    fromUp: camera.up.clone(),
    upRotation: new THREE.Quaternion().setFromUnitVectors(camera.up.clone().normalize(), up.clone().normalize()),
    start: performance.now(), duration: 500
  };
  if (immediate || reducedMotion.matches) {
    camera.position.copy(position);
    controls.target.copy(frameCenter);
    camera.up.copy(up);
    camera.lookAt(frameCenter);
    controls.update();
    cameraAnimation = null;
  }
  requestRender();
}

function setPresetLabel(name) {
  currentPreset = name;
  $('#viewLabel').textContent = `${name || 'ORBIT'} / PERSPECTIVE`;
  document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === name)));
}

function moveToPresetView(name) {
  if (!ready) return;
  setPresetLabel(name);
  // TOP needs a nonparallel up vector. Presets also clear any trackball roll.
  frameModel(presets[name], explosionTarget, false, new THREE.Vector3(0, name === 'TOP' ? 0 : 1, name === 'TOP' ? -1 : 0));
}

function resetViewer() {
  explosionAnimation = null;
  explosionTarget = 0;
  applyExplosion(0);
  showAllComponents();
  wireframe = false;
  $('#wireframe').setAttribute('aria-pressed', 'false');
  clearSelection();
  moveToPresetView('ISO');
}

function resizeViewer() {
  if (!renderer) return;
  const width = viewport.clientWidth;
  const height = viewport.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  controls?.handleResize();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  if (ready) frameModel(camera.position.clone().sub(controls.target).normalize(), explosionTarget, true);
  requestRender();
}

function pickComponent(event) {
  if (!ready) return;
  const rect = renderer.domElement.getBoundingClientRect();
  const pointer = new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1);
  model.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  raycaster.setFromCamera(pointer, camera);
  const meshes = [...meshOwners.keys()].filter(mesh => meshOwners.get(mesh).visible);
  const hit = raycaster.intersectObjects(meshes, false)[0];
  selectComponent(hit ? meshOwners.get(hit.object) : null);
  if (selected?.row) {
    // Only scroll the list itself; avoid jumping the entire mobile page.
    const panel = $('.assembly-tree');
    const row = selected.row.getBoundingClientRect();
    const list = panel.getBoundingClientRect();
    if (row.top < list.top || row.bottom > list.bottom) panel.scrollTop += row.top - list.top - 45;
  }
}

function bindEvents() {
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => moveToPresetView(button.dataset.view)));
  $('#showAll').addEventListener('click', showAllComponents);
  $('#clearSelection').addEventListener('click', clearSelection);
  $('#selectedVisibility').addEventListener('click', () => selected && setComponentVisible(selected, !selected.visible));
  $('#selectedIsolate').addEventListener('click', () => selected && isolateComponent(selected));
  $('#explode').addEventListener('click', () => setExplosionAmount(1));
  $('#assemble').addEventListener('click', () => setExplosionAmount(0));
  $('#explosion').addEventListener('input', event => setExplosionAmount(Number(event.target.value) / 100, true));
  $('#reset').addEventListener('click', resetViewer);
  $('#wireframe').addEventListener('click', () => {
    wireframe = !wireframe;
    $('#wireframe').setAttribute('aria-pressed', String(wireframe));
    updateMaterials();
  });
  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', event => {
    controls.handleResize();
    activePointers.add(event.pointerId);
    if (event.button !== 0 || activePointers.size !== 1) { pointerStart = null; return; }
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
  });
  canvas.addEventListener('pointermove', event => {
    requestRender();
    if (pointerStart && Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5) pointerStart.moved = true;
  });
  canvas.addEventListener('pointerup', event => {
    if (pointerStart?.id === event.pointerId && !pointerStart.moved && activePointers.size === 1) pickComponent(event);
    activePointers.delete(event.pointerId);
    pointerStart = null;
  });
  canvas.addEventListener('pointercancel', event => { activePointers.delete(event.pointerId); pointerStart = null; });
  canvas.addEventListener('wheel', requestRender, { passive: true });
  canvas.addEventListener('keydown', event => {
    if (!ready) return;
    if (event.key === 'Escape') clearSelection();
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      cameraAnimation = null;
      camera.updateMatrixWorld(true);
      const step = camera.position.distanceTo(controls.target) * 0.025;
      const pan = new THREE.Vector3().setFromMatrixColumn(camera.matrix, event.key === 'ArrowLeft' || event.key === 'ArrowRight' ? 0 : 1);
      pan.multiplyScalar(step * (event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -1 : 1));
      camera.position.add(pan);
      controls.target.add(pan);
      setPresetLabel(null);
      controls.update();
      requestRender();
    }
    if (['+', '=', '-', '_'].includes(event.key)) {
      event.preventDefault();
      cameraAnimation = null;
      const offset = camera.position.clone().sub(controls.target);
      const distance = THREE.MathUtils.clamp(offset.length() * (['+', '='].includes(event.key) ? 0.85 : 1.15), controls.minDistance, controls.maxDistance);
      camera.position.copy(controls.target).add(offset.setLength(distance));
      controls.update();
      requestRender();
    }
  });
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    $('#status').textContent = '3D view paused. Waiting for graphics to recover...';
  });
  canvas.addEventListener('webglcontextrestored', () => { $('#status').textContent = ready ? 'Assembly ready' : 'Loading 3D assembly...'; requestRender(); });
  function updateTheme() {
    const light = document.documentElement.dataset.theme === 'light';
    $('#themeToggle').textContent = light ? '☾' : '☀';
    $('#themeToggle').setAttribute('aria-pressed', String(light));
    $('#themeToggle').setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
    requestRender();
  }
  $('#themeToggle').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('portfolio-theme', theme); } catch { /* Theme works without storage. */ }
    updateTheme();
  });
  window.addEventListener('storage', event => {
    if (event.key === 'portfolio-theme') { document.documentElement.dataset.theme = event.newValue || 'dark'; updateTheme(); }
  });
  updateTheme();
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      if (explosionAnimation) { applyExplosion(explosionTarget); explosionAnimation = null; }
      if (cameraAnimation) {
        camera.position.copy(cameraAnimation.to);
        controls.target.copy(cameraAnimation.toTarget);
        camera.up.copy(cameraAnimation.fromUp).applyQuaternion(cameraAnimation.upRotation);
        cameraAnimation = null;
      }
    }
    requestRender();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frameRequest); frameRequest = 0; }
    else requestRender();
  });
}

function requestRender() {
  if (!frameRequest && !document.hidden) frameRequest = requestAnimationFrame(render);
}

function render(now) {
  frameRequest = 0;
  if (explosionAnimation) {
    const t = Math.min(1, (now - explosionAnimation.start) / explosionAnimation.duration);
    applyExplosion(THREE.MathUtils.lerp(explosionAnimation.from, explosionAnimation.to, t * t * (3 - 2 * t)));
    if (t === 1) explosionAnimation = null;
  }
  if (cameraAnimation) {
    const t = Math.min(1, (now - cameraAnimation.start) / cameraAnimation.duration);
    const eased = t * t * (3 - 2 * t);
    camera.position.lerpVectors(cameraAnimation.from, cameraAnimation.to, eased);
    controls.target.lerpVectors(cameraAnimation.fromTarget, cameraAnimation.toTarget, eased);
    camera.up.copy(cameraAnimation.fromUp).applyQuaternion(new THREE.Quaternion().slerp(cameraAnimation.upRotation, eased));
    if (t === 1) cameraAnimation = null;
  }
  controls.update();
  renderer.render(scene, camera);
  if (cameraAnimation || explosionAnimation) requestRender();
}

// Read-only diagnostics are available only with ?debug=1; useful after replacing a GLB.
function exposeDiagnostics() {
  window.viewerDebug = {
    snapshot() {
      camera.updateMatrixWorld(true);
      const corners = [];
      components.forEach(part => {
        const offset = part.offset.clone().multiplyScalar(explosionAmount);
        for (const x of [part.bounds.min.x, part.bounds.max.x]) for (const y of [part.bounds.min.y, part.bounds.max.y]) for (const z of [part.bounds.min.z, part.bounds.max.z]) {
          corners.push(new THREE.Vector3(x, y, z).add(offset).project(camera).toArray());
        }
      });
      return {
        ready, selected: selected?.id ?? null, explosionAmount, wireframe, currentPreset,
        animating: Boolean(cameraAnimation || explosionAnimation),
        camera: camera.position.toArray(), target: controls.target.toArray(),
        up: camera.up.toArray(), modelRotation: model.rotation.toArray().slice(0, 3),
        direction: camera.position.clone().sub(controls.target).normalize().toArray(),
        frameCount: renderer.info.render.frame,
        allBoundsFit: corners.every(([x, y, z]) => Math.abs(x) <= 1 && Math.abs(y) <= 1 && z >= -1 && z <= 1),
        components: components.map(part => ({
          id: part.id, name: part.name, sourceName: part.sourceName, visible: part.visible,
          hardware: part.hardware, listed: Boolean(part.row), explosionGroup: part.explosionGroup, offset: part.offset.toArray(),
          position: part.node.position.toArray(), originalPosition: part.originalPosition.toArray(),
          worldPosition: part.node.getWorldPosition(new THREE.Vector3()).toArray(),
          expectedWorldPosition: part.originalWorldPosition.clone().addScaledVector(part.offset, explosionAmount).toArray(),
          originalMaterials: part.meshes.every(mesh => mesh.material === materialStates.get(mesh).original),
          highlighted: part.meshes.every(mesh => mesh.material === materialStates.get(mesh)[wireframe ? 'highlightWire' : 'highlight'])
        }))
      };
    },
    pickPoint(id) {
      // Find a screen point whose real raycast reaches this component, including occlusion.
      const part = components[id];
      if (!part?.visible) return null;
      model.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      const rect = renderer.domElement.getBoundingClientRect();
      const visibleMeshes = [...meshOwners.keys()].filter(mesh => meshOwners.get(mesh).visible);
      for (const mesh of part.meshes) {
        const positions = mesh.geometry.attributes.position;
        for (let i = 0; i < positions.count; i += Math.max(1, Math.floor(positions.count / 500))) {
          const point = new THREE.Vector3().fromBufferAttribute(positions, i).applyMatrix4(mesh.matrixWorld).project(camera);
          if (Math.abs(point.x) > 0.98 || Math.abs(point.y) > 0.98) continue;
          // Browser pointer coordinates can be rounded to CSS pixels. Validate
          // the actual click ray instead of a vertex exactly on a silhouette.
          const x = Math.round(rect.left + (point.x + 1) * rect.width / 2);
          const y = Math.round(rect.top + (1 - point.y) * rect.height / 2);
          raycaster.setFromCamera(new THREE.Vector2((x - rect.left) / rect.width * 2 - 1, 1 - (y - rect.top) / rect.height * 2), camera);
          const hit = raycaster.intersectObjects(visibleMeshes, false)[0];
          if (hit && meshOwners.get(hit.object) === part) return { x, y };
        }
      }
      return null;
    }
  };
}
