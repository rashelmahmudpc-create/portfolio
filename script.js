/* ================= Portfolio — interactions ================= */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const root = document.documentElement;

/* ---- Year ---- */
$('#year').textContent = new Date().getFullYear();

/* ---- Loader ---- */
addEventListener('load', () => setTimeout(() => $('#loader').classList.add('hide'), 700));
setTimeout(() => $('#loader').classList.add('hide'), 3500);

/* ---- Theme ---- */
const saved = localStorage.getItem('theme');
if (saved) root.setAttribute('data-theme', saved);
$('#themeToggle').addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ---- Scroll: progress + nav + toTop ---- */
const nav = $('#nav'), toTop = $('#toTop'), progress = $('#progress');
addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = (scrollY / h) * 100 + '%';
  nav.classList.toggle('scrolled', scrollY > 40);
  toTop.classList.toggle('show', scrollY > 600);
}, { passive: true });

/* ---- Mobile menu ---- */
const burger = $('#hamburger'), links = $('#navLinks');
burger.addEventListener('click', () => { burger.classList.toggle('open'); links.classList.toggle('open'); });
$$('#navLinks a').forEach(a => a.addEventListener('click', () => { burger.classList.remove('open'); links.classList.remove('open'); }));

/* ---- Back to top ---- */
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- Typing ---- */
const words = ['modern websites.', 'interactive apps.', 'smooth animations.', 'delightful UI.'];
const el = $('#typed');
let w = 0, c = 0, deleting = false;
(function type() {
  const word = words[w];
  el.textContent = deleting ? word.slice(0, --c) : word.slice(0, ++c);
  let delay = deleting ? 50 : 100;
  if (!deleting && c === word.length) { delay = 1500; deleting = true; }
  else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 320; }
  setTimeout(type, delay);
})();

/* ---- Reveal ---- */
const io = new IntersectionObserver((es) => {
  es.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = `${(i % 5) * 80}ms`;
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.14 });
$$('.reveal').forEach(n => io.observe(n));

/* ---- Skill bars ---- */
const skillIO = new IntersectionObserver((es) => {
  es.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.w + '%'; skillIO.unobserve(e.target); } });
}, { threshold: 0.4 });
$$('.bar i').forEach(i => skillIO.observe(i));

/* ---- Radial progress ---- */
const radialIO = new IntersectionObserver((es) => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    const node = e.target, p = +node.dataset.p, circle = $('.prog', node), label = $('b', node);
    const len = 2 * Math.PI * 52;
    circle.style.strokeDasharray = len;
    circle.style.strokeDashoffset = len;
    requestAnimationFrame(() => { circle.style.strokeDashoffset = len * (1 - p / 100); });
    let n = 0;
    const tick = () => { n += 2; if (n >= p) { label.textContent = p + '%'; return; } label.textContent = n + '%'; requestAnimationFrame(tick); };
    tick();
    radialIO.unobserve(node);
  });
}, { threshold: 0.5 });
$$('.radial').forEach(n => radialIO.observe(n));

/* ---- Counters ---- */
const counterIO = new IntersectionObserver((es) => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    const node = e.target, target = +node.dataset.count;
    let n = 0; const step = Math.max(1, target / 40);
    const tick = () => { n += step; if (n >= target) { node.textContent = target + (target >= 99 ? '%' : '+'); return; } node.textContent = Math.floor(n); requestAnimationFrame(tick); };
    tick();
    counterIO.unobserve(node);
  });
}, { threshold: 0.5 });
$$('[data-count]').forEach(n => counterIO.observe(n));

/* ---- Testimonials slider ---- */
const track = $('#testiTrack'), dots = $('#testiDots');
const slides = $$('.testi', track);
slides.forEach((_, i) => {
  const b = document.createElement('button');
  if (i === 0) b.classList.add('active');
  b.addEventListener('click', () => go(i));
  dots.appendChild(b);
});
let cur = 0, auto;
function go(i) {
  cur = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${cur * 100}%)`;
  $$('button', dots).forEach((d, k) => d.classList.toggle('active', k === cur));
  clearInterval(auto); auto = setInterval(() => go(cur + 1), 5000);
}
auto = setInterval(() => go(cur + 1), 5000);

/* ---- Custom cursor ---- */
const dot = $('.cursor-dot'), ring = $('.cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
(function follow() { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; requestAnimationFrame(follow); })();
$$('a, button, .project, input, textarea, .stat-card').forEach(n => {
  n.addEventListener('mouseenter', () => ring.classList.add('hover'));
  n.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

/* ---- Magnetic buttons ---- */
$$('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => (btn.style.transform = ''));
});

/* ---- 3D tilt ---- */
$$('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
  });
  card.addEventListener('mouseleave', () => (card.style.transform = ''));
});

/* ---- Contact form ---- */
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const note = $('#formNote');
  note.textContent = "✓ Message sent! I'll get back to you soon.";
  e.target.reset();
  setTimeout(() => (note.textContent = ''), 4000);
});

/* ---- Particle background ---- */
(function particles() {
  const cv = $('#bg-canvas'), ctx = cv.getContext('2d');
  let pts = [], W, H, mouse = { x: -999, y: -999 };
  const resize = () => {
    W = cv.width = innerWidth; H = cv.height = innerHeight;
    const count = Math.min(80, Math.floor(W / 18));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.7 + 0.6
    }));
  };
  resize();
  addEventListener('resize', resize);
  addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    const light = root.getAttribute('data-theme') === 'light';
    const col = light ? '110,95,250' : '160,170,255';
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},.7)`; ctx.fill();
      for (let j = i + 1; j < pts.length; j++) {
        const dx = p.x - pts[j].x, dy = p.y - pts[j].y, d = Math.hypot(dx, dy);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${col},${0.15 * (1 - d / 120)})`; ctx.lineWidth = 1; ctx.stroke();
        }
      }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < 160) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(0,230,195,${0.25 * (1 - dm / 160)})`; ctx.lineWidth = 1; ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  })();
})();
