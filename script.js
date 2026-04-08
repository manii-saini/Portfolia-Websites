// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== TYPEWRITER EFFECT =====
const roles = [
  'Software Developer',
  'B.Tech CSE Student',
  'ML Enthusiast',
  'APK Analyst'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const roleText = document.getElementById('role-text');

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

// ===== SCROLL FADE-IN ANIMATION =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.skill-card, .project-card, .edu-card, .cert-card, .contact-card, .timeline-item, .about-grid, .about-text p')
  .forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = '#6c63ff';
    }
  });
});
