/* ===== PREFERENCES ===== */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('theme-toggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const root = document.documentElement;

const THEME_KEY = 'mks-theme';
const THEME_BG = { dark: '#0d0d1a', light: '#f6f6fb' };

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeMeta.setAttribute('content', THEME_BG[theme]);
}

function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch (e) {
    return null;
  }
}

function initTheme() {
  const stored = getStoredTheme();
  const system = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  applyTheme(stored || system);
}

initTheme();

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch (e) {
    /* storage unavailable — theme still applies for this session */
  }
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
const scrollProgress = document.querySelector('#scroll-progress span');
const backToTop = document.getElementById('back-to-top');

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
  const scrollPos = window.scrollY + 140;
  let current = '';

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPos) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ===== SCROLL HANDLER ===== */
let ticking = false;

function onScroll() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;

  navbar.classList.toggle('scrolled', scrollTop > 40);
  backToTop.classList.toggle('visible', scrollTop > 500);

  if (scrollProgress) {
    const pct = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
    scrollProgress.style.width = `${Math.min(pct, 100)}%`;
  }

  updateActiveLink();
  ticking = false;
}

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(onScroll);
    ticking = true;
  }
}, { passive: true });

onScroll();

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Toggle menu');
  document.body.classList.toggle('menu-open', open);
}

hamburger.addEventListener('click', () => {
  setMenu(!navLinks.classList.contains('open'));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('click', (e) => {
  if (
    navLinks.classList.contains('open') &&
    !navLinks.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    setMenu(false);
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    setMenu(false);
    hamburger.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
    setMenu(false);
  }
});

/* ===== BACK TO TOP ===== */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
});

/* ===== TYPEWRITER EFFECT ===== */
const roles = [
  'Software Developer',
  'B.Tech CSE Student',
  'ML & Gen AI Enthusiast',
  'Agentic AI & LangGraph Developer',
  'APK Analyst'
];

const roleText = document.getElementById('role-text');

if (prefersReducedMotion) {
  roleText.textContent = roles[0];
} else {
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeWriter() {
    const current = roles[roleIndex];

    if (isDeleting) {
      roleText.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      roleText.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    }

    setTimeout(typeWriter, delay);
  }

  typeWriter();
}

/* ===== SCROLL FADE-IN ANIMATION ===== */
const revealTargets = document.querySelectorAll(
  '.section-title, .sub-title, .skill-card, .project-card, .edu-card, .cert-card, ' +
  '.contact-card, .timeline-item, .about-grid, .fact-card, .hero-stat, .contact-actions'
);

revealTargets.forEach((el, index) => {
  el.classList.add('fade-in');
  el.style.setProperty('--delay', `${(index % 6) * 70}ms`);
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach((el) => observer.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add('visible'));
}

/* ===== COPY EMAIL ===== */
const copyBtn = document.getElementById('copy-email');
const EMAIL = 'sainimk4735@gmail.com';

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch (e) {
      /* fall through to the legacy path */
    }
  }
  /* Fallback for non-secure contexts (e.g. file://) or blocked clipboard API */
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly', '');
  ta.style.position = 'fixed';
  ta.style.top = '-1000px';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  ta.setSelectionRange(0, text.length);
  const ok = document.execCommand('copy');
  document.body.removeChild(ta);
  if (!ok) throw new Error('copy failed');
}

copyBtn.addEventListener('click', async () => {
  const label = copyBtn.querySelector('span');
  const icon = copyBtn.querySelector('i');
  const original = label.textContent;

  try {
    await copyText(EMAIL);
    label.textContent = 'Copied!';
    icon.className = 'fa fa-check';
    copyBtn.classList.add('copied');
  } catch (e) {
    label.textContent = EMAIL;
    icon.className = 'fa fa-envelope';
  }

  setTimeout(() => {
    label.textContent = original;
    icon.className = 'fa fa-copy';
    copyBtn.classList.remove('copied');
  }, 2200);
});
