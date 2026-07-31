(function () {
  'use strict';

  /* === DOM REFS === */
  const header = document.getElementById('header');
  const hamburger = document.querySelector('.header__hamburger');
  const nav = document.getElementById('nav');
  const hero = document.querySelector('.hero');
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  const progressBar = document.getElementById('progressBar');
  const starfield = document.getElementById('starfield');
  const heroParticles = document.getElementById('heroParticles');

  /* === 1. CUSTOM CURSOR === */
  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursorFollower.style.left = e.clientX + 'px';
      cursorFollower.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, .btn, button, .room-card, .amenity-card, .stats__item').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); cursorFollower.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); cursorFollower.classList.remove('hover'); });
    });

    let trailTimer;
    document.addEventListener('mousemove', e => {
      clearTimeout(trailTimer);
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 600);
      trailTimer = setTimeout(() => {}, 50);
    });
  }

  /* === 2. STARFIELD === */
  if (starfield) {
    for (let i = 0; i < 80; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = 0.5 + Math.random() * 2;
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        --duration: ${2 + Math.random() * 3}s;
        --delay: ${Math.random() * 2}s;
        --max-opacity: ${0.3 + Math.random() * 0.7};
      `;
      starfield.appendChild(star);
    }
  }

  /* === 3. HERO PARTICLES === */
  if (heroParticles) {
    const colors = ['#D4AF37', '#E8B47C', '#7FB3D5', '#C9A0C9'];
    const radii = ['50%', '50%', '20%', '50%'];
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'hero__particle';
      const size = 2 + Math.random() * 4;
      const dist = -(80 + Math.random() * 150);
      p.style.cssText = `
        --size: ${size}px;
        --color: ${colors[Math.floor(Math.random() * colors.length)]};
        --radius: ${radii[Math.floor(Math.random() * radii.length)]};
        --dist: ${dist}px;
        --max-opacity: ${0.2 + Math.random() * 0.4};
        --duration: ${6 + Math.random() * 6}s;
        --delay: ${Math.random() * 8}s;
      `;
      heroParticles.appendChild(p);
    }
  }

  /* === 4. SCROLL PROGRESS === */
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + '%';
  }, { passive: true });

  /* === 5. HEADER SCROLL === */
  let headerTicking = false;
  window.addEventListener('scroll', () => {
    if (!headerTicking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 60);
        headerTicking = false;
      });
      headerTicking = true;
    }
  }, { passive: true });

  /* === 6. MOBILE MENU === */
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });

  nav?.querySelectorAll('.header__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      nav?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* === 7. REVEAL ON SCROLL === */
  const revealEls = document.querySelectorAll('.reveal');
  const staggerEls = document.querySelectorAll('.reveal-stagger');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  revealEls.forEach(el => observer.observe(el));
  staggerEls.forEach(el => observer.observe(el));

  /* === 8. HERO PARALLAX === */
  let parallaxTicking = false;
  window.addEventListener('scroll', () => {
    if (!parallaxTicking && hero) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        const hh = hero.offsetHeight;
        if (sy < hh) {
          const p = sy / hh;
          const bg = hero.querySelector('.hero__bg');
          const content = hero.querySelector('.hero__content');
          if (bg) bg.style.transform = `scale(${1 + p * 0.05}) translateY(${sy * 0.12}px)`;
          if (content) {
            content.style.transform = `translateY(${sy * 0.05}px)`;
            content.style.opacity = 1 - p * 0.4;
          }
        }
        parallaxTicking = false;
      });
      parallaxTicking = true;
    }
  }, { passive: true });

  /* === 9. SMOOTH ANCHOR SCROLL === */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });

  /* === 10. COUNTER ANIMATION === */
  let counted = false;
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          const ratingEl = document.getElementById('ratingCounter');
          if (ratingEl) {
            let current = 0;
            const step = 4.5 / 35;
            const timer = setInterval(() => {
              current += step;
              if (current >= 4.5) { current = 4.5; clearInterval(timer); }
              ratingEl.textContent = current.toFixed(1) + ' Stars';
            }, 35);
          }
        }
      });
    }, { threshold: 0.3 });
    statsObs.observe(statsSection);
  }

  /* === 11. 3D TILT CARDS === */
  document.querySelectorAll('.room-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (window.innerWidth <= 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotX = (y - rect.height / 2) / (rect.height / 2) * -10;
      const rotY = (x - rect.width / 2) / (rect.width / 2) * 10;
      card.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-16px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* === 12. AMENITY MOUSE TRACK === */
  document.querySelectorAll('.amenity-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  /* === 13. BUTTON RIPPLE === */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  /* === 14. MAGNETIC BUTTONS === */
  document.querySelectorAll('.btn--rose').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      if (window.innerWidth <= 768) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });

  /* === 15. TEXT SCRAMBLE EFFECT ON HOVER === */
  document.querySelectorAll('.room-card__title, .amenity-card__title, .location__heading').forEach(el => {
    const original = el.textContent;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    el.addEventListener('mouseenter', () => {
      let iterations = 0;
      const interval = setInterval(() => {
        el.textContent = original.split('').map((c, i) => i < iterations ? c : chars[Math.floor(Math.random() * chars.length)]).join('');
        iterations += 1/2;
        if (iterations >= original.length) clearInterval(interval);
      }, 35);
    });
  });

  /* === 16. STAR TWINKLE VARIATION === */
  document.querySelectorAll('.stats__stars span').forEach((star, i) => {
    star.style.animationDelay = (i * 0.2) + 's';
  });

  /* === 17. FLOATING ORBS PARALLAX === */
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    document.querySelectorAll('.floating-shape').forEach((shape, i) => {
      shape.style.transform = `translateY(${sy * (0.02 + i * 0.01)}px)`;
    });
  }, { passive: true });

  /* === 18. ACTIVE NAV LINK === */
  const navLinks = document.querySelectorAll('.header__nav-link');
  if (navLinks.length) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 120;
      let current = '';
      document.querySelectorAll('section[id]').forEach(sec => {
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) current = sec.id;
      });
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === '#' + current ? 'var(--rose)' : 'rgba(255,255,255,0.6)';
      });
    }, { passive: true });
  }

  /* === 19. FAQ ACCORDION === */
  document.querySelectorAll('.faq-item__header').forEach(header => {
    header.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const isActive = faqItem.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          item.querySelector('.faq-item__header').setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current item
      faqItem.classList.toggle('active');
      this.setAttribute('aria-expanded', !isActive);
    });
  });

  /* === 20. GALLERY MOUSE TRACK === */
  document.querySelectorAll('.attraction-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      if (window.innerWidth <= 1024) return;
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });

  /* === 21. STICKY WHATSAPP HIDE ON SCROLL (Desktop) === */
  let lastScrollY = 0;
  const stickyWhatsapp = document.querySelector('.sticky-whatsapp');
  if (stickyWhatsapp && window.innerWidth <= 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > lastScrollY && scrollY > 500) {
        stickyWhatsapp.style.transform = 'translateY(100px)';
      } else {
        stickyWhatsapp.style.transform = 'translateY(0)';
      }
      lastScrollY = scrollY;
    }, { passive: true });
  }

  /* === 22. REVIEW BACKGROUND PARALLAX === */
  const reviewsSection = document.querySelector('.reviews');
  if (reviewsSection) {
    window.addEventListener('scroll', () => {
      const rect = reviewsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const x = ((window.scrollX / window.innerWidth) * 100 + 50) % 100;
        const y = ((window.scrollY / window.innerHeight) * 100 + 50) % 100;
        reviewsSection.style.setProperty('--mx', x + '%');
        reviewsSection.style.setProperty('--my', y + '%');
      }
    }, { passive: true });
  }

  /* === 23. IMAGE ALT TEXT === */
  document.querySelectorAll('img:not([alt])').forEach(img => {
    img.setAttribute('alt', 'Sukoon Resorts Skardu');
  });

  /* === 24. LAZY LOADING FOR GALLERY === */
  document.querySelectorAll('.gallery-item__inner').forEach(inner => {
    const bgImage = inner.style.backgroundImage;
    if (bgImage && bgImage.includes('url')) {
      inner.style.backgroundSize = 'cover';
      inner.style.backgroundPosition = 'center';
    }
  });

})();
