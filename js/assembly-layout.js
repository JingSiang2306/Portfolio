import * as THREE from 'three';

// Hide hardware rows only; these meshes remain visible and selectable in the view.
export function isHardware(part) {
  return /\b(screw|bolt|nut|washer|spacer|spring)\b/i.test(part.name.replaceAll('_', ' '));
}

export function arrangeExplosion(components, definitions, radius) {
  const match = part => {
    const names = [part.name];
    for (let node = part.node; node; node = node.parent) {
      names.push(node.userData.sourceName, node.userData.componentLabel);
    }
    return definitions.find(group => group.members.some(name => names.includes(name)));
  };
  const mainParts = components.filter(part => !part.hardware);
  const fallback = [...mainParts].sort((a, b) => a.bounds.min.y - b.bounds.min.y || a.id - b.id);
  mainParts.forEach(part => {
    const group = match(part);
    part.explosionGroup = group?.name || `Part ${part.id}`;
    // Unknown exports use ordered vertical layers, never spherical scattering.
    part.offset.fromArray(group?.offset || [0, (fallback.indexOf(part) - (fallback.length - 1) / 2) * 0.6, 0]).multiplyScalar(radius);
  });
  components.filter(part => part.hardware).forEach(part => {
    const group = match(part);
    if (group) {
      part.explosionGroup = group.name;
      part.offset.fromArray(group.offset).multiplyScalar(radius);
      return;
    }
    // Loose hardware follows the nearest main part's translation. Box distance
    // finds nearby mounting surfaces; center distance breaks ties consistently.
    const center = part.bounds.getCenter(new THREE.Vector3());
    let nearest, distance = Infinity;
    mainParts.forEach(candidate => {
      const score = candidate.bounds.distanceToPoint(center)
        + candidate.bounds.getCenter(new THREE.Vector3()).distanceTo(center) * 0.05;
      if (score < distance) { nearest = candidate; distance = score; }
    });
    part.explosionGroup = nearest?.explosionGroup || 'Hardware';
    part.offset.copy(nearest?.offset || new THREE.Vector3());
  });
}
