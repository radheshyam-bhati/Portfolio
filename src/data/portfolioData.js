export const portfolioData = {
  personalInfo: {
    name: "Radheshyam Bhati",
    role: "Computer Science & Engineering student",
    tagline: "Building Agentic AI Systems | AI Product Engineering | Systems Thinking | CSE.",
    location: "Jodhpur, Rajasthan, India",
    about: [
      "I'm Radheshyam — a CS student who spent two years grinding JEE prep, not just to crack an exam, but because I genuinely love how problems work. That obsession with problem-solving never left, it just shifted to code.",
      "I build things. Not for the resume, but because sitting down with a blank editor and ending up with something that works is one of the best feelings I know. I'm deep into AI, full-stack dev, and figuring out how to make software that actually matters."
    ],
    resumeLink: import.meta.env.BASE_URL + "docs/Resume.pdf",
    email: import.meta.env.VITE_PORTFOLIO_EMAIL || atob("cmFkaGVzaHlhbWJoYXRpNzQ3QGdtYWlsLmNvbQ=="),
    linkedin: "https://www.linkedin.com/in/radheshyam-bhati/",
    github: "https://github.com/radheshyam-cod"
  },
  skills: [
    {
      category: "Programming Languages",
      color: "#ef4444",
      items: ["Python", "C", "C++", "Java"]
    },
    {
      category: "Web & Mobile Development",
      color: "#b91c1c",
      items: ["HTML5", "CSS", "JavaScript", "React", "Node.js", "FastAPI", "Firebase"]
    },
    {
      category: "Databases & Infrastructure",
      color: "#fb7185",
      items: ["PostgreSQL", "MySQL"]
    },
    {
      category: "Data & Visualization",
      color: "#f43f5e",
      items: ["Power BI", "Dashboards", "Reporting", "Data Analysis"]
    }
  ],
  education: [
    {
      period: "2023 – 2025",
      title: "JEE Journey",
      institution: "Matrix, Sikar",
      description: "Spent 2023 – 2025 in Sikar at Matrix, building a strong foundation in PCM and preparing through a focused JEE learning journey."
    },
    {
      period: "2025 – Present",
      title: "B.Tech — Computer Science & Engineering",
      institution: "PW Institute of Innovation (PWIOI)",
      status: "Active",
      points: [
        "Started my B.Tech in Computer Science & Engineering at PW Institute of Innovation, Pune, focusing on building strong foundations in programming and development.",
        "Learned core technologies including C, C++, Java, Python, HTML, CSS, and JavaScript while continuously exploring new ideas and problem-solving approaches.",
        "Continuously improving my technical skills, product thinking, and ability to build practical solutions through hands-on projects and competitions."
      ]
    }
  ],
  projects: [
    {
      id: "evm-sim",
      title: "National E-Voting Portal (Client-Side Simulation)",
      tag: "Browser-Based EVM + VVPAT Simulation",
      color: "#ef4444",
      description: "Engineered a fully client-side simulation of an EVM + VVPAT system to mirror real-world voting workflows, using hashed EPIC-style voter IDs for one-vote enforcement, realistic vote confirmation and slip generation, persistent vote tracking with IndexedDB and LocalStorage, and a Chart.js-powered results dashboard for educational demos.",
      technologies: ["HTML", "CSS", "JavaScript", "IndexedDB", "LocalStorage", "Chart.js"],
      links: {
        live: "https://radheshyam-cod.github.io/Online-Voting-system/",
        github: "https://github.com/radheshyam-cod/Online-Voting-system"
      }
    },
    {
      id: "fin-mate",
      title: "Fin-Mate",
      tag: "Mumbai Hacks 2025",
      color: "#dc2626",
      description: "Created an AI personal finance coach for students, freelancers, and early-stage earners with irregular income. It analyzes spending behavior, generates personalized budgets, sends proactive alerts, and prepares monthly financial reports.",
      technologies: ["Python", "Flask/FastAPI", "OpenAI Models", "React", "Firebase Auth", "Firebase"],
      links: {}
    }
  ],
  certifications: [
    {
      id: "os-bootcamp",
      title: "Operating Systems Bootcamp",
      issuer: "DevTown (GDG VIT-AP)",
      date: "Feb 2026",
      color: "#ef4444",
      link: import.meta.env.BASE_URL + "certificates/operating-systems-bootcamp-devtown-gdg-vit-ap.pdf"
    },
    {
      id: "cyber-course",
      title: "Cybersecurity Course",
      issuer: "Skill India (Tech Mahindra Foundation)",
      date: "Dec 2025",
      color: "#dc2626",
      link: import.meta.env.BASE_URL + "certificates/cybersecurity-job-simulation.pdf"
    },
    {
      id: "yophoria",
      title: "Yophoria Innovation Challenge 2025",
      issuer: "YoLearn.ai",
      date: "Oct 2025",
      color: "#fb7185",
      link: import.meta.env.BASE_URL + "certificates/yophoria-innovation-challenge-2025-yolearn-ai.pdf"
    }
  ]
};
