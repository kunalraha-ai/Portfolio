export const metrics = [
  { value: "140+", label: "distributors searched at once" },
  { value: "< 3 sec", label: "from query to sourcing result" },
  { value: "Top 4%", label: "of 2,000+ TinyFish applicants" },
  { value: "8.1k+", label: "stars on an open-source contribution" },
] as const;

export const projects = {
  omniprocure: {
    name: "OmniProcure",
    descriptor: "Autonomous sourcing and client dashboard platform",
    summary:
      "A production system that turns fragmented distributor data into fast, usable sourcing decisions.",
    achievements: [
      "Aggregates live pricing and stock across 140+ distributors.",
      "Uses asynchronous API pipelines and Claude-powered part disambiguation.",
      "Reduced manual sourcing from 3 hours to under 3 seconds.",
      "Runs automated monitoring for performance, drift, and system logs.",
    ],
    href: "https://github.com/kunalraha-ai/omniprocure",
  },
  crowdWisdom: {
    name: "CrowdWisdomTrading",
    descriptor: "Multi-agent pipeline and analytics tooling",
    summary:
      "An autonomous marketing and analytics system built with the Nous Research Hermes framework.",
    achievements: [
      "Specialized Python toolsets for agent workflows.",
      "Apify wrappers for dynamic web scraping.",
      "Real-time analytics and visualization dashboards.",
      "System-wide debugging, logging, and error handling.",
    ],
    href: "https://github.com/kunalraha-ai/CrowdWisdomTrading",
  },
  opensre: {
    name: "Tracer-Cloud / opensre",
    descriptor: "Open-source AI SRE agent framework",
    summary:
      "Resolved synthetic dataset execution gaps and documented benchmark behavior in an 8.1k-star toolkit.",
    href: "https://github.com/Tracer-Cloud/opensre",
  },
} as const;

export const skills = [
  {
    title: "Languages",
    items: ["Python", "Golang", "SQL"],
  },
  {
    title: "AI and Machine Learning",
    items: ["Model training", "Fine-tuning", "Dataset preparation", "RAG", "Vector search"],
  },
  {
    title: "Infrastructure",
    items: ["Docker", "CDN", "Memory management", "RabbitMQ"],
  },
  {
    title: "Systems and Tools",
    items: ["React", "REST APIs", "DBMS", "Git", "Linux", "Hermes"],
  },
] as const;

export const links = {
  github: "https://github.com/kunalraha-ai",
  linkedin: "https://linkedin.com/in/kunal-raha-ai",
  email: "mailto:kunal.raha.ai@gmail.com",
  resume: "/documents/kunal-raha-resume.pdf",
} as const;
