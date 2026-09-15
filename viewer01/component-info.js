// Keys are short GLB node names. Original CAD names remain in the inspector and
// models/component-names.json. Optional displayName overrides work for any part.
export const COMPONENT_INFO = {
  'Camera V3': { rigid: true, description: 'Complete Camera V3 module with Sony IMX708 sensor.' },
  'Solar Charger': { rigid: true, description: 'Complete solar charger module.' },
  'Pi 5': { rigid: true, description: 'Complete Raspberry Pi 5 board.' },
  'SSD HAT': { rigid: true, description: 'Complete PCIe HAT with NVMe SSD.' },
  'Pi Cooler': { rigid: true, description: 'Complete Raspberry Pi 5 cooler.' },
  'Case Fan Assembly': { rigid: true, displayName: 'Case Fan', description: 'Complete EF80251S1 case cooling fan.' },
  Mic: { description: 'BY-MM1 microphone.' },
  'Camera V2': { description: 'Camera V2.1 module.' },
  'IR Board': { description: 'Infrared board.' },
  Battery: { description: '18 Ah battery.' },
  'DC Converter': { description: 'XL4015 DC converter module.' },
  'Case Fan': { description: 'EF80251S1 case cooling fan.' },
  'Pi PCB': { description: 'Raspberry Pi 5 circuit board.' },
  'Cam Sensor': { description: 'Sony IMX708 image sensor.' },
  'NVMe SSD': { description: '2242 NVMe solid-state drive on the PCIe HAT.' },
  Heatsink: { description: 'Raspberry Pi 5 cooler heatsink.' }
};
