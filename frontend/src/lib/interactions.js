import gsap from 'gsap';
import Lenis from 'lenis';
import { renderIcon } from './icons.js';
import { clamp } from './utils.js';

function getSubmitLabelMarkup(state = 'idle') {
  if (state === 'loading') {
    return 'Sending…';
  }

  if (state === 'success') {
    return 'Message Sent!';
  }

  return `
    Send Message
    ${renderIcon('send', { size: 16, stroke: '#000' })}
  `;
}

function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.4,
    easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.8,
  });

  let animationFrameId = 0;

  function frame(time) {
    lenis.raf(time);
    animationFrameId = window.requestAnimationFrame(frame);
  }

  animationFrameId = window.requestAnimationFrame(frame);

  return {
    lenis,
    destroy() {
      window.cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    },
  };
}

function initHeader(lenis) {
  const headerShell = document.querySelector('.header-shell');
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('.mobile-nav');
  const navLinks = [...document.querySelectorAll('[data-nav-link]')];
  const scrollTopButton = document.querySelector('[data-scroll-top]');
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  let isMenuOpen = false;
  let rafLocked = false;

  function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
      const isActive = link.dataset.section === sectionId;
      link.classList.toggle('is-active', isActive);
    });
  }

  function toggleMenu(forceValue) {
    if (!menuButton || !mobileNav) {
      return;
    }

    isMenuOpen = typeof forceValue === 'boolean' ? forceValue : !isMenuOpen;
    menuButton.setAttribute('aria-expanded', String(isMenuOpen));
    menuButton.classList.toggle('is-open', isMenuOpen);
    mobileNav.classList.toggle('is-open', isMenuOpen);
  }

  function updateHeaderState() {
    const scrollPosition = window.scrollY;

    if (headerShell) {
      headerShell.classList.toggle('is-scrolled', scrollPosition > 40);
    }

    let activeSectionId = '';
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      if (window.scrollY >= section.offsetTop - 120) {
        activeSectionId = section.id;
        break;
      }
    }

    setActiveLink(activeSectionId);
    rafLocked = false;
  }

  function requestHeaderUpdate() {
    if (rafLocked) {
      return;
    }

    rafLocked = true;
    window.requestAnimationFrame(updateHeaderState);
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetSelector = link.getAttribute('href');

      if (!targetSelector?.startsWith('#')) {
        return;
      }

      const target = document.querySelector(targetSelector);

      if (!target) {
        return;
      }

      event.preventDefault();
      toggleMenu(false);
      lenis.scrollTo(target, { offset: -96 });
    });
  });

  scrollTopButton?.addEventListener('click', () => {
    lenis.scrollTo(0);
  });

  menuButton?.addEventListener('click', () => {
    toggleMenu();
  });

  window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
  window.addEventListener('resize', requestHeaderUpdate);
  updateHeaderState();
}

function initRevealAnimations() {
  const revealItems = [...document.querySelectorAll('[data-reveal]')];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const element = entry.target;
        const delay = Number(element.dataset.delay || 0);

        gsap.to(element, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.85,
          delay,
          ease: 'power3.out',
          clearProps: 'transform',
        });

        observer.unobserve(element);
      });
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -80px 0px',
    },
  );

  revealItems.forEach((item) => {
    const direction = item.dataset.reveal || 'up';
    const fromState =
      direction === 'left'
        ? { x: -24, y: 0 }
        : direction === 'right'
          ? { x: 24, y: 0 }
          : { x: 0, y: 48 };

    gsap.set(item, {
      autoAlpha: 0,
      x: fromState.x,
      y: fromState.y,
      filter: 'blur(8px)',
    });

    observer.observe(item);
  });
}

function initTextReveal() {
  const revealNodes = [...document.querySelectorAll('[data-text-reveal]')];

  revealNodes.forEach((node) => {
    const text = node.textContent || '';
    const mode = node.dataset.mode || 'chars';
    const delay = Number(node.dataset.delay || 0);
    const stagger = Number(node.dataset.stagger || 0.03);
    const shouldBlur = node.dataset.blur !== 'false';
    const items = mode === 'words' ? text.split(' ') : [...text];

    node.textContent = '';
    node.style.perspective = '600px';

    const fragments = items.map((item, index) => {
      const span = document.createElement('span');
      span.className = 'inline-block';
      span.style.transformOrigin = 'bottom center';
      span.textContent = mode === 'words'
        ? `${item}${index < items.length - 1 ? '\u00A0' : ''}`
        : item === ' '
          ? '\u00A0'
          : item;
      node.append(span);
      return span;
    });

    gsap.fromTo(
      fragments,
      {
        autoAlpha: 0,
        y: 30,
        rotateX: 20,
        filter: shouldBlur ? 'blur(12px)' : 'none',
      },
      {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        filter: shouldBlur ? 'blur(0px)' : 'none',
        duration: 0.9,
        ease: 'back.out(1.35)',
        stagger,
        delay,
      },
    );
  });
}

function initHeroParallax() {
  const heroSection = document.querySelector('[data-hero]');
  const heroContent = document.querySelector('[data-hero-content]');
  const heroOrbs = document.querySelector('[data-hero-orbs]');

  if (!heroSection || !heroContent || !heroOrbs) {
    return;
  }

  let ticking = false;

  function updateParallax() {
    const rect = heroSection.getBoundingClientRect();
    const totalScrollable = Math.max(rect.height - window.innerHeight, 1);
    const progress = clamp(-rect.top / totalScrollable, 0, 1);

    gsap.set(heroContent, {
      yPercent: progress * 25,
      opacity: 1 - clamp(progress / 0.6, 0, 1),
    });
    gsap.set(heroOrbs, {
      yPercent: progress * -15,
    });

    ticking = false;
  }

  function requestUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateParallax);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  updateParallax();
}

function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  const cursorRoot = document.querySelector('.custom-cursor');
  const ring = document.querySelector('.custom-cursor-ring');
  const dot = document.querySelector('.custom-cursor-dot');

  if (!cursorRoot || !ring || !dot) {
    return;
  }

  const ringX = gsap.quickTo(ring, 'x', { duration: 0.3, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.3, ease: 'power3.out' });
  const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });

  function showCursor() {
    document.body.classList.add('cursor-visible');
  }

  function hideCursor() {
    document.body.classList.remove('cursor-visible', 'cursor-pointer', 'cursor-clicking');
  }

  function onMove(event) {
    showCursor();
    ringX(event.clientX);
    ringY(event.clientY);
    dotX(event.clientX);
    dotY(event.clientY);
  }

  function onOver(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const isInteractive = Boolean(
      target.closest('a, button, [role="button"], input, textarea, select'),
    );

    document.body.classList.toggle('cursor-pointer', isInteractive);
  }

  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseover', onOver);
  window.addEventListener('mousedown', () => document.body.classList.add('cursor-clicking'));
  window.addEventListener('mouseup', () => document.body.classList.remove('cursor-clicking'));
  document.addEventListener('mouseleave', hideCursor);
  document.addEventListener('mouseenter', showCursor);
}

function initMagneticElements() {
  const magneticElements = [...document.querySelectorAll('[data-magnetic]')];

  magneticElements.forEach((element) => {
    element.addEventListener('mousemove', (event) => {
      const rect = element.getBoundingClientRect();
      const offsetX = event.clientX - (rect.left + rect.width / 2);
      const offsetY = event.clientY - (rect.top + rect.height / 2);

      gsap.to(element, {
        x: offsetX * 0.2,
        y: offsetY * 0.2,
        duration: 0.35,
        ease: 'power3.out',
      });
    });

    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.4)',
      });
    });
  });
}

function initProjectCards() {
  const cards = [...document.querySelectorAll('[data-project-card]')];

  cards.forEach((card) => {
    const glow = card.querySelector('.project-card-glow');
    const title = card.querySelector('.project-card-title');
    const border = card.querySelector('.project-card-border');
    const accent = card.dataset.accent || '#ef4444';
    const accentBorder = card.dataset.accentBorder || 'rgba(239,68,68,0.18)';
    const accentShadow = card.dataset.accentShadow || 'rgba(239,68,68,0.12)';
    const accentGlow = card.dataset.accentGlow || 'rgba(239,68,68,0.16)';

    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${accentBorder}, 0 0 40px ${accentShadow}`,
        duration: 0.3,
      });
      gsap.to(title, {
        textShadow: `0 0 20px ${accentShadow}`,
        duration: 0.3,
      });
      gsap.to(border, {
        opacity: 1,
        duration: 0.3,
      });
    });

    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      const glowX = ((event.clientX - rect.left) / rect.width) * 100;
      const glowY = ((event.clientY - rect.top) / rect.height) * 100;

      gsap.to(card, {
        rotateX: offsetY * -8,
        rotateY: offsetX * 8,
        duration: 0.35,
        ease: 'power3.out',
      });

      if (glow) {
        glow.style.opacity = '1';
        glow.style.background = `radial-gradient(circle at ${glowX}% ${glowY}%, ${accentGlow} 0%, transparent 60%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        duration: 0.45,
        ease: 'power3.out',
      });

      gsap.to(title, {
        textShadow: 'none',
        duration: 0.3,
      });

      gsap.to(border, {
        opacity: 0,
        duration: 0.3,
      });

      if (glow) {
        glow.style.opacity = '0';
        glow.style.background = `radial-gradient(circle at 50% 50%, ${accent}00 0%, transparent 60%)`;
      }
    });
  });
}

function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-contact-status]');
  const submitButton = document.querySelector('.contact-submit-button');
  const submitLabel = document.querySelector('[data-submit-label]');
  const errorNodes = [...document.querySelectorAll('[data-field-error]')];

  if (!form || !status || !submitButton || !submitLabel) {
    return;
  }

  function setStatus(state, message) {
    status.textContent = message;
    status.dataset.state = state;
    status.classList.toggle('is-visible', Boolean(message));
  }

  function clearErrors() {
    errorNodes.forEach((node) => {
      node.textContent = '';
    });

    [...form.querySelectorAll('.field-input')].forEach((input) => {
      input.classList.remove('is-error');
    });
  }

  function applyErrors(errors) {
    Object.entries(errors).forEach(([field, message]) => {
      const input = form.querySelector(`[name="${field}"]`);
      const errorNode = form.querySelector(`[data-field-error="${field}"]`);

      input?.classList.add('is-error');

      if (errorNode) {
        errorNode.textContent = message;
      }
    });
  }

  function validatePayload({ name, email, message }) {
    const errors = {};

    if (!name || name.trim().length < 2 || name.trim().length > 80) {
      errors.name = 'Please enter a valid name between 2 and 80 characters.';
    }

    if (!email || email.trim().length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!message || message.trim().length < 10 || message.trim().length > 2500) {
      errors.message = 'Please enter a message between 10 and 2500 characters.';
    }

    return errors;
  }

  function setSubmitting(isSubmitting, state = 'default') {
    submitButton.disabled = isSubmitting;
    submitButton.classList.toggle('is-loading', isSubmitting);
    const nextState = state === 'success' ? 'success' : isSubmitting ? 'loading' : 'idle';
    submitLabel.innerHTML = getSubmitLabelMarkup(nextState);
  }

  [...form.querySelectorAll('.field-input')].forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('is-error');
      const errorNode = form.querySelector(`[data-field-error="${input.name}"]`);

      if (errorNode) {
        errorNode.textContent = '';
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();
    setStatus('', '');

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      message: String(formData.get('message') || '').trim(),
    };

    const clientErrors = validatePayload(payload);

    if (Object.keys(clientErrors).length > 0) {
      applyErrors(clientErrors);
      setStatus('error', 'Please correct the highlighted fields and try again.');
      return;
    }

    setSubmitting(true);
    setStatus('loading', 'Sending your message…');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({
        ok: false,
        message: 'Unexpected server response.',
      }));

      if (!response.ok) {
        if (data.errors) {
          applyErrors(data.errors);
        }

        setStatus('error', data.message || 'The message could not be sent.');
        setSubmitting(false);
        return;
      }

      form.reset();
      clearErrors();
      setStatus('success', data.message || 'Thanks for reaching out. Your message has been sent successfully.');
      setSubmitting(false, 'success');

      window.setTimeout(() => {
        setSubmitting(false);
      }, 4000);
    } catch (error) {
      console.error('Failed to submit contact form', error);
      setStatus('error', 'The message could not be sent right now. Please try again later.');
      setSubmitting(false);
    }
  });
}

export function initPortfolioInteractions() {
  const smoothScroll = initSmoothScroll();

  initHeader(smoothScroll.lenis);
  initTextReveal();
  initRevealAnimations();
  initHeroParallax();
  initCursor();
  initMagneticElements();
  initProjectCards();
  initContactForm();

  return smoothScroll;
}
