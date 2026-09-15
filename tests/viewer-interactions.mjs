import assert from 'node:assert/strict';

// Shared browser regressions for both static assembly viewers.
export async function verifyViewerInteractions(page, project) {
  const snapshot = () => page.evaluate(() => viewerDebug.snapshot());
  const settle = () => page.waitForFunction(() => !viewerDebug.snapshot().animating);
  const click = async selector => { await page.locator(selector).click(); await settle(); };
  const sameCamera = (before, after) => {
    for (const key of ['camera', 'target', 'up']) {
      assert(after[key].every((value, i) => Math.abs(value - before[key][i]) < 1e-10), `${key} stays fixed`);
    }
  };
  await click('#reset');
  const assembled = await snapshot();
  await click('#explode');
  assert.notDeepEqual((await snapshot()).camera, assembled.camera, 'Explode button still frames the assembly');
  // Inspect every listed part, including long source labels that resize the sidebar.
  const exploded = await snapshot();
  for (const part of exploded.components.filter(part => part.listed)) {
    await click(`[data-component="${part.id}"] .component-select`);
    await page.waitForTimeout(40);
    sameCamera(exploded, await snapshot());
  }
  const id = (await snapshot()).selected;
  const circle = `[data-component="${id}"] .component-isolate`;
  for (const [enter, exit] of [['#selectedIsolate', '#selectedIsolate'], [circle, circle], [circle, '#selectedIsolate'], ['#selectedIsolate', circle]]) {
    await click(enter);
    assert.deepEqual((await snapshot()).components.filter(part => part.visible).map(part => part.id), [id]);
    assert.equal(await page.locator(circle).getAttribute('aria-pressed'), 'true');
    assert.equal(await page.locator('#selectedIsolate').getAttribute('aria-pressed'), 'true');
    await click(exit);
    assert((await snapshot()).components.every(part => part.visible));
    assert.equal(await page.locator(circle).getAttribute('aria-pressed'), 'false');
    sameCamera(exploded, await snapshot());
  }
  // Keep a manually zoomed and panned view while using mouse and keyboard input.
  await page.locator('canvas').focus();
  await page.keyboard.press('+');
  await page.keyboard.press('ArrowRight');
  const manual = await snapshot();
  await page.locator('#explosion').focus();
  for (const key of ['Home', 'ArrowRight', 'End', 'ArrowLeft']) {
    await page.keyboard.press(key);
    sameCamera(manual, await snapshot());
  }
  const slider = await page.locator('#explosion').boundingBox();
  await page.mouse.click(slider.x + slider.width * 0.45, slider.y + slider.height / 2);
  sameCamera(manual, await snapshot());
  await click('#assemble');
  assert.notDeepEqual((await snapshot()).camera, manual.camera, 'Assemble button still frames the assembly');
  // Slider input also stops a camera transition already started by a button.
  const takeover = await page.evaluate(() => {
    document.querySelector('#explode').click();
    const before = viewerDebug.snapshot();
    const slider = document.querySelector('#explosion');
    slider.value = '50';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    return before;
  });
  await settle();
  sameCamera(takeover, await snapshot());
  await click('#explode');
  const state = await snapshot();
  const part = name => {
    const found = state.components.find(part => part.name === name);
    assert(found, name);
    return found;
  };
  const edge = (name, side, axis) => part(name).bounds[side][axis] + part(name).offset[axis];
  if (project === '01') {
    const spacers = state.components.filter(part => /^Spacer /.test(part.name));
    assert.equal(spacers.length, 4);
    for (const spacer of spacers) {
      assert.deepEqual(spacer.offset, spacers[0].offset);
      assert.equal(spacer.offset[0], 0);
      assert.equal(spacer.offset[2], 0);
      assert(edge(spacer.name, 'min', 1) > edge('Holder', 'max', 1));
      assert(edge(spacer.name, 'max', 1) < edge('Pi 5', 'min', 1));
    }
    assert(edge('Vent 01', 'max', 0) < edge('Holder', 'min', 0));
    assert(edge('Vent 02', 'min', 0) > edge('Case Fan', 'max', 0));
    for (const name of ['Vent 01', 'Vent 02']) assert.deepEqual(part(name).offset.slice(1), [0, 0]);
    for (const name of ['Camera V3', 'Solar Charger', 'Pi 5', 'SSD HAT', 'Pi Cooler', 'Case Fan']) {
      const module = part(name);
      assert(module.meshCount > 1, `${name} owns all its meshes`);
      await click(`[data-component="${module.id}"] .component-select`);
      assert((await snapshot()).components[module.id].highlighted, `${name} highlights every mesh`);
      await click('#selectedIsolate');
      const point = await page.evaluate(id => viewerDebug.pickPoint(id), module.id);
      assert(point, `${name} remains raycast-selectable as a whole`);
      await page.mouse.click(point.x, point.y);
      assert.equal((await snapshot()).selected, module.id);
      await click('#selectedIsolate');
    }
  } else {
    assert.deepEqual(part('Screw 10').offset, part('Top Holder').offset);
    for (const name of ['Screw 06', 'Screw 08', 'Screw 09', 'Screw 10']) {
      assert.deepEqual(part(name).offset, part('Top Holder').offset);
    }
    assert(part('Battery').offset[1] < part('Battery Holder').offset[1]);
    assert(edge('Battery', 'max', 1) < edge('Battery Holder', 'min', 1), 'Battery clears its holder');
    const order = await page.locator('#componentTree details').evaluateAll(groups => {
      const device = groups.find(group => group.querySelector(':scope > summary')?.textContent === 'Device');
      return [...device.querySelector(':scope > ul').children].map(item => item.querySelector('summary, .component-select').textContent);
    });
    assert.deepEqual(order, ['Pipe', 'Top Assembly', 'Bottom Assembly', 'Lower Clamp', 'Upper Clamp']);
  }
  await click('#reset');
  console.log(`PASS: Project ${project} isolate toggles, stationary slider/selection camera, button framing, component layout`);
}
