/* DOM adapter for jeremy-prt/bloub's MIT-licensed animation engine. */
(() => {
  const host = document.getElementById('chatAvatar');
  const launcher = document.getElementById('chatLauncher');
  if (!host || !launcher || !window.Bloub?.BotEngine) return;

  const ns = 'http://www.w3.org/2000/svg';
  const engine = new window.Bloub.BotEngine(100, 'idle');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 480px)');
  let clock = 0;
  let last = null;
  let raf = null;
  let thinking = false;
  let open = false;
  let greetingUntil = 0;

  function element(tag, attrs, parent) {
    const node = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
    parent?.appendChild(node);
    return node;
  }
  const svg = element('svg', { viewBox: '-130 -130 260 260', 'aria-hidden': 'true', focusable: 'false' });
  const defs = element('defs', {}, svg);
  const mask = element('mask', { id: 'chat-bloub-eyes', maskUnits: 'userSpaceOnUse', x: -130, y: -130, width: 260, height: 260 }, defs);
  const maskBody = element('path', { fill: '#fff' }, mask);
  const eyes = [0, 1].map(() => element('path', { fill: '#000' }, mask));
  const body = element('g', {}, svg);
  const paper = element('path', { fill: '#f9f9f9' }, body);
  const masked = element('g', { mask: 'url(#chat-bloub-eyes)' }, body);
  element('rect', { x: -130, y: -130, width: 260, height: 260, fill: '#0a0a0c' }, masked);
  const dots = element('g', { fill: '#0a0a0c' }, svg);

  // Only idle, wink and thinking are used; these states have no orbit decorations.
  function render(time) {
    const frame = engine.sample(time);
    maskBody.setAttribute('d', frame.bodyPath);
    paper.setAttribute('d', frame.bodyPath);
    body.setAttribute('opacity', frame.bodyAlpha);
    frame.eyes.forEach((eye, index) => {
      eyes[index].setAttribute('d', eye.d);
      eyes[index].setAttribute('transform', eye.matrix);
      eyes[index].setAttribute('opacity', eye.alpha);
    });
    while (dots.children.length > frame.dots.length) dots.lastElementChild.remove();
    frame.dots.forEach((dot, index) => {
      const node = dots.children[index] || element('circle', {}, dots);
      for (const [key, value] of Object.entries({ cx: dot.x, cy: dot.y, r: dot.r, opacity: dot.opacity })) node.setAttribute(key, value);
    });
  }
  function desiredState() {
    return thinking ? 'thinking' : clock < greetingUntil ? 'wink' : 'idle';
  }
  function syncState() {
    const state = desiredState();
    host.dataset.state = state;
    if (reduced.matches) {
      engine.reset(state, clock);
      render(clock + 0.8);
    } else engine.setState(state, clock);
  }
  function visible() {
    return !document.hidden && !(mobile.matches && open);
  }
  function tick(timestamp) {
    raf = null;
    if (!visible() || reduced.matches) return;
    // Cap both frame rate and elapsed time after a suspended tab.
    if (last === null || timestamp - last >= 1000 / 30) {
      clock += last === null ? 0 : Math.min((timestamp - last) / 1000, 0.064);
      last = timestamp;
      syncState();
      render(clock);
    }
    raf = requestAnimationFrame(tick);
  }
  function resume() {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
    last = null;
    syncState();
    if (visible() && !reduced.matches) raf = requestAnimationFrame(tick);
  }
  function greet() {
    if (thinking || reduced.matches) return;
    greetingUntil = clock + 1.3;
    syncState();
  }
  window.portfolioAvatar = {
    setThinking(value) {
      if (thinking === value) return;
      thinking = value;
      greetingUntil = value || reduced.matches ? 0 : clock + 1.3;
      syncState();
    },
    setOpen(value) {
      open = value;
      resume();
      if (open) greet();
    }
  };
  launcher.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') greet(); });
  launcher.addEventListener('focus', greet);
  document.addEventListener('visibilitychange', resume);
  reduced.addEventListener('change', () => { greetingUntil = 0; resume(); });
  mobile.addEventListener('change', resume);
  window.addEventListener('pagehide', () => { if (raf !== null) cancelAnimationFrame(raf); raf = null; });
  window.addEventListener('pageshow', resume);
  render(0);
  host.replaceChildren(svg);
  resume();
})();
