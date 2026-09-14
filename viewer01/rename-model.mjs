// Development-only, idempotent metadata rename for the inspected Holder_v7 export.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const path = new URL('./models/Holder_v7.glb', import.meta.url);
const bytes = await readFile(path);
assert.equal(bytes.readUInt32LE(0), 0x46546c67);
assert.equal(bytes.readUInt32LE(4), 2);
assert.equal(bytes.readUInt32LE(8), bytes.length);
assert.equal(bytes.readUInt32LE(16), 0x4e4f534a);
const jsonLength = bytes.readUInt32LE(12);
const model = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString());
assert.equal(model.asset.generator, 'SOLIDWORKSGLTF');
assert.equal(model.nodes.length, 182, 'Reinspect a replacement export before renaming.');
assert.equal(model.meshes.length, 162);
const sourceNames = model.nodes.map(node => node.extras?.originalName || node.name).join('\n');
assert.equal(createHash('sha256').update(sourceNames).digest('hex'),
  'dfe0ef3922559b2ce5adf7b7749a45bfb0245cc584371d6ee1e96c95c209c2dd',
  'Source node identities/order changed. Reinspect this export before renaming.');
const before = structuredClone(model);
const names = {
  0: 'CAD Camera', 1: 'Device', 3: 'Mic', 4: 'Camera V2', 7: 'Audio Jack', 8: 'IR Board',
  9: 'Camera V3', 10: 'Cam V3 Assembly', 11: 'Cam Part 01', 12: 'Cam Module', 13: 'Cam Rear',
  14: 'Cam Rear 01', 15: 'Cam Rear 02', 16: 'Cam FFC Socket', 17: 'Cam Rear 03', 18: 'Cam Rear 04', 19: 'Cam Rear 05',
  20: 'Cam PCB', 21: 'IMX708', 22: 'Cam Housing', 23: 'Cam Sensor', 24: 'Cam Lens', 25: 'Cam Ring', 26: 'Cam Mount',
  27: 'Battery', 28: 'DC Converter', 29: 'Solar Charger', 30: 'Charger Assembly',
  34: 'Charger Back', 36: 'Charger PCB', 37: 'Charger Case',
  68: 'Case Connector', 69: 'Gasket', 71: 'Holder', 72: 'Case Cover', 73: 'Cable Gland', 77: 'Outer Case', 78: 'Mic Hood',
  79: 'Case Fan Assembly', 80: 'Fan Nut', 81: 'Case Fan', 82: 'Vent 01', 83: 'Pi 5',
  84: 'Pi PCB', 85: 'Pi Shield', 86: 'Ethernet Port', 87: 'USB 3 Ports', 88: 'USB 2 Ports',
  89: 'HDMI 01', 90: 'Pi Part 01', 91: 'Pi Part 02', 92: 'Pi Header 01', 93: 'Pi Header 02',
  94: 'Pi Part 03', 95: 'HDMI 02', 96: 'Broadcom IC', 97: 'USB Socket', 98: 'Pi Connector', 99: 'D9WHV IC',
  100: 'Cam Display 01', 101: 'MxL IC', 102: 'Cam Display 02', 103: 'RP1 IC', 104: 'SD Assembly',
  105: 'SD Card', 106: 'SD Contacts', 107: 'SD Part 01', 108: 'Ethernet IC', 109: 'Pi Button 01',
  110: 'Pi Button 02', 111: 'Cam Display 03', 112: 'Case Nut',
  113: 'SSD HAT', 114: 'HAT Assembly', 115: 'HAT Board', 116: 'M2 Socket', 117: 'HAT PCB',
  118: 'PCIe Socket', 119: 'HAT ICs', 120: 'NVMe SSD',
  163: 'Pi Cooler', 164: 'Spring Bolt 01', 165: 'Spring 01', 166: 'Bolt 01', 167: 'Heatsink',
  168: 'Cooler Fan', 169: 'Fan Rotor', 170: 'Fan Motor', 171: 'Fan Cover',
  172: 'Spring Bolt 02', 173: 'Spring 02', 174: 'Bolt 02', 181: 'Vent 02'
};
for (let i = 121; i <= 162; i++) names[i] = `HAT Part ${String(i - 120).padStart(2, '0')}`;
const counts = {};
const mapping = model.nodes.map((node, index) => {
  const originalName = node.extras?.originalName || node.name;
  let name = names[index];
  if (!name) {
    const family = /^pan head/.test(originalName) ? 'Screw'
      : /^hexagonal_spacer/.test(originalName) ? 'Spacer'
        : /^plain washer/.test(originalName) ? 'Washer'
          : /EPRC10-ST screw/.test(originalName) ? 'Charger Screw' : null;
    assert(family, `Unmapped node ${index}: ${originalName}`);
    counts[family] = (counts[family] || 0) + 1;
    name = `${family} ${String(counts[family]).padStart(2, '0')}`;
  }
  node.name = name;
  node.extras = { ...node.extras, originalName };
  return { node: index, name, originalName, ...(node.mesh === undefined ? {} : { mesh: node.mesh }) };
});
assert.equal(new Set(mapping.map(entry => entry.name)).size, mapping.length);
assert(mapping.every(entry => entry.name.length <= 22));
model.meshes.forEach((mesh, index) => { mesh.name = mapping.find(entry => entry.mesh === index).name; });
model.scenes[0].name = 'Device Scene';
model.cameras[0].name = 'CAD Camera';
// Prove JSON changes affect names only, plus the original-name audit metadata.
const nonNames = value => {
  const copy = structuredClone(value);
  for (const list of [copy.nodes, copy.meshes, copy.scenes, copy.cameras]) {
    list?.forEach(item => {
      delete item.name;
      if (item.extras) {
        delete item.extras.originalName;
        if (!Object.keys(item.extras).length) delete item.extras;
      }
    });
  }
  return copy;
};
assert.deepEqual(nonNames(model), nonNames(before));
const json = Buffer.from(JSON.stringify(model));
const padded = Buffer.alloc(Math.ceil(json.length / 4) * 4, 0x20);
json.copy(padded);
const tail = bytes.subarray(20 + jsonLength);
const header = Buffer.from(bytes.subarray(0, 20));
header.writeUInt32LE(20 + padded.length + tail.length, 8);
header.writeUInt32LE(padded.length, 12);
const renamed = Buffer.concat([header, padded, tail]);
assert(renamed.subarray(20 + padded.length).equals(tail));
await writeFile(path, renamed);
await writeFile(new URL('./models/component-names.json', import.meta.url), JSON.stringify(mapping, null, 2) + '\n');
console.log(`Renamed ${mapping.length} nodes, ${model.meshes.length} meshes; ${mapping.filter(entry => entry.mesh !== undefined).length} selectable parts.`);
console.log('Geometry/binary chunk SHA256:', createHash('sha256').update(tail).digest('hex'));
