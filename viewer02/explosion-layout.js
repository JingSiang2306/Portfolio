// The pipe is the anchor. Open the device in ordered vertical layers; keep the
// battery, breadboard, switch and their holders together as an electronics tray.
// Distances are in assembly-radius units and scale with the model.
export const EXPLOSION_LAYOUT = [
  { name: 'Pipe', members: ['Pipe'], offset: [0, 0, 0] },
  { name: 'Lower clamp', members: ['Lower Clamp'], offset: [0, -0.45, 0] },
  { name: 'Upper clamp', members: ['Upper Clamp'], offset: [0, 0.4, 0] },
  { name: 'Base', members: ['Bottom Holder'], offset: [0, 0.85, 0] },
  { name: 'Controller', members: ['STM32U5 Board'], offset: [0, 1.2, 0] },
  { name: 'Electronics tray', members: ['Breadboard', 'SPC Holder', 'Battery Holder', 'SPC1520', 'Slide Switch', 'Battery'], offset: [0, 1.65, 0] },
  { name: 'Lid', members: ['Top Holder'], offset: [0, 2.25, 0] }
];
