/* =====================================================
   PORTFOLIO — script.js
   ===================================================== */

/* ── Navbar: scroll shadow + hamburger ──────────────── */
(function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Add scrolled class for frosted glass effect
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    // Prevent body scroll when menu open
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close nav on link click
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();


/* ── Scroll Reveal ──────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });

  els.forEach(el => io.observe(el));
})();


/* ── Active nav link highlighting ───────────────────── */
(function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav__link');

  const update = () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
})();


/* ── Contact form ───────────────────────────────────── */
(function initForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      flash('Please fill in all fields.', false); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      flash('Please enter a valid email.', false); return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    // Simulate async send — replace with real fetch() to your endpoint
    await new Promise(r => setTimeout(r, 1300));

    flash('Message sent! I\'ll be in touch soon ✓', true);
    form.reset();
    btn.disabled = false;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message`;
  });

  function flash(msg, ok) {
    status.textContent  = msg;
    status.style.color  = ok ? 'var(--accent)' : '#b85c38';
    setTimeout(() => { status.textContent = ''; }, 5000);
  }
})();


/* ── Button ripple micro-interaction ────────────────── */
(function initRipple() {
  // Inject keyframe once
  const style = document.createElement('style');
  style.textContent = `@keyframes _ripple { to { transform: scale(3); opacity: 0; } }`;
  document.head.appendChild(style);

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');

      Object.assign(ripple.style, {
        position:     'absolute',
        width:        size + 'px',
        height:       size + 'px',
        left:         (e.clientX - rect.left - size / 2) + 'px',
        top:          (e.clientY - rect.top  - size / 2) + 'px',
        borderRadius: '50%',
        background:   'rgba(255,255,255,0.15)',
        transform:    'scale(0)',
        animation:    '_ripple 0.5s ease-out forwards',
        pointerEvents:'none',
        zIndex:       '0',
      });

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();


/* ── Skill card tilt (desktop only) ─────────────────── */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 8;
      card.style.transform = `translateY(-4px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();