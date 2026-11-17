import {
  Globe,
  Smartphone,
  Monitor,
  Atom,
  Server,
  Coffee,
  Wind,
  Database,
  FileCode2,
  Boxes,
  Code2,
  Cpu,
  Layers,
  GitBranch,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const services = [
  {
    icon: Globe,
    title: "Full-Stack Web Systems",
    description:
      "Modern, responsive web applications engineered for lightning-fast latency, accessible UX, and maintainable micro-architectures.",
    stack: ["React 18", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS"],
    glowHover: "hover:shadow-glow-gold",
    glowColor: "gold",
    floatDelay: "0s",
    offset: "lg:mt-0",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform & Mobile",
    description:
      "Native Android & cross-platform applications with offline-first local storage, fluid 60fps animations, and clean APIs.",
    stack: ["React Native", "Android", "Java", "Kotlin", "SQLite"],
    glowHover: "hover:shadow-glow-sapphire",
    glowColor: "sapphire",
    floatDelay: "2s",
    offset: "lg:mt-12",
  },
  {
    icon: Monitor,
    title: "Desktop Tools & Automation",
    description:
      "Ultra-fast native Windows desktop tools and data parsing utilities that automate complex repetitive workflows with zero memory bloat.",
    stack: ["Python", "Tauri", "Rust", "Tkinter", "Data Parsing"],
    glowHover: "hover:shadow-glow-mixed",
    glowColor: "gold",
    floatDelay: "4s",
    offset: "lg:mt-6",
  },
];

export const projects = [
  {
    title: "Chat Wala",
    subtitle: "Real-Time Instant Messaging Web App",
    category: "Real-Time",
    description:
      "A WhatsApp clone web app. The only requirement is an email address to start chatting with anyone.",
    highlights: [
      "Zero-friction email onboarding",
      "Real-time synchronized chat rooms",
      "Responsive iOS-style glass conversation bubbles",
    ],
    tags: ["React", "Real-Time Chat", "WebSockets", "Vercel"],
    gradient: "from-sapphire/30 via-obsidian-100 to-obsidian",
    accentColor: "sapphire",
    live: "https://chat-wala-ten.vercel.app/",
    github: "https://github.com/kavathiya-ayush/chat-wala",
    infoText:
      "This is a fully functional real-time chat application. Unlike demo mockups, this system is completely active. Sign in using any email address and start instant real-time messaging.",
  },
  {
    title: "RedCell Connect",
    subtitle: "Hospital Blood Bank & Donor Ecosystem",
    category: "Web & Database",
    description:
      "A complete blood bank management system that helps hospitals and blood banks track inventory and manage donors efficiently.",
    highlights: [
      "Multi-role administrator & hospital access control",
      "Live blood group inventory ledger & shortage alerts",
      "Complete donor lifecycle & donation schedule logging",
    ],
    tags: ["Full Stack", "MySQL Database", "Healthcare ERP", "Live System"],
    gradient: "from-[#dc2626]/25 via-obsidian-100 to-obsidian",
    accentColor: "gold",
    live: "https://redcell-connect.kesug.com",
    github: "https://github.com/kavathiya-ayush/RedCell-Connect/",
    warningType: "infinity",
    credentials: { username: "admin", password: "admin123" },
  },
  {
    title: "Omni Tool Convertor",
    subtitle: "Native Windows CA Automation & Parsing Suite",
    category: "Desktop & Systems",
    description:
      "A native Windows desktop utility built entirely in Python. Features an advanced PDF to Excel converter and bulk image resizer. Purpose-built for CAs with specialized tools for parsing specific bank statement formats directly into Excel.",
    highlights: [
      "Algorithmic PDF tabular data extraction to formatted Excel",
      "CA bank statement transaction normalization",
      "High-speed multithreaded bulk image processing",
    ],
    tags: ["Python", "Desktop App", "Data Extraction", "CA Automation"],
    gradient: "from-gold/20 via-sapphire/10 to-obsidian",
    accentColor: "gold",
    live: "https://drive.google.com/file/d/1RLYpryw8Cty_nm5snBUnjzewU4QOA2xX/view?usp=sharing",
    github: "http://github.com/kavathiya-ayush/Omni-Tool-Convertor",
    isDesktop: true,
  },
  {
    title: "Shivam Pump Stock",
    subtitle: "Industrial Pump Inventory & Order Tracking",
    category: "ERP & Inventory",
    description:
      "A comprehensive submersible pump inventory and stock management system designed to track sales, supplies, and stock levels.",
    highlights: [
      "Real-time warehouse SKU inventory reconciliation",
      "B2B supplier ordering and customer billing audit trails",
      "Structured relational data schema for industrial parts",
    ],
    tags: ["PHP", "Inventory ERP", "Relational DB", "Vercel"],
    gradient: "from-blue-600/20 via-obsidian-100 to-obsidian",
    accentColor: "sapphire",
    live: "https://shivam-pump-rajkot.vercel.app/",
    github: "https://github.com/kavathiya-ayush/shivam-pump",
    warningType: "vercel",
    credentials: { username: "admin", password: "admin" },
  },
];

export const projectCategories = [
  "All",
  "Real-Time",
  "Web & Database",
  "Desktop & Systems",
  "ERP & Inventory",
];

export const stackCategories = [
  {
    category: "Frontend & Architecture",
    description: "Creating responsive, accessible, 60fps user experiences.",
    items: [
      { icon: Atom, name: "React 18", proficiency: "Advanced", desc: "Hooks, Context, Custom Architectures" },
      { icon: Code2, name: "Next.js", proficiency: "Intermediate", desc: "SSR, SSG & Server Components" },
      { icon: FileCode2, name: "TypeScript", proficiency: "Proficient", desc: "Strict type safety & interfaces" },
      { icon: Wind, name: "Tailwind CSS", proficiency: "Expert", desc: "Design systems & fluid animations" },
      { icon: Zap, name: "Framer Motion", proficiency: "Advanced", desc: "Spring physics & layout animations" },
    ],
  },
  {
    category: "Backend & Distributed APIs",
    description: "Robust servers, real-time channels, and business logic.",
    items: [
      { icon: Server, name: "Node.js & Express", proficiency: "Advanced", desc: "REST APIs & Middleware design" },
      { icon: Globe, name: "WebSockets", proficiency: "Proficient", desc: "Real-time bidirectional messaging" },
      { icon: Code2, name: "PHP", proficiency: "Proficient", desc: "Server rendering & backend logic" },
      { icon: ShieldCheck, name: "Auth & Security", proficiency: "Proficient", desc: "JWT, Session tokens, RBAC" },
    ],
  },
  {
    category: "Databases & Storage",
    description: "Normalized schemas, ACID transactions, and low-latency queries.",
    items: [
      { icon: Database, name: "MySQL", proficiency: "Advanced", desc: "Complex joins, indexing & stored procs" },
      { icon: Database, name: "PostgreSQL", proficiency: "Proficient", desc: "Relational modeling & JSONB" },
      { icon: Database, name: "SQLite", proficiency: "Advanced", desc: "Embedded local client storage" },
    ],
  },
  {
    category: "Systems, Mobile & Tooling",
    description: "Native applications, automation engines, and version control.",
    items: [
      { icon: Cpu, name: "Python", proficiency: "Advanced", desc: "Data parsing, automation & GUI utilities" },
      { icon: Smartphone, name: "Android (Java/Kotlin)", proficiency: "Proficient", desc: "Native activities, layouts & SDKs" },
      { icon: Boxes, name: "Tauri", proficiency: "Familiar", desc: "Lightweight webview desktop software" },
      { icon: GitBranch, name: "Git & GitHub", proficiency: "Expert", desc: "Clean commits, branching & CI/CD" },
    ],
  },
];

// Flat stack for quick glance
export const stack = [
  { icon: Atom, name: "React" },
  { icon: Server, name: "Node.js" },
  { icon: Cpu, name: "Python" },
  { icon: Smartphone, name: "Android" },
  { icon: Database, name: "MySQL" },
  { icon: FileCode2, name: "TypeScript" },
  { icon: Wind, name: "Tailwind" },
  { icon: Boxes, name: "Tauri" },
];

export const whyHireMe = [
  {
    title: "Production Delivery Over Toy Demos",
    description:
      "While many student projects are basic clones, I build and deploy complete end-to-end systems with authentication, database persistence, and real-world business utility.",
    stat: "4+",
    statLabel: "Live Production Systems",
    icon: ShieldCheck,
    color: "gold",
  },
  {
    title: "Cross-Platform Engineering Range",
    description:
      "Not restricted to one framework. I seamlessly navigate between modern React frontends, Node/PHP backends, native Android mobile apps, and Python desktop automation engines.",
    stat: "3",
    statLabel: "Target Platforms Shipped",
    icon: Layers,
    color: "sapphire",
  },
  {
    title: "High Velocity & Strong CS Foundations",
    description:
      "Currently in Semester 6 B.Tech Computer Science, combining strong theoretical fundamentals (DSA, DBMS, Networks, OS) with an obsessive drive to write clean, scalable code.",
    stat: "Sem 6",
    statLabel: "Pre-Final Year CS Candidate",
    icon: Zap,
    color: "gold",
  },
];

export const timelineEvents = [
  {
    period: "2026 – Present (Current)",
    title: "Semester 6 B.Tech CS • Pre-Final Year",
    subtitle: "Actively Seeking Summer/Fall Software Engineering Internship",
    description:
      "Deepening mastery in distributed web systems, software architecture, and algorithm optimization. Ready to bring high velocity and clean engineering to a high-growth tech team.",
    tag: "Active Focus",
    badgeColor: "gold",
  },
  {
    period: "2025",
    title: "Shipped Real-Time & Healthcare Systems",
    subtitle: "Chat Wala & RedCell Connect Deployments",
    description:
      "Engineered full-stack real-time communication protocols and multi-role hospital blood bank inventory ledgers with active authentication and persistent database schemas.",
    tag: "Full-Stack Web",
    badgeColor: "sapphire",
  },
  {
    period: "2024",
    title: "Native Desktop Automation & Industrial ERP",
    subtitle: "Omni Tool Convertor & Shivam Pump Stock",
    description:
      "Engineered specialized Python algorithms to parse unstructured bank statements into structured Excel models for Chartered Accountants, alongside building an industrial inventory ERP.",
    tag: "Desktop & Systems",
    badgeColor: "gold",
  },
  {
    period: "2023",
    title: "Computer Science Core Foundations",
    subtitle: "Object-Oriented Programming, Data Structures & Algorithms",
    description:
      "Built rigorous algorithmic problem-solving capabilities, relational database design fundamentals, and version control disciplines.",
    tag: "CS Foundation",
    badgeColor: "sapphire",
  },
];
