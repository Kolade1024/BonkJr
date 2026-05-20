'use strict';

// ==========================================
// LOADING SCREEN
// ==========================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('loaded');
    }
  }, 2000);
});

// ==========================================
// CURSOR GLOW
// ==========================================
const cursor = document.getElementById('cursor-glow');

if (cursor) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
}

// ==========================================
// PARTICLES CANVAS (Warm Golden & Red Palette)
// ==========================================
const canvas = document.getElementById('particles-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouseX = 0;
  let mouseY = 0;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 0.8;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.15;
      
      // Warm color distribution: Orange, Yellow, Red, or Soft White
      const rand = Math.random();
      if (rand > 0.7) {
        this.color = '255, 215, 0'; // Gold/Yellow
      } else if (rand > 0.4) {
        this.color = '224, 123, 0'; // Orange
      } else if (rand > 0.2) {
        this.color = '232, 20, 10'; // Red
      } else {
        this.color = '255, 248, 231'; // Off-white
      }
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Mouse interactive push away
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x -= dx * force * 0.006;
        this.y -= dy * force * 0.006;
      }

      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
      ctx.fill();
    }
  }

  const initParticles = () => {
    const count = Math.min(Math.floor(canvas.width * canvas.height / 14000), 75);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  };

  initParticles();
  window.addEventListener('resize', initParticles);

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const animateParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(255, 215, 0, ${0.05 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animateParticles);
  };

  animateParticles();
}

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

const handleNavScroll = () => {
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
};

window.addEventListener('scroll', handleNavScroll);

// ==========================================
// HAMBURGER MENU
// ==========================================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('navLinks');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    });
  });
}

// ==========================================
// ACTIVE NAV LINK ON SCROLL
// ==========================================
const sections = document.querySelectorAll('section[id]');

const highlightNav = () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
};

window.addEventListener('scroll', highlightNav);

// ==========================================
// SCROLL REVEAL (Intersection Observer)
// ==========================================
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

// ==========================================
// ROADMAP SCROLL REVEAL (Staggered)
// ==========================================
const roadmapItems = document.querySelectorAll('.roadmap-item');
if (roadmapItems.length > 0) {
  const roadmapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const phase = parseInt(entry.target.dataset.phase) || 0;
        const delay = (phase - 1) * 150;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);
        roadmapObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  roadmapItems.forEach(item => roadmapObserver.observe(item));
}

// ==========================================
// SMOOTH SCROLL FOR NAV LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ==========================================
// HERO LOGO / TEXT PARALLAX EFFECT
// ==========================================
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const hero = document.getElementById('hero');
  if (hero) {
    const heroContent = hero.querySelector('.hero-content');
    if (heroContent && scrolled < hero.offsetHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.12}px)`;
      heroContent.style.opacity = 1 - (scrolled / hero.offsetHeight) * 0.6;
    }
  }
});

console.log('%c BONK JR 🐶 ', 'font-size: 48px; font-weight: bold; color: #FFD700; text-shadow: 0 0 10px #E07B00;');
console.log('%c Bonk\'s Son has arrived to dominate the meme universe! 🚀', 'font-size: 18px; color: #FFF8E7;');
