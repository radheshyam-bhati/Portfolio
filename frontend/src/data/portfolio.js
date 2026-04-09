export const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#education', label: 'Education' },
  { href: '#contact', label: 'Contact' },
];

export const hero = {
  firstName: 'Radheshyam',
  lastName: 'Bhati',
  location: 'Jodhpur, Rajasthan, India',
  subtitle: 'Building Agentic AI Systems | AI Product Engineering | Systems Thinking | CSE.',
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
    type: 'Browser-Based EVM + VVPAT Simulation',
    description:
      'Engineered a fully client-side simulation of an EVM + VVPAT system to mirror real-world voting workflows, using hashed EPIC-style voter IDs for one-vote enforcement, realistic vote confirmation and slip generation, persistent vote tracking with IndexedDB and LocalStorage, and a Chart.js-powered results dashboard for educational demos.',
    liveLink: 'https://radheshyam-cod.github.io/Online-Voting-system/',
    repoLink: 'https://github.com/radheshyam-cod/Online-Voting-system',
    tech: [
      'HTML',
      'CSS',
      'JavaScript',
      'IndexedDB',
      'LocalStorage',
      'Chart.js',
    ],
    accentColor: '#ef4444',
  },
  {
    title: 'Fin-Mate',
    type: 'Mumbai Hacks 2025',
    description:
      'Created an AI personal finance coach for students, freelancers, and early-stage earners with irregular income. It analyzes spending behavior, generates personalized budgets, sends proactive alerts, and prepares monthly financial reports.',
    tech: [
      'Python',
      'Flask/FastAPI',
      'OpenAI Models',
      'React',
      'Firebase Auth',
      'Firebase',
    ],
    accentColor: '#dc2626',
  },
];

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
  },
  {
    title: 'Cybersecurity Course',
    org: 'Skill India (Tech Mahindra Foundation)',
    icon: 'shield',
    color: '#dc2626',
    detail: 'Dec 2025',
    certificateFile: 'certificates/cybersecurity-job-simulation.pdf',
  },
  {
    title: 'Yophoria Innovation Challenge 2025',
    org: 'YoLearn.ai',
    icon: 'database',
    color: '#fb7185',
    detail: 'Oct 2025',
    certificateFile: 'certificates/yophoria-innovation-challenge-2025-yolearn-ai.pdf',
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
