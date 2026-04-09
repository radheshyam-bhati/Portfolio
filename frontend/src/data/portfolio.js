export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Work' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
];

export const hero = {
  firstName: 'Radheshyam',
  lastName: 'Bhati',
  location: 'Jodhpur, Rajasthan, India',
  eyebrow: 'AI Product Engineering · Full-Stack Prototyping',
  headline: 'I build practical AI products, web apps, and intelligent prototypes that solve real user problems.',
  summary:
    'Computer Science & Engineering student focused on turning raw ideas into usable products with strong systems thinking, clean execution, and demo-ready polish.',
  availability: 'Open to internships, freelance builds, and product collaborations.',
  resumeFile: 'Resume.pdf',
  heroTags: ['AI systems', 'Web products', 'Prototype execution'],
};

export const aboutStats = [];

export const milestones = [
  {
    year: '2023 – 2025',
    title: 'JEE Journey',
    content:
      'Spent 2023 – 2025 in Sikar at Matrix, building a strong foundation in PCM and preparing through a focused JEE learning journey.',
  },
  {
    year: '2025',
    title: 'B.Tech Journey',
    content: [
      'Started my B.Tech in Computer Science & Engineering at PW Institute of Innovation, Pune, focusing on building strong foundations in programming and development.',
      'Learned core technologies including C, C++, Java, Python, HTML, CSS, and JavaScript while continuously exploring new ideas and problem-solving approaches.',
      'Continuously improving my technical skills, product thinking, and ability to build practical solutions through hands-on projects and competitions.',
    ],
  },
];

export const skillGroups = [
  {
    category: 'Programming Languages',
    color: '#ef4444',
    skills: ['Python', 'C', 'C++', 'Java'],
  },
  {
    category: 'Web & Mobile Development',
    color: '#b91c1c',
    skills: ['HTML5', 'CSS', 'JavaScript', 'React', 'Node.js', 'FastAPI', 'Firebase'],
  },
  {
    category: 'Databases & Infrastructure',
    color: '#fb7185',
    skills: ['PostgreSQL', 'MySQL'],
  },
  {
    category: 'Data & Visualization',
    color: '#f43f5e',
    skills: ['Power BI', 'Dashboards', 'Reporting', 'Data Analysis'],
  },
];

export const projects = [
  {
    title: 'National E-Voting Portal (Client-Side Simulation)',
    type: 'Selected Work',
    label: 'Browser-Based EVM + VVPAT Simulation',
    proof:
      'Simulated a realistic EVM + VVPAT workflow with hashed voter validation, one-vote enforcement, and persistent browser-side results tracking.',
    description:
      'An educational product simulation designed to mirror real-world voting behavior inside the browser without relying on a backend.',
    challenge:
      'Model a trustworthy election flow in a fully client-side environment while keeping the interface believable, controlled, and easy to demonstrate.',
    built:
      'Built hashed EPIC-style voter handling, guided vote confirmation, VVPAT slip visualization, IndexedDB plus LocalStorage persistence, and a results dashboard powered by Chart.js.',
    impact:
      'Created a strong demo piece for explaining system behavior, usability constraints, and election workflow logic in a clean, interactive format.',
    badges: ['Educational demo', 'Browser-only architecture', 'Persistent results'],
    highlights: [
      'Hashed EPIC-style voter validation and one-vote enforcement',
      'VVPAT confirmation flow with controlled interaction states',
      'Persistent results tracking with IndexedDB, LocalStorage, and Chart.js',
    ],
    context: 'Independent educational simulation',
    liveLink: 'https://radheshyam-cod.github.io/Online-Voting-system/',
    repoLink: 'https://github.com/radheshyam-cod/Online-Voting-system',
    repoLabel: 'GitHub Repo',
    liveLabel: 'Live Demo',
    tech: [
      'HTML',
      'CSS',
      'JavaScript',
      'IndexedDB',
      'LocalStorage',
      'Chart.js',
    ],
    accentColor: '#ef4444',
    mockup: {
      type: 'voting',
      title: 'EVM Flow',
      meta: ['Hashed voter ID', 'VVPAT preview', 'Results dashboard'],
    },
  },
  {
    title: 'Fin-Mate',
    type: 'Selected Work',
    label: 'Mumbai Hacks 2025 Prototype',
    proof:
      'Designed an AI finance coach aimed at students and freelancers dealing with irregular income and inconsistent spending patterns.',
    description:
      'A hackathon-built concept focused on making budgeting, reporting, and financial nudges more useful for early-stage earners.',
    challenge:
      'Translate messy, irregular cash flow into a simple product experience that feels supportive instead of overly technical or judgmental.',
    built:
      'Mapped an AI-driven workflow for spending analysis, personalized budgeting, proactive alerts, monthly report generation, and student-friendly onboarding.',
    impact:
      'Packaged the idea into a polished prototype that communicates both product thinking and execution speed under competitive conditions.',
    badges: ['Hackathon build', 'AI budgeting workflow', 'Student-first UX'],
    highlights: [
      'Irregular-income budgeting flow designed for students and freelancers',
      'AI-guided spending analysis, alerts, and monthly reporting journey',
      'Hackathon-ready product framing with clear user value and demo clarity',
    ],
    context: 'Built during Mumbai Hacks 2025',
    liveLabel: 'Request Walkthrough',
    tech: [
      'Python',
      'Flask/FastAPI',
      'OpenAI Models',
      'React',
      'Firebase Auth',
      'Firebase',
    ],
    accentColor: '#dc2626',
    mockup: {
      type: 'finance',
      title: 'AI Budget Coach',
      meta: ['Spending analysis', 'Smart alerts', 'Monthly reports'],
    },
  },
];

export const lookingFor = {
  title: 'What I’m Looking For',
  summary:
    'I’m looking for roles and collaborations where I can contribute across product thinking, engineering execution, and AI-driven user experiences.',
  opportunities: [
    {
      title: 'Internships',
      description: 'Product engineering, AI tooling, web application, or systems-oriented internships.',
    },
    {
      title: 'Freelance Builds',
      description: 'Fast prototype sprints, portfolio sites, product demos, and intelligent workflow tools.',
    },
    {
      title: 'Collaborations',
      description: 'Hackathons, student product teams, startup experiments, and applied AI concepts.',
    },
  ],
};

export const education = [
  {
    institution: 'PW Institute of Innovation (PWIOI)',
    degree: 'B.Tech — Computer Science & Engineering',
    period: '2025 – Present',
    location: 'Pune, India',
    description:
      'Pursuing a Computer Science & Engineering degree with a strong focus on applied AI and full-stack product development.',
    status: 'current',
  },
  {
    institution: 'Gurukul Shikshan Sansthan Sr. Sec. School',
    degree: 'Senior Secondary Education',
    period: '2023 – 2025',
    location: 'Sikar, India',
    description:
      'Completed senior secondary education at Gurukul Shikshan Sansthan Sr. Sec. School in Sikar.',
    status: 'completed',
  },
];

export const certifications = [
  {
    title: 'Operating Systems Bootcamp',
    org: 'DevTown (GDG VIT-AP)',
    icon: 'award',
    color: '#ef4444',
    detail: 'Feb 2026',
    certificateFile: 'certificates/operating-systems-bootcamp-devtown-gdg-vit-ap.pdf',
    summary:
      'Covered process management, memory management, and core system fundamentals through a hands-on operating systems bootcamp.',
  },
  {
    title: 'Cybersecurity Course',
    org: 'Skill India (Tech Mahindra Foundation)',
    icon: 'shield',
    color: '#dc2626',
    detail: 'Dec 2025',
    certificateFile: 'certificates/cybersecurity-job-simulation.pdf',
    summary:
      'Focused on digital threats, basic security practices, system safety concepts, and ways to protect systems and data from common vulnerabilities.',
  },
  {
    title: 'Yophoria Innovation Challenge 2025',
    org: 'YoLearn.ai',
    icon: 'database',
    color: '#fb7185',
    detail: 'Oct 2025',
    certificateFile: 'certificates/yophoria-innovation-challenge-2025-yolearn-ai.pdf',
    summary:
      'Participated in an AI innovation challenge centered on practical problem-solving, product thinking, and collaborative solution building.',
  },
];

export const contactInfo = [
  {
    icon: 'mail',
    label: 'Email',
    value: 'radheshyambhati747@gmail.com',
    href: 'mailto:radheshyambhati747@gmail.com',
    color: '#ef4444',
  },
  {
    icon: 'mapPin',
    label: 'Location',
    value: 'Jodhpur, Rajasthan, India',
    href: '',
    color: '#fb7185',
  },
  {
    icon: 'linkedin',
    label: 'LinkedIn',
    value: 'linkedin.com/in/radheshyam-bhati',
    href: 'https://www.linkedin.com/in/radheshyam-bhati/',
    color: '#ef4444',
  },
  {
    icon: 'github',
    label: 'GitHub',
    value: 'github.com/radheshyam-cod',
    href: 'https://github.com/radheshyam-cod',
    color: '#dc2626',
  },
];
