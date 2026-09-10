
  // Shared animation handling: failures and reduced motion leave content visible.
  const portfolioMotion = (() => {
    const preference = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const active = new Map();
    const allowed = () => !!preference && !preference.matches && typeof Element.prototype.animate === 'function';
    function cancel(element) {
      const animation = active.get(element);
      active.delete(element);
      animation?.cancel();
    }
    function cancelAll() { [...active.keys()].forEach(cancel); }
    function animate(element, keyframes, options = {}) {
      if (!element) return null;
      cancel(element);
      if (!allowed() || element.contains(document.activeElement)) return null;
      try {
        const animation = element.animate(keyframes, { duration:220, easing:'ease-out', ...options });
        active.set(element, animation);
        animation.onfinish = animation.oncancel = () => {
          if (active.get(element) === animation) active.delete(element);
        };
        return animation;
      } catch { return null; }
    }
    const onChange = event => { if (event.matches) cancelAll(); };
    if (preference?.addEventListener) preference.addEventListener('change', onChange);
    else preference?.addListener?.(onChange);
    document.addEventListener('focusin', event => {
      [...active.keys()].forEach(element => { if (element.contains(event.target)) cancel(element); });
    });
    window.addEventListener('beforeprint', cancelAll);
    return { preference, allowed, animate, cancelAll };
  })();

  // Both galleries keep their image, figure number and description in step.
  function setupProjectGallery(gallery, figure, description, label, total) {
    if (!gallery || !figure || !description) return;
    const slides = [...gallery.querySelectorAll('.gallery-slide')];
    const dots = [...gallery.querySelectorAll('.gallery-dot')];
    const media = gallery.querySelector('.project-media');
    const count = gallery.querySelector('.gallery-count');
    if (!slides.length) return;
    let current = 0;
    let shown = -1;
    let revision = 0;

    async function prepareImages(slide) {
      // Load lazy images before the shared fade; slow images must not lock the gallery.
      const ready = [...slide.querySelectorAll('img')].map(image => {
        image.loading = 'eager';
        return typeof image.decode === 'function' ? image.decode().catch(() => {}) : Promise.resolve();
      });
      let timer;
      await Promise.race([Promise.all(ready), new Promise(resolve => { timer = setTimeout(resolve, 1500); })]);
      clearTimeout(timer);
    }

    async function showSlide(index, { immediate = false } = {}) {
      if (!Number.isInteger(index)) return;
      current = ((index % slides.length) + slides.length) % slides.length;
      const next = current;
      const request = ++revision;
      if (next === shown) { gallery.setAttribute('aria-busy', 'false'); return; }
      const slide = slides[next];
      const first = shown < 0;
      if (!first && !immediate) {
        gallery.setAttribute('aria-busy', 'true');
        await prepareImages(slide);
      }
      // A newer arrow/dot click or lightbox selection always wins.
      if (request !== revision) return;
      shown = next;
      slides.forEach((item, i) => item.classList.toggle('is-active', i === next));
      dots.forEach(dot => {
        const selected = Number(dot.dataset.slide) === next;
        dot.classList.toggle('is-active', selected);
        dot.setAttribute('aria-current', String(selected));
      });
      figure.textContent = `FIG. ${slide.dataset.figure} — ${label}`;
      description.innerHTML = slide.dataset.description; // Trusted descriptions authored in this HTML.
      count.textContent = `${slide.dataset.images} / ${total}`;
      gallery.setAttribute('aria-busy', 'false');
      if (!first && !immediate) {
        [media, figure, description].forEach(element => {
          portfolioMotion.animate(element, [{ opacity:0 }, { opacity:1 }], { duration:220 });
        });
      }
      document.dispatchEvent(new Event('portfolio:gallery-change'));
    }

    gallery.showSlide = showSlide;
    gallery.querySelector('.prev').addEventListener('click', () => showSlide(current - 1));
    gallery.querySelector('.next').addEventListener('click', () => showSlide(current + 1));
    dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slide))));
    showSlide(0, { immediate:true });
  }

  // Theme toggle (dark is default; choice is remembered for next visit)
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  function applyTheme(theme){
    if(theme === 'light'){
      root.setAttribute('data-theme', 'light');
      themeToggle.textContent = '☾';
    } else {
      root.removeAttribute('data-theme');
      themeToggle.textContent = '☀';
    }
    themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
  }

  let saved;
  try { saved = localStorage.getItem('portfolio-theme'); } catch { /* Storage can be disabled. */ }
  applyTheme(saved || 'dark');

  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem('portfolio-theme', next); } catch { /* Theme still works for this visit. */ }
  });

  // Mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const navlinks = document.getElementById('navlinks');
  function setMenu(open) {
    navlinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    navlinks.inert = window.innerWidth <= 780 && !open;
  }
  setMenu(false);
  window.addEventListener('resize', () => setMenu(false));
  navToggle.addEventListener('click', () => setMenu(!navlinks.classList.contains('open')));
  navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navlinks.classList.contains('open')) { setMenu(false); navToggle.focus(); }
  });
  document.addEventListener('click', event => { if (!event.target.closest('nav')) setMenu(false); });

  // Content stays visible even when scripts or browser storage are unavailable.

  // Project 01 image gallery: one numbered figure at a time, with paired
  // source images kept together in their original proportions.
  const elephantGallery = document.getElementById('elephantGallery');
  setupProjectGallery(elephantGallery, document.getElementById('elephantFigure'),
    document.getElementById('elephantDescription'), 'GROUP PROJECT', '04');

  // Shared, keyboard-accessible image viewer for both project galleries.
  function setupLightbox(gallery, box) {
    if (!gallery || !box) return;
    const images = [...gallery.querySelectorAll('.gallery-slide img')];
    const image = box.querySelector('img');
    const close = box.querySelector('.lightbox-close');
    const previous = box.querySelector('[data-action="previous"]');
    const next = box.querySelector('[data-action="next"]');
    const zoomOut = box.querySelector('[data-action="out"]');
    const zoomIn = box.querySelector('[data-action="in"]');
    const reset = box.querySelector('[data-action="reset"]');
    let index = 0, zoom = 1, x = 0, y = 0, drag = null;
    let background = [];

    function transform() {
      const maxX = image.clientWidth * (zoom - 1) / 2;
      const maxY = image.clientHeight * (zoom - 1) / 2;
      x = Math.max(-maxX, Math.min(maxX, x));
      y = Math.max(-maxY, Math.min(maxY, y));
      image.style.transform = `translate(${x}px, ${y}px) scale(${zoom})`;
      image.classList.toggle('is-zoomed', zoom > 1);
      zoomOut.disabled = zoom <= 1;
      zoomIn.disabled = zoom >= 3;
      reset.textContent = `${Math.round(zoom * 100)}%`;
    }
    function stopDrag(event) {
      if (!drag) return;
      const pointerId = drag.pointerId;
      drag = null;
      image.classList.remove('is-panning');
      if (image.hasPointerCapture?.(pointerId)) image.releasePointerCapture(pointerId);
    }
    function setZoom(value) {
      zoom = Math.round(Math.max(1, Math.min(3, value)) * 100) / 100;
      if (zoom === 1) { x = 0; y = 0; stopDrag(); }
      transform();
    }
    function show(value) {
      stopDrag();
      index = (value + images.length) % images.length;
      const source = images[index];
      image.src = source.currentSrc || source.src;
      image.alt = source.alt;
      x = 0; y = 0; setZoom(1);
      gallery.showSlide([...gallery.querySelectorAll('.gallery-slide')].indexOf(source.closest('.gallery-slide')), { immediate:true });
      box.querySelector('.lightbox-hint').textContent = `${index + 1} / ${images.length} · Use arrows to browse, + / − to zoom, and drag to pan. Escape closes.`;
    }
    function open(value) {
      document.dispatchEvent(new Event('portfolio:lightbox-open'));
      show(value);
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      background = [...document.body.children].filter(node => node !== box && node.tagName !== 'SCRIPT').map(node => [node, node.inert]);
      background.forEach(([node]) => { node.inert = true; });
      close.focus();
    }
    function dismiss() {
      stopDrag();
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      background.forEach(([node, wasInert]) => { node.inert = wasInert; });
      background = [];
      image.removeAttribute('src');
      images[index].focus({preventScroll:true});
      images[index].scrollIntoView({behavior:'auto', block:'nearest'});
    }
    images.forEach((source, i) => {
      source.tabIndex = 0;
      source.setAttribute('role', 'button');
      source.setAttribute('aria-label', `Expand: ${source.alt}`);
      source.addEventListener('click', () => open(i));
      source.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(i); }
      });
    });
    image.draggable = false;
    close.addEventListener('click', dismiss);
    previous.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    zoomOut.addEventListener('click', () => setZoom(zoom - .25));
    zoomIn.addEventListener('click', () => setZoom(zoom + .25));
    reset.addEventListener('click', () => { x = 0; y = 0; setZoom(1); });
    box.addEventListener('click', event => { if (event.target === box) dismiss(); });
    box.addEventListener('wheel', event => { event.preventDefault(); setZoom(zoom + (event.deltaY < 0 ? .15 : -.15)); }, {passive:false});
    image.addEventListener('pointerdown', event => {
      if (zoom <= 1 || event.button !== 0) return;
      event.preventDefault();
      drag = {pointerId:event.pointerId, startX:event.clientX, startY:event.clientY, x, y};
      image.setPointerCapture(event.pointerId);
      image.classList.add('is-panning');
    });
    image.addEventListener('pointermove', event => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      x = drag.x + event.clientX - drag.startX;
      y = drag.y + event.clientY - drag.startY;
      transform();
    });
    image.addEventListener('pointerup', stopDrag);
    image.addEventListener('pointercancel', stopDrag);
    image.addEventListener('lostpointercapture', stopDrag);
    document.addEventListener('keydown', event => {
      if (!box.classList.contains('is-open')) return;
      if (event.key === 'Escape') { event.preventDefault(); dismiss(); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
      if (event.key === '+' || event.key === '=') { event.preventDefault(); setZoom(zoom + .25); }
      if (event.key === '-') { event.preventDefault(); setZoom(zoom - .25); }
      if (event.key === 'Tab') {
        const buttons = [...box.querySelectorAll('button:not(:disabled)')];
        const first = buttons[0], last = buttons.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }
  setupLightbox(elephantGallery, document.getElementById('imageLightbox'));


  const leakGallery = document.getElementById('leakGallery');
  const leakFigure = document.getElementById('leakFigure');
  const leakDescription = document.getElementById('leakDescription');

  if(leakGallery){
    setupProjectGallery(leakGallery, leakFigure, leakDescription, 'FINAL YEAR PROJECT', '09');
    setupLightbox(leakGallery, document.getElementById('leakLightbox'));
  }
