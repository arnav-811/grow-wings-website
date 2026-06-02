(function () {
  'use strict';

  /* ── Scroll progress bar ─────────────────────────────────────────── */
  const prog = document.createElement('div');
  prog.id = 'scroll-progress';
  document.body.prepend(prog);
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    prog.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  }, { passive: true });

  /* ── Scroll reveal with stagger ─────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = [...(el.parentElement?.querySelectorAll(
        '.fade-in,.fade-in-left,.fade-in-right,.scale-in') ?? [])];
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = Math.min(idx * 90, 450) + 'ms';
      el.classList.add('visible');
      revealObs.unobserve(el);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.fade-in,.fade-in-left,.fade-in-right,.scale-in')
    .forEach(el => revealObs.observe(el));

  /* ── Stat counter ────────────────────────────────────────────────── */
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCount(el) {
    const raw = el.textContent.trim();
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    if (!num) return;
    const isDecimal = raw.includes('.');
    const suffix = raw.replace(/[0-9.]/g, '').trim();
    const dur = 1800;
    const t0 = performance.now();
    (function tick(now) {
      const p = Math.min((now - t0) / dur, 1);
      const v = easeOutCubic(p) * num;
      el.textContent = (isDecimal ? v.toFixed(1) : Math.floor(v)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = (isDecimal ? num.toFixed(1) : num) + suffix;
    })(t0);
  }

  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.counted) {
        e.target.dataset.counted = '1';
        animateCount(e.target);
      }
    });
  }, { threshold: 0.7 });

  document.querySelectorAll('.stat-count').forEach(el => countObs.observe(el));

  /* ── Card 3-D tilt ───────────────────────────────────────────────── */
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 10;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * -10;
      card.style.transform =
        `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px)`;
      card.style.boxShadow =
        `${-x * 1.5}px ${y * 1.5}px 40px rgba(50,153,155,0.13)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  /* ── Magnetic buttons ────────────────────────────────────────────── */
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  /* ── Smooth custom cursor (desktop only) ─────────────────────────── */
  if (window.matchMedia('(pointer:fine)').matches && window.innerWidth > 768) {
    const dot  = Object.assign(document.createElement('div'), { id: 'cursor-dot' });
    const ring = Object.assign(document.createElement('div'), { id: 'cursor-ring' });
    document.body.append(dot, ring);

    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx - 4}px,${my - 4}px)`;
    }, { passive: true });

    (function animRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.transform = `translate(${rx - 19}px,${ry - 19}px)`;
      requestAnimationFrame(animRing);
    })();

    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width = ring.style.height = '58px';
        ring.style.borderColor = 'rgba(251,120,0,.5)';
        dot.style.background = '#fb7800';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width = ring.style.height = '38px';
        ring.style.borderColor = 'rgba(50,153,155,.35)';
        dot.style.background = '#32999b';
      });
    });
  }

  /* ── Navbar shadow on scroll ─────────────────────────────────────── */
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('shadow-md', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── Parallax on hero images ─────────────────────────────────────── */
  const heroImgs = document.querySelectorAll('section:first-of-type img');
  window.addEventListener('scroll', () => {
    heroImgs.forEach(img => {
      const y = window.scrollY * 0.18;
      img.style.transform = `translateY(${y}px)`;
    });
  }, { passive: true });

})();
