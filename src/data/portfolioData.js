// ---------------------------------------------------------------------------
// Curated per-repo overrides (NOT replaceable via GitHub metadata)
// ---------------------------------------------------------------------------
//
// GitHub only reports the *primary* detected language and cannot express
// design/UI tools (Figma, UI/UX) or databases (MySQL) that don't appear as
// code languages. `extraLanguages` are ADDED to the GitHub-detected breakdown
// — existing languages are never removed. `summary` supplies a description
// when the repo has none (e.g. IntelliDine has no GitHub description).

/**
 * @type {Record<string, { summary?: string, extraLanguages?: string[] }>}
 */
export const projectOverrides = {
  IntelliDine: {
    summary:
      'IntelliDine — an AI-powered restaurant discovery and ordering platform. Built with a full-stack TypeScript/JavaScript frontend and Python/MySQL backend, with a polished UI/UX and a live demo on Vercel.',
    extraLanguages: ['Python', 'CSS', 'MySQL', 'Figma', 'UI/UX', 'JavaScript', 'Java'],
  },
};

export const portfolioData = {
  personalInfo: {
    name: 'Radheshyam Bhati',
    role: 'Computer Science & Engineering student',
    tagline: 'Building Agentic AI Systems | AI Product Engineering | Systems Thinking | CSE.',
    location: 'Jodhpur, Rajasthan, India',
    about: [
      "I'm Radheshyam — a CS student who spent two years grinding JEE prep, not just to crack an exam, but because I genuinely love how problems work. That obsession with problem-solving never left, it just shifted to code.",
      'I build things. Not for the resume, but because sitting down with a blank editor and ending up with something that works is one of the best feelings I know. I\'m deep into AI, full-stack dev, and figuring out how to make software that actually matters.',
    ],
    resumeLink: import.meta.env.BASE_URL + 'docs/Resume.pdf',
    email: 'radheshyambhati747@gmail.com',
    linkedin: 'https://www.linkedin.com/in/radheshyam-bhati/',
    github: 'https://github.com/radheshyam-bhati',
  },
  education: [
    {
      period: '2023 – 2025',
      title: 'JEE Journey',
      institution: 'Matrix, Sikar',
      description: 'Spent 2023 – 2025 in Sikar at Matrix, building a strong foundation in PCM and preparing through a focused JEE learning journey.',
    },
    {
      period: '2025 – Present',
      title: 'B.Tech — Computer Science & Engineering',
      institution: 'PW Institute of Innovation (PWIOI)',
      status: 'Active',
      points: [
        'Started my B.Tech in Computer Science & Engineering at PW Institute of Innovation, Pune, focusing on building strong foundations in programming and development.',
        'Learned core technologies including C, C++, Java, Python, HTML, CSS, and JavaScript while continuously exploring new ideas and problem-solving approaches.',
        'Continuously improving my technical skills, product thinking, and ability to build practical solutions through hands-on projects and competitions.',
      ],
    },
  ],
  certifications: [
    {
      id: 'os-bootcamp',
      title: 'Operating Systems Bootcamp',
      issuer: 'DevTown (GDG VIT-AP)',
      date: 'Feb 2026',
      color: '#ef4444',
      link: import.meta.env.BASE_URL + 'certificates/operating-systems-bootcamp-devtown-gdg-vit-ap.pdf',
    },
    {
      id: 'cyber-course',
      title: 'Cybersecurity Course',
      issuer: 'Skill India (Tech Mahindra Foundation)',
      date: 'Dec 2025',
      color: '#dc2626',
      link: import.meta.env.BASE_URL + 'certificates/cybersecurity-job-simulation.pdf',
    },
    {
      id: 'yophoria',
      title: 'Yophoria Innovation Challenge 2025',
      issuer: 'YoLearn.ai',
      date: 'Oct 2025',
      color: '#fb7185',
      link: import.meta.env.BASE_URL + 'certificates/yophoria-innovation-challenge-2025-yolearn-ai.pdf',
    },
  ],
};
