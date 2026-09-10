/* DOM adapter for jeremy-prt/bloub's MIT-licensed animation engine. */
(() => {
  const host = document.getElementById('chatAvatar');
  if (!host || !window.Bloub?.EXPRESSION_BY_ID) return;

  const { BotEngine, EXPRESSION_BY_ID } = window.Bloub;
  const neutral = EXPRESSION_BY_ID.get('neutre');
  const engine = new BotEngine(100, 'idle', null, neutral);
  const stillEngine = new BotEngine(100, 'idle', null, neutral);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 480px)');
  const ns = 'http://www.w3.org/2000/svg';
  const expressions = ['neutre', 'curieux', 'heureux', 'somnolent'];
  const names = { neutre: 'neutral', curieux: 'curious', heureux: 'happy', somnolent: 'sleepy' };
  const loops = { comet: 2.4, orbit: 3.4, alert: 2.4 };
  let mode = 'idle';
  let open = false;
  let pending = false;
  let retrying = false;
  let clock = 0;
  let stateAt = 0;
  let nextExpression = 5;
  let expression = 'neutre';
  let last = null;
  let raf = null;
  let burstTimer = null;

  function attrs(node, values) {
    for (const [key, value] of Object.entries(values)) node.setAttribute(key, value);
  }
  function element(tag, values, parent) {
    const node = document.createElementNS(ns, tag);
    attrs(node, values);
    parent?.appendChild(node);
    return node;
  }
  const box = { x: -158, y: -158, width: 316, height: 316 };
  const svg = element('svg', { viewBox: '-158 -158 316 316', 'aria-hidden': 'true', focusable: 'false' });
  const defs = element('defs', {}, svg);
  const mask = element('mask', { id: 'chat-bloub-eyes', maskUnits: 'userSpaceOnUse', ...box }, defs);
  const maskBody = element('path', { fill: '#fff' }, mask);
  const eyeGroup = element('g', { fill: '#000' }, mask);
  // Occlude rear decorations behind the whole body, including its eye holes.
  // Eyes stay transparent without adding an opaque background circle.
  const rearMask = element('mask', { id: 'chat-bloub-rear', maskUnits: 'userSpaceOnUse', ...box }, defs);
  element('rect', { ...box, fill: '#fff' }, rearMask);
  const rearBody = element('path', { fill: '#000' }, rearMask);
  const rear = element('g', { mask: 'url(#chat-bloub-rear)' }, svg);
  const rearArcs = element('g', { fill: 'none', 'stroke-linecap': 'round' }, rear);
  const rearDots = element('g', {}, rear);
  const body = element('g', { mask: 'url(#chat-bloub-eyes)' }, svg);
  element('rect', { ...box, fill: 'currentColor' }, body);
  const frontDots = element('g', {}, svg);
  const frontArcs = element('g', { fill: 'none', 'stroke-linecap': 'round' }, svg);
  const gradients = new Map();

  function renderDots(group, dots) {
    while (group.children.length > dots.length) group.lastElementChild.remove();
    dots.forEach((dot, index) => {
      const tag = dot.d ? 'path' : 'circle';
      let node = group.children[index];
      if (node?.localName !== tag) {
        const replacement = element(tag, {});
        if (node) node.replaceWith(replacement);
        else group.appendChild(replacement);
        node = replacement;
      }
      attrs(node, {
        fill: dot.color ?? 'currentColor',
        opacity: dot.opacity * (dot.depth ?? 1),
        ...(dot.d ? { d: dot.d, transform: `translate(${dot.x} ${dot.y}) rotate(${dot.rot ?? 0}) scale(100)` }
          : { cx: dot.x, cy: dot.y, r: dot.r })
      });
    });
  }
  function renderArcs(group, arcs, side) {
    while (group.children.length > arcs.length) group.lastElementChild.remove();
    arcs.forEach((arc, index) => {
      const node = group.children[index] || element('path', {}, group);
      attrs(node, { d: arc[side], stroke: `url(#chat-bloub-${arc.id})`, 'stroke-width': arc.width, opacity: arc.opacity });
    });
  }
  function render(frame) {
    attrs(maskBody, { d: frame.bodyPath });
    attrs(rearBody, { d: frame.bodyPath, opacity: frame.bodyAlpha });
    attrs(body, { opacity: frame.bodyAlpha });
    while (eyeGroup.children.length > frame.eyes.length) eyeGroup.lastElementChild.remove();
    frame.eyes.forEach((eye, index) => {
      const node = eyeGroup.children[index] || element('path', {}, eyeGroup);
      attrs(node, { d: eye.d, transform: eye.matrix, opacity: eye.alpha });
    });
    const active = new Set(frame.arcs.map(arc => arc.id));
    for (const [id, node] of gradients) {
      if (!active.has(id)) { node.remove(); gradients.delete(id); }
    }
    frame.arcs.forEach(arc => {
      let gradient = gradients.get(arc.id);
      if (!gradient) {
        gradient = element('linearGradient', { id: `chat-bloub-${arc.id}`, gradientUnits: 'userSpaceOnUse' }, defs);
        gradients.set(arc.id, gradient);
      }
      const { stops, ...coordinates } = arc.grad;
      attrs(gradient, coordinates);
      while (gradient.children.length > stops.length) gradient.lastElementChild.remove();
      stops.forEach((color, index) => attrs(gradient.children[index] || element('stop', {}, gradient), {
        offset: index / Math.max(1, stops.length - 1), 'stop-color': color
      }));
    });
    renderArcs(rearArcs, frame.arcs, 'back');
    renderDots(rearDots, frame.dotsBehind ? frame.dots : []);
    renderDots(frontDots, frame.dotsBehind ? [] : frame.dots);
    renderArcs(frontArcs, frame.arcs, 'front');
  }
  function displayedMode() {
    return !open && mode !== 'idle' ? 'neutral' : mode;
  }
  function paint() {
    const state = displayedMode();
    host.dataset.state = state;
    host.dataset.expression = state === 'idle' ? names[expression] : 'neutral';
    if (state === 'neutral') {
      render(stillEngine.sample(0));
    } else if (reduced.matches) {
      // A readable still, without blinking, random changes or looping motion.
      stillEngine.reset(state === 'idle' ? 'idle' : state, 0);
      render(stillEngine.sample(0.9));
      stillEngine.reset('idle', 0);
    } else render(engine.sample(clock));
  }
  function setMode(value, immediate = false) {
    mode = value;
    stateAt = clock;
    const state = value === 'neutral' ? 'idle' : value;
    engine.setExpression(neutral, clock);
    expression = 'neutre';
    if (immediate) engine.reset(state, clock);
    else engine.setState(state, clock);
    resume();
  }
  function animated() {
    return !document.hidden && !(mobile.matches && open) && !reduced.matches && displayedMode() !== 'neutral';
  }
  function tick(timestamp) {
    raf = null;
    if (!animated()) return;
    if (last === null || timestamp - last >= 1000 / 30) {
      clock += last === null ? 0 : Math.min((timestamp - last) / 1000, 0.064);
      last = timestamp;
      if (mode === 'idle' && clock >= nextExpression) {
        const choices = expressions.filter(id => id !== expression);
        expression = choices[Math.floor(Math.random() * choices.length)];
        engine.setExpression(EXPRESSION_BY_ID.get(expression), clock);
        nextExpression = clock + 5;
      }
      if (loops[mode] && clock - stateAt >= loops[mode]) {
        // Upstream clips have finite durations; restart so trails never expire.
        stateAt = clock;
        engine.reset(mode, clock);
      }
      paint();
    }
    raf = requestAnimationFrame(tick);
  }
  function resume() {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
    last = null;
    paint();
    if (animated()) raf = requestAnimationFrame(tick);
  }
  function cancelBurst() {
    clearTimeout(burstTimer);
    burstTimer = null;
  }
  window.portfolioAvatar = {
    requestStarted({ first, retry }) {
      cancelBurst();
      pending = true;
      retrying = retry || retrying;
      setMode(retrying ? 'alert' : first ? 'burst' : 'comet');
      if (mode === 'burst') burstTimer = setTimeout(() => {
        burstTimer = null;
        if (pending && mode === 'burst') setMode('comet');
      }, 1000);
    },
    requestSucceeded() {
      cancelBurst();
      pending = false;
      retrying = false;
      setMode(open ? 'orbit' : 'neutral');
    },
    requestFailed(canRetry) {
      cancelBurst();
      pending = false;
      retrying = canRetry;
      setMode(canRetry ? 'alert' : 'neutral');
    },
    setOpen(value) {
      open = value;
      if (pending || retrying) resume();
      else setMode('neutral', true);
    },
    reset(initial = false) {
      cancelBurst();
      pending = false;
      retrying = false;
      nextExpression = clock + 5;
      setMode(initial ? 'idle' : 'neutral', true);
    }
  };
  document.addEventListener('visibilitychange', resume);
  reduced.addEventListener('change', resume);
  mobile.addEventListener('change', resume);
  window.addEventListener('pagehide', () => { if (raf !== null) cancelAnimationFrame(raf); raf = null; });
  window.addEventListener('pageshow', resume);
  host.replaceChildren(svg);
  resume();
})();
