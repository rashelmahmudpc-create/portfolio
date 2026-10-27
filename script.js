/* ================= Portfolio interactions ================= */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ---- Year ---- */
$('#year').textContent = new Date().getFullYear();

/* ---- Theme toggle (persisted) ---- */
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) root.setAttribute('data-theme', saved);
$('#themeToggle').addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ---- Navbar scroll state ---- */
const nav = $('#nav');
const toTop = $('#toTop');
addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 40);
  toTop.classList.toggle('show', scrollY > 500);
});

/* ---- Mobile menu ---- */
const burger = $('#hamburger'), links = $('#navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  links.classList.toggle('open');
});
$$('#navLinks a').forEach(a => a.addEventListener('click', () => {
  burger.classList.remove('open');
  links.classList.remove('open');
}));

/* ---- Back to top ---- */
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- Typing effect ---- */
const words = ['modern websites.', 'interactive apps.', 'smooth animations.', 'delightful UI.'];
const el = $('#typed');
let w = 0, c = 0, deleting = false;
(function type() {
  const word = words[w];
  el.textContent = deleting ? word.slice(0, --c) : word.slice(0, ++c);
  let delay = deleting ? 55 : 105;
  if (!deleting && c === word.length) { delay = 1600; deleting = true; }
  else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
  setTimeout(type, delay);
})();

/* ---- Scroll reveal ---- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = `${(i % 4) * 90}ms`;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
$$('.reveal').forEach(el => io.observe(el));

/* ---- Skill bars ---- */
const skillIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const i = e.target;
      i.style.width = i.dataset.w + '%';
      skillIO.unobserve(i);
    }
  });
}, { threshold: 0.4 });
$$('.bar i').forEach(i => skillIO.observe(i));

/* ---- Animated counters ---- */
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const node = e.target, target = +node.dataset.count;
    let n = 0;
    const step = Math.max(1, target / 40);
    const tick = () => {
      n += step;
      if (n >= target) { node.textContent = target + '+'; return; }
      node.textContent = Math.floor(n);
      requestAnimationFrame(tick);
    };
    tick();
    counterIO.unobserve(node);
  });
}, { threshold: 0.5 });
$$('[data-count]').forEach(n => counterIO.observe(n));

/* ---- Custom cursor ---- */
const dot = $('.cursor-dot'), ring = $('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
});
(function follow() {
  rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
  ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
  requestAnimationFrame(follow);
})();
$$('a, button, .project, input, textarea').forEach(el =>
  el.addEventListener('mouseenter', () => ring.classList.add('hover')));
$$('a, button, .project, input, textarea').forEach(el =>
  el.addEventListener('mouseleave', () => ring.classList.remove('hover')));

/* ---- Contact form ---- */
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const note = $('#formNote');
  note.textContent = '✓ Message sent! I\'ll get back to you soon.';
  e.target.reset();
  setTimeout(() => (note.textContent = ''), 4000);
});

/* ---- Particle background ---- */
(function particles() {
  const cv = $('#bg-canvas'), ctx = cv.getContext('2d');
  let pts = [], W, H;
  const resize = () => {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    const count = Math.min(90, Math.floor(W / 16));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.6
    }));
  };
  resize();
  addEventListener('resize', resize);
  const mouse = { x: -999, y: -999 };
  addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  (function draw() {
    ctx.clearRect(0, 0, W, H);
    const light = root.getAttribute('data-theme') === 'light';
    const col = light ? '109,94,252' : '150,160,255';
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},.7)`;
      ctx.fill();
    });
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${col},${0.16 * (1 - d / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      const dm = Math.hypot(pts[i].x - mouse.x, pts[i].y - mouse.y);
      if (dm < 160) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0,224,198,${0.25 * (1 - dm / 160)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  })();
})();
