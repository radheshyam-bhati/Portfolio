"use strict";

const gsap = window.gsap ?? null;
const Lenis = window.Lenis ?? null;

const sendIcon = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="M22 2 11 13"></path>
    <path d="m22 2-7 20-4-9-9-4 20-7Z"></path>
  </svg>
`;

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

function getSubmitText(state = "idle") {
  if (state === "loading") {
    return "Sending…";
  }

  if (state === "success") {
    return "Message Sent!";
  }

  return `
    Send Message
    ${sendIcon}
  `;
}

function makeScroller() {
  if (!Lenis) {
    return {
      lenis: null,
      scrollTo(target, options = {}) {
        // keep plain smooth scroll working if Lenis doesn't load
        const top =
          typeof target === "number"
            ? target
            : target.getBoundingClientRect().top +
              window.scrollY +
              (options.offset ?? 0);

        window.scrollTo({
          top,
          behavior: "smooth",
        });
      },
      destroy() {},
    };
  }

  const smooth = new Lenis({
    duration: 1.4,
    easing: (value) => Math.min(1, 1.001 - 2 ** (-10 * value)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.8,
  });

  let rafId = 0;

  const tick = (time) => {
    smooth.raf(time);
    rafId = window.requestAnimationFrame(tick);
  };

  rafId = window.requestAnimationFrame(tick);

  return {
    lenis: smooth,
    scrollTo(target, options = {}) {
      smooth.scrollTo(target, options);
    },
    destroy() {
      window.cancelAnimationFrame(rafId);
      smooth.destroy();
    },
  };
}

function wireHeader(scroll) {
  const shell = document.querySelector(".header-shell");
  const menuBtn = document.querySelector("[data-menu-button]");
  const mobileNav = document.querySelector(".mobile-nav");
  const links = [...document.querySelectorAll("[data-nav-link]")];
  const topBtn = document.querySelector("[data-scroll-top]");
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  let menuOpen = false;
  let queued = false;

  function paintActive(sectionId) {
    for (const link of links) {
      link.classList.toggle("is-active", link.dataset.section === sectionId);
    }
  }

  function setMenu(next) {
    if (!menuBtn || !mobileNav) {
      return;
    }

    menuOpen = typeof next === "boolean" ? next : !menuOpen;

    menuBtn.setAttribute("aria-expanded", String(menuOpen));
    menuBtn.classList.toggle("is-open", menuOpen);
    mobileNav.classList.toggle("is-open", menuOpen);
  }

  function syncHeader() {
    const y = window.scrollY;

    if (shell) {
      shell.classList.toggle("is-scrolled", y > 40);
    }

    let current = "";

    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];

      if (y >= section.offsetTop - 120) {
        current = section.id;
        break;
      }
    }

    paintActive(current);
    queued = false;
  }

  function queueHeader() {
    // scroll can get chatty, so keep this on one rAF
    if (queued) {
      return;
    }

    queued = true;
    window.requestAnimationFrame(syncHeader);
  }

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId?.startsWith("#")) {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();
      setMenu(false);
      scroll.scrollTo(target, { offset: -96 });
    });
  });

  topBtn?.addEventListener("click", () => {
    scroll.scrollTo(0);
  });

  menuBtn?.addEventListener("click", () => {
    setMenu();
  });

  window.addEventListener("scroll", queueHeader, { passive: true });
  window.addEventListener("resize", queueHeader);
  syncHeader();
}

function setupReveals() {
  if (!gsap) {
    return;
  }

  const items = [...document.querySelectorAll("[data-reveal]")];
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const el = entry.target;
        const delay = Number(el.dataset.delay || 0);

        gsap.to(el, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          delay,
          ease: "power3.out",
          clearProps: "transform",
        });

        io.unobserve(el);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -80px 0px",
    },
  );

  items.forEach((item) => {
    let from = { x: 0, y: 48 };

    if (item.dataset.reveal === "left") {
      from = { x: -24, y: 0 };
    } else if (item.dataset.reveal === "right") {
      from = { x: 24, y: 0 };
    }

    gsap.set(item, {
      autoAlpha: 0,
      x: from.x,
      y: from.y,
      filter: "blur(8px)",
    });

    io.observe(item);
  });
}

function setupTextReveal() {
  if (!gsap) {
    return;
  }

  const nodes = Array.from(document.querySelectorAll("[data-text-reveal]"));

  nodes.forEach((node) => {
    const text = node.textContent || "";
    const mode = node.dataset.mode || "chars";
    const delay = Number(node.dataset.delay || 0);
    const stagger = Number(node.dataset.stagger || 0.03);
    const blur = node.dataset.blur !== "false";
    const bits = mode === "words" ? text.split(" ") : [...text];

    node.textContent = "";
    node.style.perspective = "600px";

    const spans = bits.map((bit, index) => {
      const span = document.createElement("span");
      span.className = "inline-block";
      span.style.transformOrigin = "bottom center";
      // nbsp keeps the stagger from collapsing spaces.
      span.textContent =
        mode === "words"
          ? `${bit}${index < bits.length - 1 ? "\u00A0" : ""}`
          : bit === " "
            ? "\u00A0"
            : bit;
      node.append(span);
      return span;
    });

    gsap.fromTo(
      spans,
      {
        autoAlpha: 0,
        y: 30,
        rotateX: 20,
        filter: blur ? "blur(12px)" : "none",
      },
      {
        autoAlpha: 1,
        y: 0,
        rotateX: 0,
        filter: blur ? "blur(0px)" : "none",
        duration: 0.9,
        ease: "back.out(1.35)",
        stagger,
        delay,
      },
    );
  });
}

function setupHero() {
  if (!gsap) {
    return;
  }

  const section = document.querySelector("[data-hero]");
  const content = document.querySelector("[data-hero-content]");
  const orbs = document.querySelector("[data-hero-orbs]");

  if (!section || !content || !orbs) {
    return;
  }

  let busy = false;

  function paintHero() {
    const box = section.getBoundingClientRect();
    const maxScroll = Math.max(box.height - window.innerHeight, 1);
    const progress = clamp(-box.top / maxScroll, 0, 1);

    gsap.set(content, {
      yPercent: progress * 25,
      opacity: 1 - clamp(progress / 0.6, 0, 1),
    });
    gsap.set(orbs, {
      yPercent: progress * -15,
    });

    busy = false;
  }

  function queueHero() {
    if (busy) {
      return;
    }

    busy = true;
    window.requestAnimationFrame(paintHero);
  }

  window.addEventListener("scroll", queueHero, { passive: true });
  window.addEventListener("resize", queueHero);
  paintHero();
}

function setupCursor() {
  if (!gsap || window.matchMedia("(pointer: coarse)").matches) {
    return;
  }

  const ring = document.querySelector(".custom-cursor-ring");
  const dot = document.querySelector(".custom-cursor-dot");

  if (!ring || !dot) {
    return;
  }

  const ringX = gsap.quickTo(ring, "x", {
    duration: 0.3,
    ease: "power3.out",
  });
  const ringY = gsap.quickTo(ring, "y", {
    duration: 0.3,
    ease: "power3.out",
  });
  const dotX = gsap.quickTo(dot, "x", {
    duration: 0.12,
    ease: "power3.out",
  });
  const dotY = gsap.quickTo(dot, "y", {
    duration: 0.12,
    ease: "power3.out",
  });

  const showCursor = () => document.body.classList.add("cursor-visible");
  const hideCursor = () => {
    document.body.classList.remove(
      "cursor-visible",
      "cursor-pointer",
      "cursor-clicking",
    );
  };

  function handleMove(event) {
    showCursor();
    ringX(event.clientX);
    ringY(event.clientY);
    dotX(event.clientX);
    dotY(event.clientY);
  }

  function handleHover(event) {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const isInteractive = Boolean(
      target.closest("a, button, [role=\"button\"], input, textarea, select"),
    );

    document.body.classList.toggle("cursor-pointer", isInteractive);
  }

  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseover", handleHover);
  window.addEventListener("mousedown", () => {
    document.body.classList.add("cursor-clicking");
  });
  window.addEventListener("mouseup", () => {
    document.body.classList.remove("cursor-clicking");
  });
  document.addEventListener("mouseleave", hideCursor);
  document.addEventListener("mouseenter", showCursor);
}

function setupMagnet() {
  if (!gsap) {
    return;
  }

  const items = document.querySelectorAll("[data-magnetic]");

  for (const item of items) {
    item.addEventListener("mousemove", (event) => {
      const box = item.getBoundingClientRect();
      const offsetX = event.clientX - (box.left + box.width / 2);
      const offsetY = event.clientY - (box.top + box.height / 2);

      gsap.to(item, {
        x: offsetX * 0.2,
        y: offsetY * 0.2,
        duration: 0.35,
        ease: "power3.out",
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: "elastic.out(1, 0.4)",
      });
    });
  }
}

function setupCards() {
  if (!gsap) {
    return;
  }

  const cards = [...document.querySelectorAll("[data-project-card]")];

  cards.forEach((card) => {
    const glow = card.querySelector(".project-card-glow");
    const title = card.querySelector(".project-card-title");
    const line = card.querySelector(".project-card-border");
    const accent = card.dataset.accent || "#ef4444";
    const accentBorder = card.dataset.accentBorder || "rgba(239,68,68,0.18)";
    const accentShadow = card.dataset.accentShadow || "rgba(239,68,68,0.12)";
    const accentGlow = card.dataset.accentGlow || "rgba(239,68,68,0.16)";

    card.addEventListener("mouseenter", () => {
      gsap.to(card, {
        boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${accentBorder}, 0 0 40px ${accentShadow}`,
        duration: 0.3,
      });
      gsap.to(title, {
        textShadow: `0 0 20px ${accentShadow}`,
        duration: 0.3,
      });
      gsap.to(line, {
        opacity: 1,
        duration: 0.3,
      });
    });

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      const glowX = ((event.clientX - rect.left) / rect.width) * 100;
      const glowY = ((event.clientY - rect.top) / rect.height) * 100;

      gsap.to(card, {
        rotateX: offsetY * -8,
        rotateY: offsetX * 8,
        duration: 0.35,
        ease: "power3.out",
      });

      if (glow) {
        glow.style.opacity = "1";
        glow.style.background =
          `radial-gradient(circle at ${glowX}% ${glowY}%, ` +
          `${accentGlow} 0%, transparent 60%)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        duration: 0.45,
        ease: "power3.out",
      });

      gsap.to(title, {
        textShadow: "none",
        duration: 0.3,
      });

      gsap.to(line, {
        opacity: 0,
        duration: 0.3,
      });

      if (glow) {
        glow.style.opacity = "0";
        glow.style.background = `radial-gradient(circle at 50% 50%, ${accent}00 0%, transparent 60%)`;
      }
    });
  });
}

function setupContact() {
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-contact-status]");
  const btn = document.querySelector(".contact-submit-button");
  const label = document.querySelector("[data-submit-label]");
  const errorNodes = [...document.querySelectorAll("[data-field-error]")];

  if (!form || !status || !btn || !label) {
    return;
  }

  const fields = [...form.querySelectorAll(".field-input")];

  function showStatus(state, message) {
    status.textContent = message;
    status.dataset.state = state;
    status.classList.toggle("is-visible", Boolean(message));
  }

  function clearErrors() {
    errorNodes.forEach((node) => {
      node.textContent = "";
    });

    fields.forEach((input) => {
      input.classList.remove("is-error");
    });
  }

  function paintErrors(errors) {
    Object.entries(errors).forEach(([field, text]) => {
      const input = form.querySelector(`[name="${field}"]`);
      const errorNode = form.querySelector(`[data-field-error="${field}"]`);

      input?.classList.add("is-error");

      if (errorNode) {
        errorNode.textContent = text;
      }
    });
  }

  function validate(values) {
    const errors = {};
    const { name, email, message } = values;

    if (!name || name.trim().length < 2 || name.trim().length > 80) {
      errors.name =
        "Please enter a valid name between 2 and 80 characters.";
    }

    if (
      !email ||
      email.trim().length > 120 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      errors.email = "Please enter a valid email address.";
    }

    if (
      !message ||
      message.trim().length < 10 ||
      message.trim().length > 2500
    ) {
      errors.message =
        "Please enter a message between 10 and 2500 characters.";
    }

    return errors;
  }

  function setBusy(isSubmitting, state = "default") {
    btn.disabled = isSubmitting;
    btn.classList.toggle("is-loading", isSubmitting);
    const nextState =
      state === "success" ? "success" : isSubmitting ? "loading" : "idle";
    label.innerHTML = getSubmitText(nextState);
  }

  fields.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("is-error");
      const errorNode = form.querySelector(`[data-field-error="${input.name}"]`);

      if (errorNode) {
        errorNode.textContent = "";
      }
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();
    showStatus("", "");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    const clientErrors = validate(payload);

    if (Object.keys(clientErrors).length > 0) {
      paintErrors(clientErrors);
      showStatus(
        "error",
        "Please correct the highlighted fields and try again.",
      );
      return;
    }

    setBusy(true);
    showStatus("loading", "Sending your message…");

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/radheshyambhati7451@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: payload.name,
            email: payload.email,
            message: payload.message,
            _subject: `New portfolio contact from ${payload.name}`,
          }),
        },
      );

      // FormSubmit sometimes gives back junk when it isn't happy.
      const data = await response.json().catch(() => ({
        success: false,
        message: "Unexpected server response.",
      }));

      if (!response.ok) {
        if (data.errors) {
          paintErrors(data.errors);
        }

        showStatus("error", data.message || "The message could not be sent.");
        setBusy(false);
        return;
      }

      form.reset();
      clearErrors();
      showStatus(
        "success",
        data.message ||
          "Thanks for reaching out. Your message has been sent successfully.",
      );
      setBusy(false, "success");

      window.setTimeout(() => {
        setBusy(false);
      }, 4000);
    } catch (error) {
      console.error("Failed to submit contact form", error);
      showStatus(
        "error",
        "The message could not be sent right now. Please try again later.",
      );
      setBusy(false);
    }
  });
}

function bootPage() {
  const scroll = makeScroller();

  wireHeader(scroll);
  setupTextReveal();
  setupReveals();
  setupHero();
  setupCursor();
  setupMagnet();
  setupCards();
  setupContact();

  return scroll;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootPage, {
    once: true,
  });
} else {
  bootPage();
}
