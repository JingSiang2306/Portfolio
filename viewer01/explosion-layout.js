// Straight-axis translations in assembly-radius units. Named CAD subassemblies
// move as rigid groups, including all their internal chips, connectors and screws.
export const EXPLOSION_LAYOUT = [
  { name: 'Outer shell', members: ['Outer Case', 'Cable Gland'], offset: [0, 0, -1.7] },
  { name: 'Left vent', members: ['Vent 01'], offset: [-0.85, 0, 0] },
  { name: 'Right vent', members: ['Vent 02'], offset: [1.1, 0, 0] },
  { name: 'Case frame', members: ['Case Connector'], offset: [0, 0, -0.85] },
  { name: 'Holder', members: ['Holder'], offset: [0, 0, 0] },
  { name: 'Gasket', members: ['Gasket'], offset: [0, 0, 0.95] },
  { name: 'Cover', members: ['Case Cover'], offset: [0, 0, 2.05] },
  { name: 'Front modules', members: ['Mic', 'Audio Jack', 'Mic Hood', 'Camera V2', 'Camera V3', 'IR Board', 'Solar Charger'], offset: [0, 0, 0.55] },
  { name: 'Battery', members: ['Battery'], offset: [0, -0.75, 0] },
  { name: 'Controller', members: ['Pi 5', 'DC Converter'], offset: [0, 0.55, 0] },
  { name: 'Pi spacers', members: ['Spacer 01', 'Spacer 02', 'Spacer 03', 'Spacer 04'], offset: [0, 0.275, 0] },
  { name: 'Cooler', members: ['Pi Cooler'], offset: [0, 0.85, 0] },
  { name: 'SSD HAT', members: ['SSD HAT'], offset: [0, 1.15, 0] },
  { name: 'Case fan', members: ['Case Fan Assembly'], offset: [0.55, 0, 0] }
];
