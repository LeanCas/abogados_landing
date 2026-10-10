(() => {
  'use strict';

  const WA_NUMBER = '5493855147492';
  const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.classList.remove('no-js');
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- WhatsApp links ---------- */
  document.querySelectorAll('[data-wa]').forEach((el) => {
    el.href = waLink(el.dataset.wa);
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* ---------- Header + mobile nav ---------- */
  const header = document.getElementById('header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Active nav link ---------- */
  const links = [...document.querySelectorAll('.nav__link')];
  const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${en.target.id}`));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll('.reveal');
  // stagger siblings
  reveals.forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', `${Math.min(i * 0.09, 0.5)}s`);
  });
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Service tabs ---------- */
  const tabs = [...document.querySelectorAll('.tab')];
  const activate = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !on;
      panel.classList.toggle('is-active', on);
    });
    if (focus) tab.focus();
    tab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activate(t));
    t.addEventListener('keydown', (e) => {
      const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (dir) { e.preventDefault(); activate(tabs[(i + dir + tabs.length) % tabs.length], true); }
    });
  });
  // Deep links: #sucesiones, #art, #jubilaciones, #penales, #contencioso
  const fromHash = () => {
    const t = document.getElementById(`t-${location.hash.slice(1)}`);
    if (t) { activate(t); document.getElementById('servicios').scrollIntoView(); }
  };
  window.addEventListener('hashchange', fromHash);
  fromHash();

  /* ---------- Lightbox ---------- */
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  let lastFocus = null;
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ''; lastFocus && lastFocus.focus(); };
  document.querySelectorAll('[data-lightbox]').forEach((b) => b.addEventListener('click', () => {
    lastFocus = b;
    lbImg.src = b.dataset.lightbox;
    lbImg.alt = b.querySelector('img').alt;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lb.querySelector('button').focus();
  }));
  lb.addEventListener('click', (e) => { if (e.target !== lbImg) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  /* ---------- Contact form -> WhatsApp ---------- */
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const field = form.name.closest('.field');
    if (!name) { field.classList.add('is-invalid'); form.name.focus(); return; }
    field.classList.remove('is-invalid');
    const msg = [
      'Hola Dra. Lorena, mi nombre es ' + name + '.',
      'Quisiera hacer una consulta sobre: ' + form.area.value + '.',
      form.msg.value.trim()
    ].filter(Boolean).join('\n');
    window.open(waLink(msg), '_blank', 'noopener');
  });

  /* ---------- Floating WhatsApp bubble ---------- */
  const bubble = document.getElementById('waBubble');
  let dismissed = false;
  try { dismissed = sessionStorage.getItem('waBubble') === '0'; } catch (_) { /* ignore */ }
  if (!dismissed) setTimeout(() => bubble.classList.add('is-visible'), 4000);
  document.getElementById('waClose').addEventListener('click', () => {
    bubble.classList.remove('is-visible');
    try { sessionStorage.setItem('waBubble', '0'); } catch (_) { /* ignore */ }
  });

  /* ---------- Gold dust particles (hero) ---------- */
  const canvas = document.getElementById('dust');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, parts, raf;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const init = () => {
      w = canvas.offsetWidth; h = canvas.offsetHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, (w * h) / 16000));
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.6 + .3,
        vy: -(Math.random() * .25 + .05), vx: (Math.random() - .5) * .15,
        a: Math.random() * .6 + .2, t: Math.random() * Math.PI * 2
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.t += .02;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        ctx.globalAlpha = p.a * (.6 + .4 * Math.sin(p.t));
        ctx.fillStyle = '#e8c46e';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    init(); draw();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(init, 200); });
    // pause when hero is off-screen
    new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { if (!raf) draw(); } else { cancelAnimationFrame(raf); raf = null; }
    }).observe(canvas);
  }
})();
