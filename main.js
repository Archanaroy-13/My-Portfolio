/* =====================================================
   PORTFOLIO — main.js
   ===================================================== */

/* ── Navbar: scroll shadow + hamburger ──────────────── */
(function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

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


/* ── Contact form → sends email to archanaroy1309@gmail.com ─
   
   Uses Formspree (free, no backend required):
   1. Go to https://formspree.io and sign up / log in
   2. Click "New Form", set the email to archanaroy1309@gmail.com
   3. Copy the form ID (looks like: xpwzgkla)
   4. Replace YOUR_FORMSPREE_ID below with that ID

   Once done, every submission from the contact form will be
   delivered straight to archanaroy1309@gmail.com.
──────────────────────────────────────────────────────────── */
(function initForm() {
  const FORMSPREE_ID = 'YOUR_FORMSPREE_ID'; // ← replace with your Formspree form ID

  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const btn    = document.getElementById('submitBtn');
  if (!form) return;

  const originalBtnHTML = btn.innerHTML;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      flash('Please fill in all fields.', false);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      flash('Please enter a valid email.', false);
      return;
    }

    // Show loading state
    btn.disabled = true;
    btn.textContent = 'Sending…';

    /* ── If Formspree ID is set, use it ── */
    if (FORMSPREE_ID && FORMSPREE_ID !== 'YOUR_FORMSPREE_ID') {
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, message })
        });

        if (res.ok) {
          flash('Message sent! I\'ll be in touch soon ✓', true);
          form.reset();
        } else {
          const data = await res.json().catch(() => ({}));
          flash(data.error || 'Something went wrong. Please try again.', false);
        }
      } catch {
        flash('Network error. Please email me directly.', false);
      }
    } else {
      /* ── Fallback: open default mail client ── */
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.open(`mailto:Archanaroy1309@gmail.com?subject=${subject}&body=${body}`);
      await new Promise(r => setTimeout(r, 800));
      flash('Opening your mail client… ✓', true);
      form.reset();
    }

    btn.disabled  = false;
    btn.innerHTML = originalBtnHTML;
  });

  function flash(msg, ok) {
    status.textContent = msg;
    status.style.color = ok ? 'var(--accent)' : '#b85c38';
    setTimeout(() => { status.textContent = ''; }, 5000);
  }
})();


/* ── Button ripple micro-interaction ────────────────── */
(function initRipple() {
  const style = document.createElement('style');
  style.textContent = `@keyframes _ripple { to { transform: scale(3); opacity: 0; } }`;
  document.head.appendChild(style);

  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');

      Object.assign(ripple.style, {
        position:      'absolute',
        width:         size + 'px',
        height:        size + 'px',
        left:          (e.clientX - rect.left - size / 2) + 'px',
        top:           (e.clientY - rect.top  - size / 2) + 'px',
        borderRadius:  '50%',
        background:    'rgba(255,255,255,0.15)',
        transform:     'scale(0)',
        animation:     '_ripple 0.5s ease-out forwards',
        pointerEvents: 'none',
        zIndex:        '0',
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