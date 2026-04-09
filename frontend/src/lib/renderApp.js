import {
  navLinks,
  hero,
  aboutStats,
  milestones,
  skillGroups,
  projects,
  lookingFor,
  education,
  certifications,
  contactInfo,
} from '../data/portfolio.js';
import { renderIcon } from './icons.js';
import { escapeHtml, hexToRgba, resolveAssetUrl } from './utils.js';

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

function renderSectionIntro(copy) {
  return `
    <p class="section-intro max-w-2xl text-sm md:text-base text-slate-400 leading-relaxed mb-14" data-reveal="up" data-delay="0.08">
      ${escapeHtml(copy)}
    </p>
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
              label: project.liveLabel || 'Live demo',
            }
          : null,
        project.repoLink
          ? {
              href: project.repoLink,
              icon: 'github',
              label: project.repoLabel || 'Repository',
            }
          : null,
      ].filter(Boolean);

      const previewMarkup =
        project.mockup?.type === 'finance'
          ? `
              <div class="project-preview-card project-preview-finance" data-project-preview-media>
                <div class="project-preview-phone">
                  <div class="project-preview-screen">
                    <div class="project-preview-kicker">${escapeHtml(project.mockup.title || 'AI Finance')}</div>
                    <div class="project-preview-phone-balance">
                      <span>Monthly snapshot</span>
                      <strong>₹ 18,400</strong>
                    </div>
                    <div class="project-preview-chip-row">
                      ${(project.mockup.meta || [])
                        .map(
                          (item) => `
                            <span class="project-preview-chip">${escapeHtml(item)}</span>
                          `,
                        )
                        .join('')}
                    </div>
                    <div class="project-preview-stack">
                      <div class="project-preview-card-mini">
                        <span>Budget status</span>
                        <strong>Adaptive budget ready</strong>
                      </div>
                      <div class="project-preview-card-mini">
                        <span>Alert</span>
                        <strong>Food spending spike</strong>
                      </div>
                      <div class="project-preview-bars">
                        <span style="height: 44%;"></span>
                        <span style="height: 72%;"></span>
                        <span style="height: 58%;"></span>
                        <span style="height: 84%;"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `
          : `
              <div class="project-preview-card project-preview-voting" data-project-preview-media>
                <div class="project-preview-browser">
                  <div class="project-preview-browser-bar">
                    <span></span><span></span><span></span>
                    <p>${escapeHtml(project.mockup?.title || 'Voting Simulation')}</p>
                  </div>
                  <div class="project-preview-screen">
                    <div class="project-preview-chip-row">
                      ${(project.mockup?.meta || [])
                        .map(
                          (item) => `
                            <span class="project-preview-chip">${escapeHtml(item)}</span>
                          `,
                        )
                        .join('')}
                    </div>
                    <div class="project-preview-grid">
                      <div class="project-preview-list">
                        <div class="project-preview-list-row is-active">
                          <span>Voter validated</span>
                          <strong>Eligible</strong>
                        </div>
                        <div class="project-preview-list-row">
                          <span>Vote state</span>
                          <strong>Single selection</strong>
                        </div>
                        <div class="project-preview-list-row">
                          <span>Slip preview</span>
                          <strong>Generated</strong>
                        </div>
                      </div>
                      <div class="project-preview-sidecard">
                        <div class="project-preview-ticket">
                          <span>VVPAT</span>
                          <strong>Candidate confirmed</strong>
                        </div>
                        <div class="project-preview-bars">
                          <span style="height: 38%;"></span>
                          <span style="height: 72%;"></span>
                          <span style="height: 54%;"></span>
                          <span style="height: 66%;"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            `;

      return `
        <article
          class="project-card premium-project-card"
          data-reveal="up"
          data-delay="${(index * 0.12).toFixed(2)}"
        >
          <div
            class="project-card-shell project-showcase-shell relative overflow-hidden"
            data-project-card
            data-accent="${accent}"
            data-accent-border="${hexToRgba(accent, 0.14)}"
            data-accent-shadow="${hexToRgba(accent, 0.08)}"
            data-accent-glow="${hexToRgba(accent, 0.12)}"
          >
            <div class="project-card-glow absolute inset-0 rounded-[32px] pointer-events-none"></div>
            <div class="project-showcase-grid">
              <div class="project-showcase-media">
                ${previewMarkup}
              </div>
              <div class="project-showcase-body">
                <div class="project-showcase-topline">
                  <div class="project-showcase-type" style="--project-accent: ${accent};">
                    ${escapeHtml(project.type)}
                  </div>
                  <div class="project-badge-list">
                    ${project.badges
                      .map(
                        (badge) => `
                          <span class="project-badge">${escapeHtml(badge)}</span>
                        `,
                      )
                      .join('')}
                  </div>
                </div>

                <div class="space-y-4">
                  <p class="project-label">${escapeHtml(project.label || project.category || '')}</p>
                  <h3 class="project-card-title project-showcase-title">${escapeHtml(project.title)}</h3>
                  <p class="project-proof-line">${escapeHtml(project.proof)}</p>
                  <p class="project-summary">${escapeHtml(project.summary || project.description)}</p>
                </div>

                <div class="project-case-study-grid">
                  <div class="project-case-block">
                    <span>Problem</span>
                    <p>${escapeHtml(project.challenge || project.problem || '')}</p>
                  </div>
                  <div class="project-case-block">
                    <span>What I built</span>
                    <p>${escapeHtml(project.built || '')}</p>
                  </div>
                  <div class="project-case-block">
                    <span>Impact</span>
                    <p>${escapeHtml(project.impact || '')}</p>
                  </div>
                </div>

                <div class="project-highlight-stack">
                  ${project.highlights
                    .map(
                      (item) => `
                        <div class="project-highlight-item">
                          <span class="project-highlight-dot" style="background: ${accent}; box-shadow: 0 0 14px ${hexToRgba(accent, 0.45)};"></span>
                          <p>${escapeHtml(item)}</p>
                        </div>
                      `,
                    )
                    .join('')}
                </div>

                <div class="project-showcase-footer">
                  <div class="project-tech-stack">
                    ${project.tech
                      .map(
                        (tech) => `
                          <span class="project-tech-pill">${escapeHtml(tech)}</span>
                        `,
                      )
                      .join('')}
                  </div>
                  ${
                    projectLinks.length
                      ? `
                        <div class="project-action-row">
                          ${projectLinks
                            .map(
                              ({ href, icon, label }) => `
                                <a
                                  href="${escapeHtml(href)}"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="project-action-link"
                                >
                                  ${renderIcon(icon, { size: 15 })}
                                  ${escapeHtml(label)}
                                </a>
                              `,
                            )
                            .join('')}
                        </div>
                      `
                      : `
                        <div class="project-context-note">
                          ${escapeHtml(project.context || 'Product case study')}
                        </div>
                      `
                  }
                </div>
              </div>
            </div>
            <div class="project-card-border"></div>
          </div>
        </article>
      `;
    })
    .join('');
}

function renderLookingForMarkup() {
  return lookingFor.opportunities
    .map(
      (item, index) => `
        <article class="opportunity-card" data-reveal="up" data-delay="${(index * 0.08).toFixed(2)}">
          <div class="opportunity-icon">
            ${renderIcon('briefcase', { size: 18 })}
          </div>
          <div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </div>
        </article>
      `,
    )
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
    .map((cert, index) => {
      const certificateUrl = cert.certificateFile
        ? resolveAssetUrl(cert.certificateFile)
        : null;

      return `
        <div data-reveal="up" data-delay="${(index * 0.1).toFixed(2)}">
          <button
            type="button"
            class="block w-full text-left border-0 bg-transparent p-0"
            ${
              certificateUrl
                ? `
                  data-certificate-trigger
                  data-certificate-url="${escapeHtml(certificateUrl)}"
                  data-certificate-title="${escapeHtml(cert.title)}"
                  data-certificate-org="${escapeHtml(cert.org)}"
                  data-certificate-detail="${escapeHtml(cert.detail)}"
                  data-certificate-summary="${escapeHtml(cert.summary || '')}"
                `
                : ''
            }
          >
            <article
              class="accent-card certification-card relative rounded-[28px] p-7 border flex flex-col items-start text-left group overflow-hidden ${certificateUrl ? 'cursor-pointer' : ''}"
              style="--accent: ${cert.color}; --accent-border: ${hexToRgba(cert.color, 0.18)}; --accent-soft: ${hexToRgba(cert.color, 0.15)}; --accent-glow: ${hexToRgba(cert.color, 0.16)}; background: rgba(12, 12, 12, 0.8); backdrop-filter: blur(20px); border-color: rgba(255,255,255,0.06);"
            >
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style="background: radial-gradient(circle, ${hexToRgba(cert.color, 0.18)}, transparent); filter: blur(20px); top: -20px;"></div>
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 relative z-10 transition-transform duration-300 group-hover:scale-110" style="background: ${hexToRgba(cert.color, 0.15)}; border: 1px solid ${hexToRgba(cert.color, 0.25)};">
                ${renderIcon(cert.icon, { size: 26, stroke: cert.color, strokeWidth: 1.9 })}
              </div>
              <div class="certificate-thumb relative z-10">
                <div class="certificate-thumb-header">
                  <span>${escapeHtml(cert.org)}</span>
                  <strong>${escapeHtml(cert.detail)}</strong>
                </div>
                <div class="certificate-thumb-body">
                  <div class="certificate-thumb-line is-strong"></div>
                  <div class="certificate-thumb-line"></div>
                  <div class="certificate-thumb-line is-short"></div>
                </div>
              </div>
              <h3 class="text-base font-bold text-white mt-5 mb-2 relative z-10 leading-snug">${escapeHtml(cert.title)}</h3>
              <p class="text-xs font-medium mb-3 relative z-10" style="color: ${cert.color}; opacity: 0.9;">${escapeHtml(cert.org)}</p>
              <p class="text-sm text-slate-400 leading-relaxed relative z-10">${escapeHtml(cert.summary || '')}</p>
              ${
                certificateUrl
                  ? `
                    <div class="certificate-cta relative z-10">
                      ${renderIcon('eye', { size: 14, stroke: cert.color })}
                      Preview Certificate
                    </div>
                  `
                  : ''
              }
              <div class="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style="background: linear-gradient(to right, transparent, ${hexToRgba(cert.color, 0.5)}, transparent);"></div>
            </article>
          </button>
        </div>
      `;
    })
    .join('');
}

function renderCertificateModal() {
  return `
    <div class="certificate-modal" data-certificate-modal aria-hidden="true">
      <button type="button" class="certificate-modal-backdrop" data-certificate-close aria-label="Close certificate preview"></button>
      <div class="certificate-modal-panel" role="dialog" aria-modal="true" aria-labelledby="certificate-modal-title">
        <div class="certificate-modal-header">
          <div>
            <p class="certificate-modal-eyebrow" data-certificate-meta></p>
            <h3 id="certificate-modal-title" data-certificate-title></h3>
            <p class="certificate-modal-summary" data-certificate-summary></p>
          </div>
          <button type="button" class="certificate-modal-close" data-certificate-close aria-label="Close certificate preview">
            ${renderIcon('x', { size: 18 })}
          </button>
        </div>
        <div class="certificate-modal-frame">
          <iframe title="Certificate preview" data-certificate-frame loading="lazy"></iframe>
        </div>
        <div class="certificate-modal-actions">
          <a href="#" target="_blank" rel="noopener noreferrer" class="project-action-link" data-certificate-open>
            ${renderIcon('arrowUpRight', { size: 15 })}
            Open Full PDF
          </a>
          <a href="#" class="project-action-link" data-certificate-download download>
            ${renderIcon('download', { size: 15 })}
            Download
          </a>
        </div>
      </div>
    </div>
  `;
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
  const resumeUrl = resolveAssetUrl(hero.resumeFile || 'Resume.pdf');
  const heroImageUrl = resolveAssetUrl('image.png');
  const primaryEmail = contactInfo.find((item) => item.label === 'Email')?.value || '';
  const directEmailHref = primaryEmail ? `mailto:${primaryEmail}` : '#contact';

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
            <a href="${escapeHtml(resumeUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex px-5 py-2 text-sm font-semibold text-black rounded-xl transition-all duration-300 primary-glow-button" style="background: linear-gradient(135deg, #ef4444, #dc2626); box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);">
              Download Resume
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
      <a href="${escapeHtml(resumeUrl)}" target="_blank" rel="noopener noreferrer" class="block px-4 py-3 rounded-xl text-sm font-semibold text-black text-center mt-2" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
        Download Resume
      </a>
    </div>

    <a href="#contact" class="sticky-hire-cta" data-sticky-cta data-magnetic>
      ${renderIcon('briefcase', { size: 16 })}
      Hire Me
    </a>

    <main class="min-h-screen bg-transparent relative z-0">
      <section class="relative min-h-screen flex items-center pt-28 pb-18 overflow-hidden hero-section" id="hero" data-hero>
        <div class="absolute inset-0 pointer-events-none hero-orbs" data-hero-orbs>
          <div class="absolute top-[42%] left-[52%] -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full opacity-[0.14] animate-spin-slow" style="background: conic-gradient(from 0deg, transparent 58%, rgba(239, 68, 68, 0.22) 82%, transparent 100%); filter: blur(2px);"></div>
          <div class="absolute top-[44%] left-[53%] -translate-x-1/2 -translate-y-1/2 w-[440px] h-[440px] rounded-full opacity-[0.08]" style="background: radial-gradient(circle, rgba(239, 68, 68, 0.18) 0%, transparent 72%);"></div>
        </div>
        <div class="max-w-6xl mx-auto px-6 w-full z-10 hero-content" data-hero-content>
          <div class="hero-layout">
            <div class="hero-copy-column">
              <div class="hero-eyebrow" data-reveal="up" data-delay="0.08">
                ${escapeHtml(hero.eyebrow)}
              </div>
              <div class="inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 rounded-full bg-white/[0.03] text-gray-400 text-xs uppercase tracking-widest font-medium mb-6" style="backdrop-filter: blur(10px);" data-reveal="up" data-delay="0.16">
                ${renderIcon('mapPin', { size: 11, className: 'text-[var(--color-neon-blue)]' })}
                ${escapeHtml(hero.location)}
              </div>

              <p class="hero-name" data-reveal="up" data-delay="0.22">
                ${escapeHtml(`${hero.firstName} ${hero.lastName}`)}
              </p>

              <h1 class="hero-headline" data-text-reveal data-mode="words" data-delay="0.32" data-stagger="0.04">
                ${escapeHtml(hero.headline)}
              </h1>

              <p class="hero-summary" data-reveal="up" data-delay="0.92">
                ${escapeHtml(hero.summary)}
              </p>

              <div class="hero-tag-row" data-reveal="up" data-delay="1.02">
                ${hero.heroTags
                  .map(
                    (tag) => `
                      <span class="hero-tag">${escapeHtml(tag)}</span>
                    `,
                  )
                  .join('')}
              </div>

              <div class="hero-availability" data-reveal="up" data-delay="1.12">
                ${renderIcon('sparkles', { size: 15 })}
                ${escapeHtml(hero.availability)}
              </div>

              <div class="hero-action-row" data-reveal="up" data-delay="1.24">
                <div data-magnetic>
                  <a href="#projects" class="group hero-primary-action">
                    See Selected Work
                    ${renderIcon('arrowRight', { size: 18, className: 'transition-transform duration-300 group-hover:translate-x-1' })}
                  </a>
                </div>
                <div data-magnetic>
                  <a href="${escapeHtml(resumeUrl)}" target="_blank" rel="noopener noreferrer" class="hero-secondary-action">
                    ${renderIcon('download', { size: 16 })}
                    Download Resume
                  </a>
                </div>
              </div>
            </div>

            <div class="hero-visual-column" data-reveal="up" data-delay="0.46">
              <div class="hero-portrait-panel">
                <div class="hero-portrait-shell">
                  <div class="absolute inset-0 rounded-full animate-pulse-glow"></div>
                  <div class="absolute -inset-4 rounded-full profile-ring opacity-30" style="background: conic-gradient(from 0deg, transparent 44%, rgba(239, 68, 68, 0.46) 66%, rgba(248, 113, 113, 0.18) 82%, transparent 100%);"></div>
                  <div class="hero-portrait-image">
                    <img src="${escapeHtml(heroImageUrl)}" alt="Radheshyam Bhati" class="w-full h-full object-cover" />
                  </div>
                </div>
                <div class="hero-focus-card">
                  <p>Currently building</p>
                  <div class="hero-focus-list">
                    <span>AI product workflows</span>
                    <span>Interactive web prototypes</span>
                    <span>User-first systems demos</span>
                  </div>
                  <a href="${escapeHtml(directEmailHref)}" class="hero-inline-contact">
                    ${renderIcon('mail', { size: 14 })}
                    Hire me / Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-32 relative z-10" id="about">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          ${renderSectionHeading('01', 'About me')}
          <div class="grid md:grid-cols-2 gap-16 items-start">
            <div class="space-y-5 text-lg leading-relaxed text-gray-400 font-light" data-reveal="up" data-delay="0.10">
              <p>I'm a <span class="text-white font-medium">Computer Science &amp; Engineering student</span> focused on building AI-enabled products, polished interfaces, and practical software that people can actually use.</p>
              <p>At <span class="font-medium" style="color: var(--color-neon-blue);">PW Institute of Innovation</span>, Pune, I’m sharpening product thinking, frontend quality, systems understanding, and the ability to move quickly from concept to usable prototype.</p>
              ${
                aboutStats.length
                  ? `
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
                  `
                  : ''
              }
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
          ${renderSectionHeading('03', 'Selected Work')}
          ${renderSectionIntro('A focused look at the products and prototypes that best represent how I think, design, and build.')}
          <div class="space-y-8">
            ${renderProjectsMarkup()}
          </div>
        </div>
      </section>

      <section class="py-24 relative z-10" id="looking-for">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          ${renderSectionHeading('04', lookingFor.title)}
          ${renderSectionIntro(lookingFor.summary)}
          <div class="opportunity-grid">
            ${renderLookingForMarkup()}
          </div>
        </div>
      </section>

      <section class="py-32 relative z-10" id="education">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          ${renderSectionHeading('05', 'Education')}
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
          ${renderSectionHeading('06', 'Certifications & Training')}
          ${renderSectionIntro('Selected certifications and challenge credentials that back up my technical curiosity and self-driven learning.')}
          <div class="grid md:grid-cols-3 gap-6">
            ${renderCertificationsMarkup()}
          </div>
        </div>
      </section>

      <section class="py-32 relative z-10" id="contact">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          ${renderSectionHeading('07', "Let's Connect")}
          <div class="grid md:grid-cols-2 gap-16 items-start">
            <div data-reveal="up" data-delay="0.10">
              <p class="text-gray-400 text-lg leading-relaxed font-light mb-10">
                I’m looking for builder-focused opportunities where I can contribute across <span class="text-white font-medium">AI product engineering, frontend quality, prototype execution, and product-minded development.</span>
              </p>
              <div class="space-y-6">
                ${renderContactItemsMarkup()}
              </div>
              <div class="mt-10 flex items-center gap-3 px-5 py-3 rounded-xl border w-fit" style="background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.15);">
                <span class="w-2 h-2 rounded-full animate-pulse" style="background: #22c55e; box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);"></span>
                <span class="text-sm text-gray-400">Available for <span class="text-white font-medium">internships, freelance work, and product collaborations</span></span>
              </div>
            </div>

            <div data-reveal="up" data-delay="0.20">
              <div class="rounded-2xl p-7 md:p-8 border relative overflow-hidden contact-panel" style="background: rgba(10, 10, 10, 0.9); backdrop-filter: blur(24px); border-color: rgba(255,255,255,0.06); box-shadow: 0 24px 60px rgba(0,0,0,0.4);">
                <div class="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none" style="background: radial-gradient(circle, rgba(239,68,68,0.08), transparent); filter: blur(40px);"></div>
                <form class="space-y-5 relative z-10" data-contact-form data-direct-email="${escapeHtml(primaryEmail)}" novalidate>
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

                  <div class="contact-direct-row">
                    <a href="${escapeHtml(directEmailHref)}" class="project-action-link">
                      ${renderIcon('mail', { size: 15 })}
                      Email Directly
                    </a>
                    <a href="${escapeHtml(resumeUrl)}" target="_blank" rel="noopener noreferrer" class="project-action-link">
                      ${renderIcon('download', { size: 15 })}
                      Resume PDF
                    </a>
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

    ${renderCertificateModal()}
  `;
}
