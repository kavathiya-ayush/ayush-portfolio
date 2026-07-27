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
} from "lucide-react";

export const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Full-stack web apps — from marketing sites to complex dashboards — built for speed and long-term maintainability.",
    stack: ["React", "Next.js", "Node.js", "PostgreSQL", "Tailwind"],
    glowHover: "hover:shadow-glow-slate",
    floatDelay: "0s",
    offset: "lg:mt-0",
  },
  {
    icon: Smartphone,
    title: "Mobile Apps",
    description:
      "Native and cross-platform mobile apps that feel native, with offline support and clean release pipelines.",
    stack: ["React Native", "Android", "Java", "Kotlin", "SQLite"],
    glowHover: "hover:shadow-glow-emerald",
    floatDelay: "2s",
    offset: "lg:mt-16",
  },
  {
    icon: Monitor,
    title: "Desktop Software",
    description:
      "Lightweight desktop software for internal tools and developer utilities, without the Electron memory tax.",
    stack: ["Tauri", "Rust", "C#", ".NET", "Electron"],
    glowHover: "hover:shadow-glow-mixed",
    floatDelay: "4s",
    offset: "lg:mt-6",
  },
];

export const projects = [
  {
    title: "RedCell Connect",
    description:
      "A complete blood bank management system that helps hospitals and blood banks track inventory and manage donors efficiently.",
    tags: ["Web", "Database", "Management System", "InfinityFree"],
    gradient: "from-[#dc2626]/30 via-void-100 to-void",
    live: "https://redcell-connect.kesug.com",
    github: "https://github.com/kavathiya-ayush/RedCell-Connect/",
    warningType: "infinity",
    credentials: { username: "admin", password: "admin123" },
  },
  {
    title: "Chat Wala",
    description:
      "A WhatsApp clone web app. The only requirement is an email address to start chatting with anyone.",
    tags: ["Web", "Chat", "Real-time", "Vercel"],
    gradient: "from-green-500/20 via-void-100 to-void",
    live: "https://chat-wala-ten.vercel.app/",
    github: "https://github.com/kavathiya-ayush/chat-wala",
    warningType: "vercel",
  },
  {
    title: "Shivam Pump Stock",
    description:
      "A comprehensive submersible pump inventory and stock management system designed to track sales, supplies, and stock levels.",
    tags: ["PHP", "Inventory", "Management", "Vercel"],
    gradient: "from-blue-500/20 via-void-100 to-void",
    live: "https://shivam-pump-rajkot.vercel.app/",
    github: "https://github.com/kavathiya-ayush/shivam-pump",
    warningType: "vercel",
    credentials: { username: "admin", password: "admin" },
  },
  {
    title: "Omni Tool Convertor",
    description:
      "A native Windows desktop utility built entirely in Python. Features an advanced PDF to Excel converter and bulk image resizer. Purpose-built for CAs with specialized tools for parsing specific bank statement formats directly into Excel.",
    tags: ["Python", "Desktop App", "Data Parsing", "Automation"],
    gradient: "from-accent-slate/20 via-accent-emerald/[0.06] to-void",
    live: "https://drive.google.com/file/d/1RLYpryw8Cty_nm5snBUnjzewU4QOA2xX/view?usp=sharing",
    github: "http://github.com/kavathiya-ayush/Omni-Tool-Convertor",
    isDesktop: true,
  },
];

export const stack = [
  { icon: Atom, name: "React" },
  { icon: Server, name: "Node.js" },
  { icon: Smartphone, name: "Android" },
  { icon: Coffee, name: "Java" },
  { icon: Wind, name: "Tailwind" },
  { icon: Database, name: "MySQL" },
  { icon: FileCode2, name: "TypeScript" },
  { icon: Boxes, name: "Tauri" },
];
