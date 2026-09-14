// Development only: node viewer01/verify.mjs [--serve]
// Install playwright-core outside the website and set PLAYWRIGHT_MODULE to its
// index.mjs, plus CHROME_PATH if Chrome is not in the usual Windows location.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, mkdtemp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, extname, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.glb': 'model/gltf-binary', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = createServer(async (request, response) => {
  try {
    let path = resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname));
    if (path !== root && !path.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
    const body = await readFile(path);
    response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Content-Length': body.length });
    response.end(body);
  } catch { response.writeHead(404).end('Not found'); }
});
await new Promise(resolve => server.listen(process.argv.includes('--serve') ? 4173 : 0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
console.log('Static preview:', origin);

if (!process.argv.includes('--serve')) {
  const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright-core');
  const output = process.env.VIEWER_TEST_OUTPUT || await mkdtemp(join(tmpdir(), 'portfolio-viewer-check-'));
  await mkdir(output, { recursive: true });
  console.log('Evidence:', output);
  const modelPath = join(root, 'viewer01/models/Holder_v7.glb');
  const digest = async () => createHash('sha256').update(await readFile(modelPath)).digest('hex');
  const beforeHash = await digest();
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } });
    const page = await context.newPage();
    const errors = [];
    const downloads = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (request.url().endsWith('.glb')) downloads.push(request.url()); });
    page.on('console', message => { if (message.type() === 'error') console.log('Console error:', message.text()); });
    await page.goto(origin + '/viewer01/?debug=1');
    await page.waitForFunction(() => document.querySelector('#status').dataset.state !== 'loading', { timeout: 90000 });
    assert.equal(await page.locator('#status').innerText(), 'Assembly ready');
    const snapshot = () => page.evaluate(() => viewerDebug.snapshot());
    const settled = () => page.waitForFunction(() => !viewerDebug.snapshot().animating);
    const click = async selector => { await page.locator(selector).click(); await settled(); };
    let state = await snapshot();
    assert.equal(state.components.length, 13);
    assert(state.allBoundsFit);
    await page.screenshot({ path: join(output, 'desktop.png'), fullPage: true });
    console.log('PASS: GLB load, 13 components, initial bounds fit');

    for (const [name, direction] of Object.entries({ ISO: [1, 0.8, 1], FRONT: [0, 0, 1], TOP: [0, 1, 0], RIGHT: [1, 0, 0] })) {
      await click(`[data-view="${name}"]`);
      state = await snapshot();
      const length = Math.hypot(...direction);
      assert(state.direction.every((value, i) => Math.abs(value - direction[i] / length) < 0.0001), name);
      assert(state.allBoundsFit, name);
    }
    await click('[data-view="ISO"]');
    const box = await page.locator('canvas').boundingBox();
    const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    async function drag(button, dx, dy) {
      await page.mouse.move(center.x, center.y);
      await page.mouse.down({ button });
      await page.mouse.move(center.x + dx, center.y + dy, { steps: 12 });
      await page.mouse.up({ button });
      await page.waitForTimeout(900);
    }
    const initial = await snapshot();
    await drag('left', 90, 35);
    assert.notDeepEqual((await snapshot()).direction, initial.direction);
    const rotated = await snapshot();
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(900);
    assert.notDeepEqual((await snapshot()).camera, rotated.camera);
    const zoomed = await snapshot();
    await drag('right', 60, 20);
    assert.notDeepEqual((await snapshot()).target, zoomed.target);
    await click('#reset');
    console.log('PASS: four presets, rotate, wheel zoom, right-drag pan');

    async function pickVisiblePart() {
      const point = await page.evaluate(() => {
        for (const part of viewerDebug.snapshot().components) {
          const point = viewerDebug.pickPoint(part.id);
          if (point) return { ...point, id: part.id };
        }
      });
      assert(point, 'A part must be raycast-selectable');
      await page.mouse.click(point.x, point.y);
      const picked = await snapshot();
      assert.equal(picked.selected, point.id);
      assert(picked.components[point.id].highlighted);
      assert.equal(await page.locator('#selectedName').innerText(), picked.components[point.id].name);
      return point.id;
    }
    await pickVisiblePart();
    await page.locator('.component-select').nth(1).click();
    state = await snapshot();
    assert.equal(state.selected, 1);
    assert(state.components[1].highlighted);
    assert(state.components.filter(part => part.id !== 1).every(part => part.originalMaterials));
    await click('#selectedVisibility');
    assert.equal((await snapshot()).components[1].visible, false);
    assert.equal(await page.evaluate(() => viewerDebug.pickPoint(1)), null);
    await click('#selectedVisibility');
    assert.equal((await snapshot()).components[1].visible, true);
    await click('#selectedIsolate');
    assert.deepEqual((await snapshot()).components.filter(part => part.visible).map(part => part.id), [1]);
    await click('#showAll');
    assert((await snapshot()).components.every(part => part.visible));
    await page.mouse.click(box.x + 8, box.y + box.height - 8);
    assert.equal((await snapshot()).selected, null);
    console.log('PASS: raycast selection, names, highlight/restoration, hide/show/isolate/Show All, empty click');

    await click('#explode');
    state = await snapshot();
    assert.equal(state.explosionAmount, 1);
    assert(state.allBoundsFit);
    assert(state.components.every(part => part.position.some((value, i) => value !== part.originalPosition[i])));
    await pickVisiblePart();
    await page.screenshot({ path: join(output, 'exploded-selection.png'), fullPage: true });
    await click('#selectedIsolate');
    assert.equal((await snapshot()).components.filter(part => part.visible).length, 1);
    await click('#showAll');
    await page.locator('#explosion').focus();
    await page.keyboard.press('Home');
    for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight');
    assert.equal((await snapshot()).explosionAmount, 0.04);
    const slider = await page.locator('#explosion').boundingBox();
    await page.mouse.click(slider.x + slider.width * 0.6, slider.y + slider.height / 2);
    assert((await snapshot()).explosionAmount > 0.4);
    await click('#assemble');
    state = await snapshot();
    assert.equal(state.explosionAmount, 0);
    state.components.forEach(part => assert.deepEqual(part.position, part.originalPosition));
    await click('#wireframe');
    assert((await snapshot()).wireframe);
    await click('#explode');
    await click('#selectedIsolate');
    await click('#reset');
    state = await snapshot();
    assert.equal(state.currentPreset, 'ISO');
    assert.equal(state.selected, null);
    assert.equal(state.explosionAmount, 0);
    assert.equal(state.wireframe, false);
    assert(state.components.every(part => part.visible && part.originalMaterials));
    state.components.forEach(part => assert.deepEqual(part.position, part.originalPosition));
    console.log('PASS: explode, selection after explosion, visibility while exploded, slider mouse/keyboard, exact reassembly, wireframe, full reset');

    await page.locator('canvas').focus();
    const keyboardBefore = await snapshot();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('+');
    assert.notDeepEqual((await snapshot()).target, keyboardBefore.target);
    assert.notDeepEqual((await snapshot()).camera, keyboardBefore.camera);
    await click('#reset');
    await page.waitForTimeout(1400);
    const idleFrame = (await snapshot()).frameCount;
    await page.waitForTimeout(500);
    assert.equal((await snapshot()).frameCount, idleFrame);
    assert.equal(downloads.length, 1);
    await click('#themeToggle');
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    await page.screenshot({ path: join(output, 'light.png'), fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    assert((await snapshot()).allBoundsFit);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    assert((await page.locator('#viewport').boundingBox()).height >= 340);
    await page.screenshot({ path: join(output, 'mobile.png'), fullPage: true });
    await page.setViewportSize({ width: 320, height: 740 });
    await page.waitForTimeout(300);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.locator('#explode').click();
    state = await snapshot();
    assert.equal(state.explosionAmount, 1);
    assert.equal(state.animating, false);
    await page.locator('[data-view="TOP"]').click();
    assert.equal((await snapshot()).animating, false);
    assert.deepEqual(errors, []);
    console.log('PASS: keyboard pan/zoom, idle rendering pauses, one GLB download, light theme, 390/320px layouts, resize framing, reduced motion');

    // Follow the actual portfolio link and verify its target and tooltip.
    await page.setViewportSize({ width: 1440, height: 1100 });
    await page.goto(origin + '/');
    const link = page.getByRole('link', { name: '3D Viewer →' });
    assert.equal(await link.getAttribute('target'), '_blank');
    assert.equal(await link.getAttribute('rel'), 'noopener noreferrer');
    await link.focus();
    assert(await page.locator('#viewerHint').isVisible());
    const [popup] = await Promise.all([page.waitForEvent('popup'), link.click()]);
    await popup.waitForFunction(() => document.querySelector('#status')?.dataset.state === 'ready');
    assert(popup.url().endsWith('/viewer01/'));
    await popup.close();
    console.log('PASS: portfolio button, keyboard tooltip, opens working viewer in new tab');

    // Mobile touch input via Chromium's touch event pipeline.
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const touchPage = await mobile.newPage();
    await touchPage.goto(origin + '/viewer01/?debug=1');
    await touchPage.waitForFunction(() => window.viewerDebug?.snapshot().ready);
    const cdp = await mobile.newCDPSession(touchPage);
    const touchBox = await touchPage.locator('canvas').boundingBox();
    const tx = touchBox.x + touchBox.width / 2, ty = touchBox.y + touchBox.height / 2;
    const touchState = () => touchPage.evaluate(() => viewerDebug.snapshot());
    async function gesture(start, end) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: start });
      for (let step = 1; step <= 10; step++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: start.map((point, i) => ({ id: i, x: point.x + (end[i].x - point.x) * step / 10, y: point.y + (end[i].y - point.y) * step / 10 })) });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await touchPage.waitForTimeout(800);
    }
    const beforeTouch = await touchState();
    await gesture([{ id: 0, x: tx, y: ty }], [{ x: tx + 50, y: ty + 30 }]);
    assert.notDeepEqual((await touchState()).direction, beforeTouch.direction);
    const beforePinch = await touchState();
    await gesture([{ id: 0, x: tx - 35, y: ty }, { id: 1, x: tx + 35, y: ty }], [{ x: tx - 65, y: ty }, { x: tx + 65, y: ty }]);
    assert.notDeepEqual((await touchState()).camera, beforePinch.camera);
    const beforePan = await touchState();
    await gesture([{ id: 0, x: tx - 35, y: ty }, { id: 1, x: tx + 35, y: ty }], [{ x: tx - 15, y: ty + 25 }, { x: tx + 55, y: ty + 25 }]);
    assert.notDeepEqual((await touchState()).target, beforePan.target);
    console.log('PASS: emulated touch rotate, pinch zoom, two-finger pan');
    await mobile.close();

    const failure = await context.newPage();
    await failure.route('**/models/Holder_v7.glb', route => route.fulfill({ status: 404, body: 'missing' }));
    await failure.goto(origin + '/viewer01/');
    await failure.waitForFunction(() => document.querySelector('#status').dataset.state === 'error');
    assert.equal(await failure.locator('#status').innerText(), 'The 3D assembly could not be loaded.');
    assert(await failure.locator('#reset').isDisabled());
    await failure.close();
    console.log('PASS: clean missing-model failure');
    const fixturePage = await context.newPage();
    await fixturePage.goto(origin + '/viewer01/?debug=1');
    await fixturePage.waitForFunction(() => window.viewerDebug?.snapshot().ready);
    // Build an unrelated synthetic test assembly in memory. Never alter the CAD GLB.
    const fixture = await fixturePage.evaluate(async () => {
      const THREE = await import('three');
      const { GLTFExporter } = await import('three/addons/exporters/GLTFExporter.js');
      const root = new THREE.Scene();
      const transform = new THREE.Group();
      transform.name = 'Synthetic assembly';
      transform.position.set(10, -3, 4);
      transform.rotation.set(0.2, 0.4, -0.3);
      transform.scale.set(2, 0.5, 1.5);
      root.add(transform);
      const materials = [0xcccccc, 0x999999, 0x777777, 0xcccccc, 0x999999, 0x777777].map(color => new THREE.MeshStandardMaterial({ color }));
      const center = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), materials);
      center.name = 'Fixture center';
      center.rotation.set(0, 0.2, 0.1);
      center.scale.set(0.8, 1.2, 0.6);
      transform.add(center);
      for (const sign of [-1, 1]) {
        const wrapper = new THREE.Group();
        wrapper.position.set(sign * 1.5, sign * 0.5, 0);
        center.add(wrapper);
        const child = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), materials[0]);
        child.name = sign < 0 ? 'Fixture left' : 'Fixture right';
        wrapper.add(child);
      }
      return Array.from(new Uint8Array(await new GLTFExporter().parseAsync(root, { binary: true })));
    });
    await fixturePage.route('**/models/Holder_v7.glb', route => route.fulfill({ contentType: 'model/gltf-binary', body: Buffer.from(fixture) }));
    await fixturePage.reload();
    await fixturePage.waitForFunction(() => window.viewerDebug?.snapshot().ready);
    let fixtureState = await fixturePage.evaluate(() => viewerDebug.snapshot());
    assert.equal(fixtureState.components.length, 3, 'Six material primitives must remain one component');
    assert(fixtureState.allBoundsFit);
    await fixturePage.locator('#explode').click();
    await fixturePage.waitForFunction(() => !viewerDebug.snapshot().animating);
    fixtureState = await fixturePage.evaluate(() => viewerDebug.snapshot());
    assert(fixtureState.allBoundsFit);
    fixtureState.components.forEach(part => {
      assert(part.worldPosition.every((value, i) => Number.isFinite(value) && Math.abs(value - part.expectedWorldPosition[i]) < 1e-8));
      assert(part.position.some((value, i) => Math.abs(value - part.originalPosition[i]) > 1e-8));
    });
    await fixturePage.locator('.component-isolate').nth(1).click();
    const childPoint = await fixturePage.evaluate(() => viewerDebug.pickPoint(1));
    assert(childPoint, 'A child remains raycast-visible when the parent component is hidden');
    await fixturePage.mouse.click(childPoint.x, childPoint.y);
    assert.equal((await fixturePage.evaluate(() => viewerDebug.snapshot())).selected, 1);
    await fixturePage.locator('#reset').click();
    await fixturePage.waitForFunction(() => !viewerDebug.snapshot().animating);
    fixtureState = await fixturePage.evaluate(() => viewerDebug.snapshot());
    fixtureState.components.forEach(part => assert.deepEqual(part.position, part.originalPosition));
    await fixturePage.close();
    console.log('PASS: replacement fixture with nested rotations/scales, grouped material primitives, centered-part fallback, child isolation, exact reset');
    assert.equal(await digest(), beforeHash);
    console.log('PASS: model SHA256 unchanged:', beforeHash);
  } finally {
    await browser.close();
    server.close();
  }
}
