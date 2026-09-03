/**
 * Portfolio — Main JavaScript
 * Handles: Theme toggle, Smooth scroll, Scroll reveal, Mobile menu, Form validation
 */

(function () {
  'use strict';

  // ==========================================
  // Theme Toggle (Dark / Light Mode)
  // ==========================================
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  function getPreferredTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }

  setTheme(getPreferredTheme());

  themeToggle?.addEventListener('click', () => {
    const isDark = html.classList.contains('dark');
    setTheme(isDark ? 'light' : 'dark');
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ==========================================
  // Smooth Scroll for Anchor Links
  // ==========================================
  function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (!element) return;

    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
    const targetPosition = element.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      smoothScrollTo(href);

      // Close mobile menu after navigation
      closeMobileMenu();
    });
  });

  // ==========================================
  // Navbar Scroll Effect
  // ==========================================
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ==========================================
  // Active Nav Link on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    const scrollPos = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavLink, { passive: true });

  // ==========================================
  // Scroll Reveal Animation (Intersection Observer)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ==========================================
  // Mobile Menu Toggle
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconMenu = document.getElementById('icon-menu');
  const iconClose = document.getElementById('icon-close');

  function closeMobileMenu() {
    mobileMenu?.classList.add('hidden');
    iconMenu?.classList.remove('hidden');
    iconClose?.classList.add('hidden');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
  }

  function openMobileMenu() {
    mobileMenu?.classList.remove('hidden');
    iconMenu?.classList.add('hidden');
    iconClose?.classList.remove('hidden');
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
  }

  mobileMenuBtn?.addEventListener('click', () => {
    const isOpen = !mobileMenu?.classList.contains('hidden');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  document.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // ==========================================
  // Contact Form Validation (UI only)
  // ==========================================
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = contactForm.querySelectorAll('.form-input');
    let isValid = true;

    fields.forEach((field) => {
      field.classList.remove('error');

      if (!field.value.trim()) {
        field.classList.add('error');
        isValid = false;
      }

      if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          field.classList.add('error');
          isValid = false;
        }
      }
    });

    if (isValid) {
      formSuccess?.classList.remove('hidden');
      contactForm.reset();

      setTimeout(() => {
        formSuccess?.classList.add('hidden');
      }, 5000);
    }
  });

  // Remove error state on input
  contactForm?.querySelectorAll('.form-input').forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('error');
    });
  });

})();
