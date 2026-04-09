import {
  navLinks,
  hero,
  aboutStats,
  milestones,
  skillGroups,
  projects,
  education,
  certifications,
  contactInfo,
} from '../data/portfolio.js';
import { renderIcon } from './icons.js';
import { escapeHtml, hexToRgba } from './utils.js';

function renderSectionHeading(number, title) {
  return `
    <h2
      class="text-3xl md:text-4xl font-bold mb-16 flex items-center tracking-tight text-white"
      data-reveal="up"
    >
      <span class="mr-4 font-light text-2xl" style="color: var(--color-neon-blue); opacity: 0.8;">${escapeHtml(number)}.</span>
      ${escapeHtml(title)}
      <span class="flex-1 h-px ml-8" style="background: linear-gradient(to right, rgba(255,255,255,0.08), transparent);"></span>
    </h2>
  `;
}

function renderMilestoneContent(content) {
  if (Array.isArray(content)) {
    return `
      <div class="space-y-3 text-gray-400 text-sm md:text-base">
        ${content
          .map(
            (item) => `
              <div class="flex items-start gap-3 leading-relaxed">
                <span class="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style="background: var(--color-neon-blue);"></span>
                <span>${escapeHtml(item)}</span>
              </div>
            `,
          )
          .join('')}
      </div>
    `;
  }

  return `<p class="text-gray-400 leading-relaxed text-sm md:text-base">${escapeHtml(content)}</p>`;
}

function renderNavLinksMarkup(isMobile = false) {
  return navLinks
    .map(
      (link) => `
        <a
          href="${escapeHtml(link.href)}"
          class="${isMobile ? 'block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 text-[rgba(200,200,200,0.9)]' : 'nav-link relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 text-[rgba(180,180,180,0.8)]'}"
          data-nav-link
          data-section="${escapeHtml(link.href.slice(1))}"
        >
          ${
            isMobile
              ? ''
              : '<span class="nav-link-indicator absolute inset-0 rounded-lg"></span>'
          }
          <span class="relative z-10">${escapeHtml(link.label)}</span>
        </a>
      `,
    )
    .join('');
}

function renderSkillsMarkup() {
  return skillGroups
    .map(
      (group, index) => `
        <div data-reveal="up" data-delay="${(index * 0.1).toFixed(2)}">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-2 h-2 rounded-full" style="background: ${group.color}; box-shadow: 0 0 8px ${group.color};"></div>
            <span class="text-xs uppercase tracking-widest font-semibold" style="color: ${group.color}; opacity: 0.9;">${escapeHtml(group.category)}</span>
            <div class="flex-1 h-px" style="background: linear-gradient(to right, ${hexToRgba(group.color, 0.3)}, transparent);"></div>
          </div>
          <div class="flex flex-wrap gap-3">
            ${group.skills
              .map(
                (skill) => `
                  <div class="skill-pill px-5 py-2.5 rounded-full border text-sm font-medium text-gray-300" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08);">
                    <span class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full inline-block" style="background: ${group.color}; box-shadow: 0 0 6px ${group.color};"></span>
                      ${escapeHtml(skill)}
                    </span>
                  </div>
                `,
              )
              .join('')}
          </div>
        </div>
      `,
    )
    .join('');
}

function renderProjectsMarkup() {
  return projects
    .map((project, index) => {
      const accent = project.accentColor;
      const projectLinks = [
        project.liveLink
          ? {
              href: project.liveLink,
              icon: 'arrowUpRight',
              label: 'Open live app',
            }
          : project.link
            ? {
                href: project.link,
                icon: 'arrowUpRight',
                label: 'Open project link',
              }
            : null,
        project.repoLink
          ? {
              href: project.repoLink,
              icon: 'github',
              label: 'Open GitHub repository',
            }
          : null,
      ].filter(Boolean);

      return `
        <article class="project-card" data-reveal="up" data-delay="${(index * 0.15).toFixed(2)}">
          <div
            class="project-card-shell relative rounded-2xl overflow-hidden h-full"
            data-project-card
            data-accent="${accent}"
            data-accent-border="${hexToRgba(accent, 0.18)}"
            data-accent-shadow="${hexToRgba(accent, 0.12)}"
            data-accent-glow="${hexToRgba(accent, 0.16)}"
            style="background: rgba(12, 12, 12, 0.9); border: 1px solid rgba(255,255,255,0.06); box-shadow: 0 8px 32px rgba(0,0,0,0.4); backdrop-filter: blur(20px);"
          >
            <div class="project-card-glow absolute inset-0 rounded-2xl pointer-events-none"></div>
            <div class="relative z-10 p-8 flex flex-col h-full" style="transform: translateZ(20px);">
              <div class="flex items-center justify-between mb-6">
                <span
                  class="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full"
                  style="color: ${accent}; background: ${hexToRgba(accent, 0.12)}; border: 1px solid ${hexToRgba(accent, 0.2)};"
                >
                  ${escapeHtml(project.type)}
                </span>
                ${
                  projectLinks.length
                    ? `
                      <div class="flex items-center gap-2">
                        ${projectLinks
                          .map(
                            ({ href, icon, label }) => `
                              <a
                                href="${escapeHtml(href)}"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="${escapeHtml(label)}"
                                title="${escapeHtml(label)}"
                                class="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300"
                                style="border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.5);"
                              >
                                ${renderIcon(icon, { size: 14 })}
                              </a>
                            `,
                          )
                          .join('')}
                      </div>
                    `
                    : ''
                }
              </div>
              <h3 class="text-2xl font-bold text-white mb-4 leading-tight project-card-title transition-all duration-300">
                ${escapeHtml(project.title)}
              </h3>
              <p class="text-gray-400 leading-relaxed text-sm mb-8 flex-1 font-light">
                ${escapeHtml(project.description)}
              </p>
              <div class="flex flex-wrap gap-2">
                ${project.tech
                  .map(
                    (tech) => `
                      <span class="text-xs px-3 py-1 rounded-full font-mono border" style="color: rgba(200,200,200,0.7); border-color: rgba(255,255,255,0.07); background: rgba(255,255,255,0.03);">
                        ${escapeHtml(tech)}
                      </span>
                    `,
                  )
                  .join('')}
              </div>
            </div>
            <div
              class="absolute bottom-0 left-0 right-0 h-px project-card-border transition-opacity duration-500 opacity-0"
              style="background: linear-gradient(to right, transparent, ${hexToRgba(accent, 0.5)}, transparent);"
            ></div>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderEducationMarkup() {
  return education
    .map(
      (item, index) => `
        <div data-reveal="up" data-delay="${(index * 0.15).toFixed(2)}">
          <div class="relative pl-16 md:pl-20">
            <div
              class="absolute left-3.5 top-2 w-5 h-5 rounded-full border-2 flex items-center justify-center md:left-5.5"
              style="border-color: var(--color-neon-blue); background: #050505; box-shadow: 0 0 12px rgba(239, 68, 68, 0.4), 0 0 25px rgba(239, 68, 68, 0.1);"
            >
              <div class="w-2 h-2 rounded-full" style="background: var(--color-neon-blue);"></div>
            </div>
            <div class="timeline-card rounded-2xl p-6 md:p-8 border transition-all duration-300 group" style="background: rgba(12, 12, 12, 0.8); backdrop-filter: blur(20px); border-color: rgba(255,255,255,0.06);">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div>
                  <h3 class="text-xl font-bold text-white mb-1">${escapeHtml(item.institution)}</h3>
                  <h4 class="text-base font-medium" style="color: var(--color-neon-blue);">${escapeHtml(item.degree)}</h4>
                </div>
                ${
                  item.status === 'current'
                    ? `
                      <span
                        class="self-start px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1"
                        style="background: rgba(239, 68, 68, 0.1); color: var(--color-neon-blue); border: 1px solid rgba(239, 68, 68, 0.2);"
                      >
                        <span class="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style="background: var(--color-neon-blue);"></span>
                        Active
                      </span>
                    `
                    : ''
                }
              </div>
              <div class="flex flex-wrap gap-4 mb-4 text-sm text-gray-500">
                <span class="flex items-center gap-1.5">
                  ${renderIcon('calendar', { size: 13 })}
                  ${escapeHtml(item.period)}
                </span>
                <span class="flex items-center gap-1.5">
                  ${renderIcon('mapPin', { size: 13 })}
                  ${escapeHtml(item.location)}
                </span>
              </div>
              <p class="text-gray-400 text-sm leading-relaxed">${escapeHtml(item.description)}</p>
            </div>
          </div>
        </div>
      `,
    )
    .join('');
}

function renderCertificationsMarkup() {
  return certifications
    .map(
      (cert, index) => `
        <div data-reveal="up" data-delay="${(index * 0.1).toFixed(2)}">
          <article
            class="accent-card relative rounded-2xl p-7 border flex flex-col items-center text-center group overflow-hidden"
            style="--accent: ${cert.color}; --accent-border: ${hexToRgba(cert.color, 0.18)}; --accent-soft: ${hexToRgba(cert.color, 0.15)}; --accent-glow: ${hexToRgba(cert.color, 0.16)}; background: rgba(12, 12, 12, 0.8); backdrop-filter: blur(20px); border-color: rgba(255,255,255,0.06);"
          >
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style="background: radial-gradient(circle, ${hexToRgba(cert.color, 0.18)}, transparent); filter: blur(20px); top: -20px;"></div>
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10 transition-transform duration-300 group-hover:scale-110" style="background: ${hexToRgba(cert.color, 0.15)}; border: 1px solid ${hexToRgba(cert.color, 0.25)};">
              ${renderIcon(cert.icon, { size: 26, stroke: cert.color, strokeWidth: 1.9 })}
            </div>
            <h3 class="text-base font-bold text-white mb-2 relative z-10 leading-snug">${escapeHtml(cert.title)}</h3>
            <p class="text-xs font-medium mb-2 relative z-10" style="color: ${cert.color}; opacity: 0.9;">${escapeHtml(cert.org)}</p>
            <span class="text-xs text-gray-600 font-mono relative z-10">${escapeHtml(cert.detail)}</span>
            <div class="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background: linear-gradient(to right, transparent, ${hexToRgba(cert.color, 0.5)}, transparent);"></div>
          </article>
        </div>
      `,
    )
    .join('');
}

function renderContactItemsMarkup() {
  return contactInfo
    .map((item) => {
      const icon = renderIcon(item.icon, { size: 18, stroke: item.color });
      const externalAttributes = item.href.startsWith('http')
        ? ' target="_blank" rel="noopener noreferrer"'
        : '';
      const content = `
        <div class="accent-link-icon w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 flex-shrink-0" style="--accent: ${item.color}; --accent-border: ${hexToRgba(item.color, 0.25)}; --accent-soft: ${hexToRgba(item.color, 0.1)};">
          ${icon}
        </div>
        <div>
          <div class="text-xs text-gray-600 uppercase tracking-widest mb-0.5">${escapeHtml(item.label)}</div>
          <div class="text-gray-300 text-sm font-medium transition-colors duration-300">${escapeHtml(item.value)}</div>
        </div>
      `;

      return item.href
        ? `
            <a href="${escapeHtml(item.href)}"${externalAttributes} class="flex items-center gap-4 group">
              ${content}
            </a>
          `
        : `
            <div class="flex items-center gap-4">
              ${content}
            </div>
          `;
    })
    .join('');
}

export function renderPortfolioApp() {
  return `
    <div class="fixed inset-0 z-[-1] bg-[#050505] overflow-hidden">
      <div class="absolute inset-0 pointer-events-none animate-grid-shimmer" style="background-size: 60px 60px; background-image: linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);"></div>
      <div class="absolute pointer-events-none" style="top: 5%; left: 50%; transform: translateX(-50%); width: 700px; height: 500px; background: radial-gradient(ellipse, rgba(220, 38, 38, 0.12) 0%, transparent 70%); filter: blur(60px);"></div>
      <div class="absolute rounded-full animate-orb-float pointer-events-none" style="top: 15%; right: 10%; width: 420px; height: 420px; background: radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, rgba(185, 28, 28, 0.06) 50%, transparent 70%); filter: blur(80px);"></div>
      <div class="absolute rounded-full animate-orb-float-reverse pointer-events-none" style="bottom: 20%; left: 5%; width: 380px; height: 380px; background: radial-gradient(circle, rgba(248, 113, 113, 0.12) 0%, rgba(220, 38, 38, 0.04) 50%, transparent 70%); filter: blur(70px); animation-delay: -4s;"></div>
      <div class="absolute rounded-full animate-orb-float pointer-events-none" style="top: 40%; left: 25%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(153, 27, 27, 0.08) 0%, transparent 70%); filter: blur(60px); animation-delay: -2s;"></div>
      <div class="absolute inset-0 pointer-events-none opacity-[0.025]" style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E&quot;); background-size: 128px 128px;"></div>
      <div class="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none"></div>
      <div class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none"></div>
    </div>

    <div class="custom-cursor fixed inset-0 pointer-events-none z-[9999]" aria-hidden="true">
      <div class="custom-cursor-ring"></div>
      <div class="custom-cursor-dot"></div>
    </div>

    <header class="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
      <div class="header-shell w-full max-w-5xl flex justify-between items-center px-5 py-3 rounded-2xl border transition-all duration-500">
        <button type="button" data-scroll-top class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white font-mono transition-all duration-300 group-hover:scale-105" style="background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);">
            &lt;/&gt;
          </div>
          <span class="font-bold text-white tracking-tight">${escapeHtml(`${hero.firstName} ${hero.lastName}`)}</span>
        </button>

        <nav class="hidden md:flex items-center gap-1">
          ${renderNavLinksMarkup()}
        </nav>

        <div class="flex items-center gap-3">
          <div data-magnetic class="hidden md:block">
            <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer" class="inline-flex px-5 py-2 text-sm font-semibold text-black rounded-xl transition-all duration-300 primary-glow-button" style="background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);">
              Resume
            </a>
          </div>
          <button
            type="button"
            class="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
            data-menu-button
            aria-expanded="false"
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
          >
            <span class="menu-line menu-line-top block w-5 h-px bg-white transition-all duration-300"></span>
            <span class="menu-line menu-line-bottom block h-px bg-white transition-all duration-300 w-4"></span>
          </button>
        </div>
      </div>
    </header>

    <div
      id="mobile-navigation"
      class="mobile-nav fixed top-[72px] left-4 right-4 z-40 rounded-2xl border p-4 space-y-1"
      style="background: rgba(8,8,8,0.95); backdrop-filter: blur(24px); border-color: rgba(239, 68, 68, 0.1);"
    >
      ${renderNavLinksMarkup(true)}
      <a href="/Resume.pdf" target="_blank" rel="noopener noreferrer" class="block px-4 py-3 rounded-xl text-sm font-semibold text-black text-center mt-2" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
        Resume
      </a>
    </div>

    <main class="min-h-screen bg-transparent relative z-0">
      <section class="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden" id="hero" data-hero>
        <div class="absolute inset-0 pointer-events-none hero-orbs" data-hero-orbs>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 animate-spin-slow" style="background: conic-gradient(from 0deg, transparent 60%, rgba(239, 68, 68, 0.3) 80%, transparent 100%); filter: blur(2px);"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10" style="background: radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, transparent 70%);"></div>
        </div>
        <div class="max-w-4xl mx-auto px-6 w-full z-10 flex flex-col items-center text-center hero-content" data-hero-content>
          <div class="relative mb-8" data-reveal="up" data-delay="0.10">
            <div class="absolute inset-0 rounded-full animate-pulse-glow"></div>
            <div class="absolute -inset-3 rounded-full profile-ring opacity-40" style="background: conic-gradient(from 0deg, transparent 40%, rgba(239, 68, 68, 0.6) 60%, rgba(248, 113, 113, 0.4) 80%, transparent 100%);"></div>
            <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 relative z-10" style="border-color: rgba(239, 68, 68, 0.3); box-shadow: 0 0 40px rgba(239, 68, 68, 0.25), 0 0 80px rgba(239, 68, 68, 0.1);">
              <img src="/image.png" alt="Radheshyam Bhati" class="w-full h-full object-cover" />
            </div>
          </div>

          <div class="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 rounded-full bg-white/[0.03] text-gray-400 text-xs uppercase tracking-widest font-medium mb-6" style="backdrop-filter: blur(10px);" data-reveal="up" data-delay="0.25">
            ${renderIcon('mapPin', { size: 11, className: 'text-[var(--color-neon-blue)]' })}
            ${escapeHtml(hero.location)}
          </div>

          <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold leading-none tracking-tight text-white mb-4">
            <span class="block" data-text-reveal data-mode="chars" data-delay="0.35" data-stagger="0.04">${escapeHtml(hero.firstName)}</span>
            <span class="block text-white" data-text-reveal data-mode="chars" data-delay="0.6" data-stagger="0.06">${escapeHtml(hero.lastName)}</span>
          </h1>

          <p class="text-lg md:text-xl text-gray-400 font-light tracking-wide mb-10 max-w-lg" data-reveal="up" data-delay="1.10">
            ${escapeHtml(hero.subtitle)}
          </p>

          <div class="flex flex-col sm:flex-row items-center gap-4" data-reveal="up" data-delay="1.30">
            <div data-magnetic>
              <a href="#projects" class="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 relative overflow-hidden primary-glow-button" style="background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 0 30px rgba(239, 68, 68, 0.3), 0 4px 20px rgba(239, 68, 68, 0.2);">
                View Work
                ${renderIcon('arrowRight', { size: 18, className: 'transition-transform duration-300 group-hover:translate-x-1' })}
              </a>
            </div>
            <div data-magnetic>
              <a href="#contact" class="group flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-[var(--color-neon-blue)] border transition-all duration-300 secondary-button" style="border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.05);">
                Contact Me
                ${renderIcon('sparkles', { size: 18, className: 'transition-transform duration-300 group-hover:rotate-12' })}
              </a>
            </div>
          </div>

          <div class="mt-20 flex flex-col items-center gap-2 opacity-40" data-reveal="up" data-delay="1.60">
            <span class="text-xs tracking-widest uppercase text-gray-500">Scroll</span>
            <div class="w-px h-12 bg-gradient-to-b from-[var(--color-neon-blue)] to-transparent"></div>
          </div>
        </div>
      </section>

      <section class="py-32 relative z-10" id="about">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          ${renderSectionHeading('01', 'About me')}
          <div class="grid md:grid-cols-2 gap-16 items-start">
            <div class="space-y-5 text-lg leading-relaxed text-gray-400 font-light" data-reveal="up" data-delay="0.10">
              <p>I'm a <span class="text-white font-medium">Computer Science &amp; Engineering student</span> focused on building practical AI and cybersecurity products that solve real user problems.</p>
              <p>Currently studying at <span class="font-medium" style="color: var(--color-neon-blue);">PW Institute of Innovation</span>, Pune, while sharpening product thinking, fast iteration, and technical communication.</p>
              <div class="flex gap-8 pt-4">
                ${aboutStats
                  .map(
                    (stat) => `
                      <div>
                        <div class="text-3xl font-bold" style="background: linear-gradient(135deg, #ef4444, #dc2626); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                          ${escapeHtml(stat.value)}
                        </div>
                        <div class="text-xs text-gray-500 uppercase tracking-widest mt-1">${escapeHtml(stat.label)}</div>
                      </div>
                    `,
                  )
                  .join('')}
              </div>
            </div>

            <div class="relative pl-8 space-y-10">
              <div class="absolute top-0 bottom-0 left-0 w-px" style="background: linear-gradient(to bottom, var(--color-neon-blue), rgba(248,113,113,0.3), transparent);"></div>
              ${milestones
                .map(
                  (milestone, index) => `
                    <div class="relative group" data-reveal="up" data-delay="${(index * 0.12).toFixed(2)}">
                      <div class="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-2 transition-all duration-300 group-hover:scale-125" style="background: #050505; border-color: var(--color-neon-blue); box-shadow: 0 0 10px rgba(239, 68, 68, 0.3);"></div>
                      <span class="inline-block text-xs font-mono mb-2 px-2 py-0.5 rounded" style="color: var(--color-neon-blue); background: rgba(239, 68, 68, 0.08);">
                        ${escapeHtml(milestone.year)}
                      </span>
                      <h3 class="text-xl font-semibold text-white mb-2">${escapeHtml(milestone.title)}</h3>
                      ${renderMilestoneContent(milestone.content)}
                    </div>
                  `,
                )
                .join('')}
            </div>
          </div>
        </div>
      </section>

      <section class="py-32 relative z-10" id="skills">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          ${renderSectionHeading('02', 'Technical Skills')}
          <div class="space-y-12">
            ${renderSkillsMarkup()}
          </div>
        </div>
      </section>

      <section class="py-32 relative z-10" id="projects">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          ${renderSectionHeading('03', 'Projects')}
          <div class="grid md:grid-cols-2 gap-6">
            ${renderProjectsMarkup()}
          </div>
        </div>
      </section>

      <section class="py-32 relative z-10" id="education">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          ${renderSectionHeading('04', 'Education')}
          <div class="relative">
            <div class="absolute left-6 top-4 bottom-4 w-px md:left-8" style="background: linear-gradient(to bottom, var(--color-neon-blue), rgba(248,113,113,0.3), transparent);"></div>
            <div class="space-y-12">
              ${renderEducationMarkup()}
            </div>
          </div>
        </div>
      </section>

      <section class="py-24 relative z-10" id="certifications">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          ${renderSectionHeading('05', 'Certifications & Training')}
          <div class="grid md:grid-cols-3 gap-6">
            ${renderCertificationsMarkup()}
          </div>
        </div>
      </section>

      <section class="py-32 relative z-10" id="contact">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          ${renderSectionHeading('06', "Let's Connect")}
          <div class="grid md:grid-cols-2 gap-16 items-start">
            <div data-reveal="up" data-delay="0.10">
              <p class="text-gray-400 text-lg leading-relaxed font-light mb-10">
                I'm looking for internships and builder-focused opportunities where I can contribute across <span class="text-white font-medium">AI, cybersecurity, full-stack development, and product execution.</span>
              </p>
              <div class="space-y-6">
                ${renderContactItemsMarkup()}
              </div>
              <div class="mt-10 flex items-center gap-3 px-5 py-3 rounded-xl border w-fit" style="background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.15);">
                <span class="w-2 h-2 rounded-full animate-pulse" style="background: #22c55e; box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);"></span>
                <span class="text-sm text-gray-400">Available for <span class="text-white font-medium">internships &amp; product-building roles</span></span>
              </div>
            </div>

            <div data-reveal="up" data-delay="0.20">
              <div class="rounded-2xl p-7 md:p-8 border relative overflow-hidden contact-panel" style="background: rgba(10, 10, 10, 0.9); backdrop-filter: blur(24px); border-color: rgba(255,255,255,0.06); box-shadow: 0 24px 60px rgba(0,0,0,0.4);">
                <div class="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(239,68,68,0.08), transparent); filter: blur(40px);"></div>
                <form class="space-y-5 relative z-10" data-contact-form novalidate>
                  <div class="contact-status" data-contact-status role="status" aria-live="polite"></div>

                  <div class="form-field">
                    <label for="contact-name" class="block text-xs uppercase tracking-widest font-semibold mb-2" style="color: rgba(140,140,140,0.8);">Your Name</label>
                    <input id="contact-name" name="name" type="text" class="field-input" placeholder="Radheshyam Bhati" autocomplete="name" />
                    <p class="field-error" data-field-error="name"></p>
                  </div>

                  <div class="form-field">
                    <label for="contact-email" class="block text-xs uppercase tracking-widest font-semibold mb-2" style="color: rgba(140,140,140,0.8);">Email Address</label>
                    <input id="contact-email" name="email" type="email" class="field-input" placeholder="you@example.com" autocomplete="email" />
                    <p class="field-error" data-field-error="email"></p>
                  </div>

                  <div class="form-field">
                    <label for="contact-message" class="block text-xs uppercase tracking-widest font-semibold mb-2" style="color: rgba(140,140,140,0.8);">Message</label>
                    <textarea id="contact-message" name="message" rows="5" class="field-input field-textarea" placeholder="How can we build the future together?"></textarea>
                    <p class="field-error" data-field-error="message"></p>
                  </div>

                  <div data-magnetic class="w-full">
                    <button type="submit" class="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 relative overflow-hidden contact-submit-button" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: #000; box-shadow: 0 0 24px rgba(239,68,68,0.25);">
                      <span data-submit-label class="flex items-center gap-2">
                        Send Message
                        ${renderIcon('send', { size: 16, stroke: '#000' })}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <footer class="mt-24 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600" style="border-color: rgba(255,255,255,0.05);">
            <p>© ${new Date().getFullYear()} Radheshyam Bhati. All rights reserved.</p>
            <div class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background: var(--color-neon-blue);"></span>
              <span style="color: var(--color-neon-blue);">SYS_STATUS: ONLINE</span>
            </div>
          </footer>
        </div>
      </section>
    </main>
  `;
}
