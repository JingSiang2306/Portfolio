
// Follow the section being read, including direct links and a short final section.
(() => {
  const links = [...document.querySelectorAll('#navlinks a[href^="#"]')];
  const sections = links.map(link => document.getElementById(link.hash.slice(1)));
  const header = document.querySelector('header');
  let frame = null;
  let current = null;
  function updateSection() {
    frame = null;
    const readingLine = Math.max((header?.getBoundingClientRect().bottom || 68) + 24,
      Math.min(180, window.innerHeight * .25));
    let selected = -1;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= readingLine) selected = index;
    });
    const page = document.scrollingElement || document.documentElement;
    if (page.scrollHeight > window.innerHeight &&
        page.scrollTop + window.innerHeight >= page.scrollHeight - 4) selected = links.length - 1;
    if (selected === current) return;
    current = selected;
    links.forEach((link, index) => {
      if (index === selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleUpdate() {
    if (frame === null) frame = requestAnimationFrame(updateSection);
  }
  window.addEventListener('scroll', scheduleUpdate, { passive:true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('load', scheduleUpdate);
  window.addEventListener('hashchange', scheduleUpdate);
  window.addEventListener('pageshow', scheduleUpdate);
  document.addEventListener('portfolio:gallery-change', scheduleUpdate);
  if (typeof ResizeObserver === 'function') {
    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.getElementById('mainContent'));
    resizeObserver.observe(document.getElementById('contact'));
  }
  updateSection();
})();

// Reveal once per page load. No persistent hidden styles or scroll listeners.
(() => {
  'use strict';
  const markSeen = target => { if (target.matches('.t-item')) target.classList.add('is-seen'); };
  if (typeof window.IntersectionObserver !== 'function' || !portfolioMotion.allowed()) {
    document.querySelectorAll('.t-item').forEach(markSeen);
    return;
  }
  const motionPreference = portfolioMotion.preference;

  const targets = Array.from(document.querySelectorAll([
    '.hero-inner > .eyebrow', '.hero-inner > h1', '.hero-inner > .role',
    '.hero-inner > .summary', '.hero-inner > .cta-row', '.hero-inner > .hero-meta',
    '.sec-head', '.about-grid > div', '.project-card', '.t-item',
    '.edu-card', '.contact-inner', '.fine-print'
  ].join(',')));
  const pending = new Set(targets);
  const delays = new Map();
  let observer;
  let stopped = false;

  // Small stagger for the introduction and adjacent cards; no long waits.
  document.querySelectorAll('.hero-inner, .about-grid, .edu-grid').forEach(group => {
    Array.from(group.children).filter(child => pending.has(child)).forEach((child, index) => {
      delays.set(child, Math.min(index * 50, 250));
    });
  });

  function stopMotion() {
    stopped = true;
    observer?.disconnect();
    pending.clear();
    targets.forEach(markSeen);
    portfolioMotion.cancelAll();
  }

  function reveal(target) {
    if (stopped || !pending.delete(target)) return;
    observer.unobserve(target);
    markSeen(target);
    // A keyboard user should never wait for a focused control to appear.
    if (target.contains(document.activeElement) || motionPreference.matches) return;
    portfolioMotion.animate(target, [
        { opacity:0, transform:'translateY(18px)' },
        { opacity:1, transform:'translateY(0)' }
      ], {
        duration:560,
        delay:delays.get(target) || 0,
        easing:'cubic-bezier(.22, 1, .36, 1)',
        fill:'backwards'
    });
    // Draw the divider as its heading enters; the line remains full length afterwards.
    const line = target.matches('.sec-head') ? target.querySelector('.sec-line') : null;
    if (line) portfolioMotion.animate(line,
      [{ transform:'scaleX(0)' }, { transform:'scaleX(1)' }],
      { duration:500, delay:60, easing:'cubic-bezier(.22, 1, .36, 1)', fill:'backwards' });
  }

  try {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) reveal(entry.target); });
      if (!pending.size) observer.disconnect();
    }, { threshold:0, rootMargin:'0px 0px -24px 0px' });
    targets.forEach(target => observer.observe(target));

    document.addEventListener('focusin', event => {
      pending.forEach(target => {
        if (target.contains(event.target)) {
          pending.delete(target);
          observer.unobserve(target);
          markSeen(target);
        }
      });
      if (!pending.size) observer.disconnect();
    });
    const onPreferenceChange = event => { if (event.matches) stopMotion(); };
    if (motionPreference.addEventListener) {
      motionPreference.addEventListener('change', onPreferenceChange);
    } else if (motionPreference.addListener) {
      motionPreference.addListener(onPreferenceChange);
    }
    window.addEventListener('beforeprint', stopMotion);
  } catch {
    stopMotion();
  }
})();
