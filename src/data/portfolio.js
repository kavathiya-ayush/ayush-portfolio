export const profile = {
  name: "Ayush Kavathiya",
  initials: "AK",
  role: "Software & Web Developer",
  university: "Saurashtra University",
  studyPeriod: "2024 – 2027",
  degree: "BCA · Saurashtra University (2024 – 2027)",
  degreeShort: "BCA (2024 – 2027)",
  degreeFull: "Bachelor of Computer Applications — Saurashtra University (2024 – 2027)",
  location: "India",
  availability: "Open for Developer Internships",
  summary:
    "Bachelor of Computer Applications student at Saurashtra University, building practical web applications, database-driven systems, and Python desktop utilities while seeking my first industry internship.",
  email: "ayushkavathiya322@gmail.com",
  phone: "+91 9227098500",
  phoneHref: "tel:+919227098500",
  github: "https://github.com/kavathiya-ayush/",
  githubHandle: "kavathiya-ayush",
  linkedin: "https://www.linkedin.com/in/ayush-kavathiya-223844396/",
  linkedinHandle: "ayush-kavathiya",
  languages: ["English", "Hindi", "Gujarati"],
  primarySkills: ["Communication", "Teamwork", "Problem Solving", "Quick Learning"],
  resumePath: "/ayush-kavathiya-resume.pdf",
  resumeDownloadName: "Ayush-Kavathiya-Resume.pdf",
};

export const aboutPillars = [
  {
    index: "01",
    title: "Web Applications & Frontend Craft",
    summary:
      "Building responsive web interfaces with React, HTML, CSS, and Tailwind CSS—paired with clean PHP and Laravel backends for dependable everyday use.",
    focus: "React · HTML & CSS · Tailwind CSS · PHP · Laravel",
  },
  {
    index: "02",
    title: "Database-Driven Management Systems",
    summary:
      "Structuring relational MySQL databases for blood bank networks, banking operations, and industrial stock tracking with clear role separation.",
    focus: "MySQL · Relational Schema Design · CRUD Workflows",
  },
  {
    index: "03",
    title: "Desktop Utilities & CA Automation",
    summary:
      "Writing practical Python and desktop software for Chartered Accountant firms—converting unstructured bank statement PDFs into clean Excel workbooks and organizing office workflows.",
    focus: "Python · PDF-to-Excel Parsing · Desktop Software · C#.NET",
  },
  {
    index: "04",
    title: "Responsible, Orderly Execution",
    summary:
      "Approaching software with strong communication, teamwork, quick learning, and BCA foundations from Saurashtra University—shipping functional software over unfinished mockups.",
    focus: "C · Java · Android · Git & GitHub · Problem Solving",
  },
];

export const projects = [
  {
    index: "01",
    slug: "chat-wala",
    shortName: "Chat Wala",
    featured: true,
    year: "2025",
    title: "Chat Wala",
    subtitle: "Web Communication Platform (chat-vala)",
    category: "Real-Time",
    role: "Full-Stack Web",
    domainPlate: "realtime",
    screenshot: "/projects/chat-wala.webp",
    screenshotWidth: 1920,
    screenshotHeight: 1080,
    screenshotCaption: "Chat Wala live web messaging workspace",
    description:
      "A WhatsApp Web-inspired chat application with Google sign-in, allowing users to communicate directly from the browser without registering a mobile number.",
    highlights: [
      "Google sign-in onboarding without requiring a phone number",
      "Real-time browser messaging interface inspired by WhatsApp Web",
      "Responsive layout engineered for comfortable desktop and mobile use",
    ],
    tags: ["React", "Google Sign-In", "Real-Time Chat", "Vercel"],
    live: "https://chat-wala-ten.vercel.app/",
    github: "https://github.com/kavathiya-ayush/chat-wala",
    infoText:
      "Active web application. Sign in with Google directly in the browser to test real-time messaging.",
    caseStudy: {
      problem:
        "Most mainstream messaging apps require sharing a personal phone number before starting a quick conversation, creating friction for casual or browser-only communication.",
      solution:
        "Built a clean browser-first chat web application inspired by WhatsApp Web that lets anyone authenticate with their Google account and begin messaging immediately.",
      implementation:
        "Developed the client interface in React with a familiar split sidebar-and-conversation layout, integrated Google authentication for session identity, and connected live message updates so conversations stay synchronized without manual page refreshes.",
      architectureSummary:
        "Browser React client manages active room state and UI rendering, delegates user identity to Google Sign-In, syncs messages through real-time backend listeners, and deploys statically via Vercel.",
      challenges:
        "Keeping message ordering, scroll positioning, and active conversation state consistent across rapid back-and-forth updates while ensuring the layout collapses cleanly on narrow mobile screens.",
      lessonsLearned:
        "Separating authentication state from active chat room subscriptions keeps component logic predictable and prevents duplicate listeners when users switch conversations.",
    },
    architecture: {
      summary:
        "Client-driven real-time web architecture combining Google identity with synchronized browser chat rooms.",
      nodes: [
        {
          id: "ui",
          label: "React Chat Interface",
          layer: "Client",
          tech: "React · HTML & CSS",
          role: "Renders the conversation list, active message stream, composer input, and responsive mobile drawer.",
          connectsTo: ["auth", "sync"],
          communicationNote:
            "Dispatches sign-in actions to Google Auth and subscribes to live message state updates from the real-time layer.",
        },
        {
          id: "auth",
          label: "Google Sign-In Gate",
          layer: "Identity",
          tech: "Google OAuth",
          role: "Authenticates users with their Google account so no phone number registration is required.",
          connectsTo: ["ui", "sync"],
          communicationNote:
            "Returns verified user profile metadata (name, email, avatar) used to tag outgoing messages and active sessions.",
        },
        {
          id: "sync",
          label: "Real-Time Message Channel",
          layer: "Sync",
          tech: "Live Event Stream",
          role: "Pushes incoming messages and room updates directly to connected browser sessions.",
          connectsTo: ["ui", "deploy"],
          communicationNote:
            "Persists ordered message payloads and broadcasts updates to participants in the active chat thread.",
        },
        {
          id: "deploy",
          label: "Vercel Edge Hosting",
          layer: "Delivery",
          tech: "Vercel",
          role: "Serves the compiled production web application over HTTPS for instant browser access.",
          connectsTo: ["ui"],
          communicationNote:
            "Automatically builds and serves static client bundles from the linked GitHub repository.",
        },
      ],
    },
  },
  {
    index: "02",
    slug: "redcell-connect",
    shortName: "RedCell",
    featured: true,
    year: "2025",
    title: "RedCell-Connect",
    subtitle: "Blood Donation Network & Inventory Platform",
    category: "Web & Database",
    role: "PHP & MySQL",
    domainPlate: "healthcare",
    screenshot: "/projects/redcell-connect.webp",
    screenshotWidth: 1920,
    screenshotHeight: 1080,
    screenshotCaption: "RedCell-Connect blood bank inventory and donor dashboard",
    description:
      "An online blood donation platform connecting blood donors, recipients, and blood banks—making it simpler to discover donors, monitor inventory, and coordinate donation support.",
    highlights: [
      "Connects donors, recipients, and blood banks in one unified portal",
      "Blood group availability tracking and request coordination",
      "Centralized MySQL records for donors and hospital administration",
    ],
    tags: ["PHP", "MySQL", "HTML & CSS", "Web Platform"],
    live: "https://redcell-connect.kesug.com",
    github: "https://github.com/kavathiya-ayush/RedCell-Connect/",
    warningType: "infinity",
    demoAccessNote:
      "Administrative access is protected. Reach out via email or the contact form below to request a walkthrough login.",
    caseStudy: {
      problem:
        "During urgent medical needs, finding available blood groups and matching nearby donors across fragmented phone lists or manual registers wastes critical time.",
      solution:
        "Created a centralized web portal uniting donors, recipients, and blood bank administrators so blood group stock and donor availability can be queried and updated in one place.",
      implementation:
        "Implemented server-rendered views in PHP, HTML, and CSS backed by structured MySQL tables tracking donor profiles, blood group inventory units, hospital requests, and authenticated admin controls.",
      architectureSummary:
        "Multi-role PHP server application processing authenticated form submissions and blood group queries against a normalized MySQL database.",
      challenges:
        "Designing clear access boundaries between public donor lookup, recipient requests, and administrative inventory updates so stock figures remain reliable.",
      lessonsLearned:
        "Modeling clean foreign-key relationships between donors, blood groups, and request records simplifies reporting and prevents mismatched inventory counts.",
    },
    architecture: {
      summary:
        "Server-rendered PHP & MySQL relational architecture coordinating donors, recipients, and blood bank inventory.",
      nodes: [
        {
          id: "portal",
          label: "Donor & Recipient Views",
          layer: "Interface",
          tech: "HTML · CSS",
          role: "Provides registration forms, blood group search, and donation request submission pages.",
          connectsTo: ["php"],
          communicationNote:
            "Submits validated HTTP GET/POST requests to PHP endpoints and renders server-generated HTML responses.",
        },
        {
          id: "admin",
          label: "Blood Bank Admin Console",
          layer: "Access Control",
          tech: "PHP Sessions",
          role: "Protected workspace for managing blood stock levels, reviewing requests, and updating donor records.",
          connectsTo: ["php"],
          communicationNote:
            "Verifies authenticated session state before permitting stock mutations or administrative approvals.",
        },
        {
          id: "php",
          label: "PHP Application Layer",
          layer: "Server Logic",
          tech: "PHP",
          role: "Handles routing, session authentication, request validation, and inventory calculation logic.",
          connectsTo: ["portal", "admin", "mysql"],
          communicationNote:
            "Executes structured SQL queries against MySQL and formats responses for both public and admin views.",
        },
        {
          id: "mysql",
          label: "MySQL Inventory & Donor DB",
          layer: "Persistence",
          tech: "MySQL",
          role: "Stores relational tables for donors, blood group unit counts, hospital profiles, and request logs.",
          connectsTo: ["php"],
          communicationNote:
            "Acts as the single source of truth for stock availability and donation history.",
        },
      ],
    },
  },
  {
    index: "03",
    slug: "bank-statement-converter",
    shortName: "Converter",
    featured: true,
    year: "2024",
    title: "Bank Statement Converter",
    subtitle: "Omni Tool Convertor — Python PDF-to-Excel Desktop Utility",
    category: "Desktop & Systems",
    role: "Python Desktop Engineering",
    domainPlate: "desktop",
    screenshot: "/projects/bank-statement-converter.webp",
    screenshotWidth: 1920,
    screenshotHeight: 1080,
    screenshotCaption: "Omni Tool Convertor desktop utility interface",
    description:
      "Python-based Windows desktop software designed to process bank statement PDFs and transform transaction data into structured Excel spreadsheets, paired with a bulk image resizer for routine document workflows.",
    highlights: [
      "Automated PDF-to-Excel extraction tailored for bank statement formats",
      "Reduces repetitive manual accounting data entry into reviewable sheets",
      "Includes fast batch image resizing inside the Omni Tool Convertor suite",
    ],
    tags: ["Python", "PDF-to-Excel", "Desktop Utility", "CA Automation"],
    live: "https://drive.google.com/file/d/1RLYpryw8Cty_nm5snBUnjzewU4QOA2xX/view?usp=sharing",
    github: "https://github.com/kavathiya-ayush/Omni-Tool-Convertor",
    isDesktop: true,
    caseStudy: {
      problem:
        "Chartered Accountants regularly receive multi-page bank statements as PDF files that must be re-entered into Excel for reconciliation—a slow, error-prone manual task.",
      solution:
        "Built a standalone Windows desktop utility in Python that extracts bank statement transaction rows directly from PDFs into structured Excel sheets, alongside a bulk image resizer for routine office documents.",
      implementation:
        "Wrote modular Python extraction scripts for parsing tabular statement columns, normalizing date/debit/credit/balance rows, exporting formatted `.xlsx` spreadsheets, and packaging the GUI as a Windows executable so non-technical office staff can run it without installing Python.",
      architectureSummary:
        "Local offline desktop pipeline: GUI file selector feeds PDFs into bank-format extraction rules, normalizes rows in memory, and writes clean Excel workbooks locally with zero external cloud upload.",
      challenges:
        "Different banks format multi-line transaction descriptions, wrapped narration text, and page headers differently across PDF pages—requiring careful row-stitching and header filtering logic.",
      lessonsLearned:
        "Keeping parsing rules modular per bank layout and running everything offline on the user's machine makes financial utilities both easier to maintain and trustworthy for sensitive accounting files.",
    },
    architecture: {
      summary:
        "Offline Windows Python desktop pipeline keeping sensitive financial statements 100% local.",
      nodes: [
        {
          id: "gui",
          label: "Desktop GUI Shell",
          layer: "Interface",
          tech: "Python Desktop UI",
          role: "Lets office staff pick statement PDFs, select target bank/tool mode, and choose output folders.",
          connectsTo: ["extractor", "resizer"],
          communicationNote:
            "Routes selected PDF files to the statement parser or image batches to the bulk resizer module.",
        },
        {
          id: "extractor",
          label: "PDF Table & Text Extractor",
          layer: "Ingestion",
          tech: "Python PDF Parsing",
          role: "Reads raw page text and coordinate tables from multi-page bank statement PDFs.",
          connectsTo: ["normalizer"],
          communicationNote:
            "Strips repeating page headers/footers and passes raw transaction rows to the format normalizer.",
        },
        {
          id: "normalizer",
          label: "Statement Row Normalizer",
          layer: "Processing",
          tech: "Python Parsing Rules",
          role: "Stitches wrapped descriptions and aligns Date, Narration, Debit, Credit, and Balance columns.",
          connectsTo: ["excel"],
          communicationNote:
            "Produces validated tabular records ready for direct accounting spreadsheet export.",
        },
        {
          id: "excel",
          label: "Excel Workbook Exporter",
          layer: "Output",
          tech: ".xlsx Writer",
          role: "Writes clean, structured Excel spreadsheets directly to the user's local filesystem.",
          connectsTo: ["gui"],
          communicationNote:
            "Signals completion status and output file path back to the desktop interface.",
        },
        {
          id: "resizer",
          label: "Batch Image Resizer",
          layer: "Utility Module",
          tech: "Python Image Processing",
          role: "Resizes folders of office document images in batch to consistent dimensions.",
          connectsTo: ["gui"],
          communicationNote:
            "Processes selected image directories locally and reports progress back to the GUI.",
        },
      ],
    },
  },
  {
    index: "04",
    slug: "shivam-pump-stock",
    shortName: "Shivam ERP",
    featured: true,
    year: "2024",
    title: "Shivam Pump Stock",
    subtitle: "Industrial Submersible Pump Inventory & Order Tracking",
    category: "ERP & Inventory",
    role: "PHP & Relational Database",
    domainPlate: "inventory",
    screenshot: "/projects/shivam-pump-stock.webp",
    screenshotWidth: 1920,
    screenshotHeight: 1080,
    screenshotCaption: "Shivam Pump Stock warehouse inventory and order console",
    description:
      "A submersible pump inventory and stock management web application designed to monitor warehouse stock levels, supplier inflows, and customer order records.",
    highlights: [
      "SKU-level stock tracking across submersible pump models and parts",
      "Supplier supply records paired with sales and order logs",
      "Structured relational database backing real industrial inventory",
    ],
    tags: ["PHP", "MySQL", "Inventory ERP", "Vercel"],
    live: "https://shivam-pump-rajkot.vercel.app/",
    github: "https://github.com/kavathiya-ayush/shivam-pump",
    warningType: "vercel",
    demoAccessNote:
      "Administrative access is protected. Reach out via email or the contact form below to request a walkthrough login.",
    caseStudy: {
      problem:
        "Tracking industrial submersible pump models, incoming supplier batches, and outgoing customer orders in paper notebooks makes stock reconciliation slow and prone to miscounts.",
      solution:
        "Built a structured web inventory system tailored to submersible pump operations so stock balances update directly alongside supply entries and customer sales records.",
      implementation:
        "Created inventory, supplier, and order management views in PHP with relational MySQL tables tracking model SKUs, stock quantities, inward supplies, and dispatched orders.",
      architectureSummary:
        "Focused CRUD inventory application coupling PHP handlers with relational SKU, supplier, and sales ledger tables.",
      challenges:
        "Designing the data entry screens so everyday warehouse stock updates require minimal clicks while preserving accurate historical inflow and outflow records.",
      lessonsLearned:
        "Building software around an actual local hardware business clarifies which fields genuinely matter in day-to-day inventory work versus unnecessary dashboard clutter.",
    },
    architecture: {
      summary:
        "Relational PHP & MySQL inventory ledger tracking submersible pump SKUs from supplier inflow to order dispatch.",
      nodes: [
        {
          id: "ui",
          label: "Inventory & Order UI",
          layer: "Interface",
          tech: "HTML · CSS · PHP Views",
          role: "Provides stock overview tables, supplier inflow forms, and customer order dispatch screens.",
          connectsTo: ["logic"],
          communicationNote:
            "Sends authenticated stock additions, order entries, and search filters to PHP backend handlers.",
        },
        {
          id: "logic",
          label: "Stock & Order Handlers",
          layer: "Application",
          tech: "PHP",
          role: "Validates quantities, reconciles available stock on inflow/sale, and prepares ledger summaries.",
          connectsTo: ["ui", "sku", "ledger"],
          communicationNote:
            "Coordinates updates across SKU catalog counts and supply/order history tables.",
        },
        {
          id: "sku",
          label: "SKU & Model Catalog",
          layer: "Data",
          tech: "MySQL",
          role: "Maintains submersible pump models, specifications, and current warehouse quantities.",
          connectsTo: ["logic"],
          communicationNote:
            "Provides authoritative current stock balances queried before order dispatch.",
        },
        {
          id: "ledger",
          label: "Supply & Sales History",
          layer: "Audit",
          tech: "MySQL",
          role: "Records supplier deliveries and customer order logs for straightforward stock reconciliation.",
          connectsTo: ["logic"],
          communicationNote:
            "Links every quantity adjustment to an inward supply or outward customer order record.",
        },
      ],
    },
  },
  {
    index: "05",
    slug: "apex-bank",
    shortName: "Apex-Bank",
    featured: false,
    year: "2025",
    title: "Apex-Bank Management System",
    subtitle: "Web-Based Customer Account & Transaction Platform",
    category: "Web & Database",
    role: "Full-Stack & Database",
    domainPlate: "banking",
    screenshot: "/projects/apex-bank.webp",
    screenshotWidth: 1920,
    screenshotHeight: 1080,
    screenshotCaption: "Apex-Bank Management System interface",
    description:
      "A web-based banking management system built to organize customer accounts, banking records, and daily transactions through a centralized database-backed application.",
    highlights: [
      "Centralized customer account directory and balance records",
      "Structured transaction logging for daily banking operations",
      "Relational database architecture built for consistent record keeping",
    ],
    tags: ["PHP", "MySQL", "HTML & CSS", "Database System"],
    availabilityNote: "Academic & local build — walkthrough available upon request.",
    caseStudy: {
      problem:
        "Managing customer accounts, deposit/withdrawal logs, and account balances requires strict consistency between account state and transaction history.",
      solution:
        "Built a centralized web banking management application that keeps customer profiles, balance updates, and transaction ledgers synchronized inside a relational database.",
      implementation:
        "Implemented account creation, customer record management, and daily transaction recording workflows using PHP, HTML, CSS, and MySQL.",
      architectureSummary:
        "Three-tier server-rendered banking workflow separating interface views, PHP transaction validation, and relational MySQL account/transaction tables.",
      challenges:
        "Ensuring every deposit or withdrawal updates account balances consistently alongside an auditable transaction entry.",
      lessonsLearned:
        "Thinking in terms of ledger entries rather than isolated balance edits makes financial data easier to verify and debug.",
    },
    architecture: {
      summary:
        "Centralized relational web architecture organizing customer accounts and transaction history.",
      nodes: [
        {
          id: "views",
          label: "Account & Transaction Views",
          layer: "Interface",
          tech: "HTML · CSS",
          role: "Displays customer account profiles, balance lookup, and transaction entry screens.",
          connectsTo: ["handlers"],
          communicationNote:
            "Submits customer creation and deposit/withdrawal actions to server handlers.",
        },
        {
          id: "handlers",
          label: "PHP Banking Logic",
          layer: "Application",
          tech: "PHP",
          role: "Validates account numbers, checks balances before debits, and records transaction entries.",
          connectsTo: ["views", "db"],
          communicationNote:
            "Updates customer balances and writes matching entries to the transaction table.",
        },
        {
          id: "db",
          label: "MySQL Account & Ledger DB",
          layer: "Persistence",
          tech: "MySQL",
          role: "Stores customer account tables alongside chronological banking transaction records.",
          connectsTo: ["handlers"],
          communicationNote:
            "Preserves structured relationships between each account and its full transaction history.",
        },
      ],
    },
  },
  {
    index: "06",
    slug: "ca-office-management",
    shortName: "CA Office",
    featured: false,
    year: "2025",
    title: "CA Office Management",
    subtitle: "Desktop Workspace & Workflow Automation for CA Firms",
    category: "Desktop & Systems",
    role: "Desktop Application",
    domainPlate: "ca-office",
    screenshot: "/projects/ca-office-management.webp",
    screenshotWidth: 1920,
    screenshotHeight: 1080,
    screenshotCaption: "CA Office Management desktop workspace",
    description:
      "Comprehensive office management desktop software designed for Chartered Accountant firms—providing a centralized workspace to organize daily office activities and administrative workflows.",
    highlights: [
      "Centralized desktop workspace tailored for CA firm operations",
      "Streamlines daily client tracking and administrative workflows",
      "Clean, practical interface focused on reducing routine manual friction",
    ],
    tags: ["Desktop App", "Workflow Automation", "CA Operations"],
    availabilityNote: "Private desktop build — demonstration available upon request.",
    caseStudy: {
      problem:
        "Small Chartered Accountant offices juggle recurring client filings, administrative tasks, and scattered local spreadsheets across staff desks.",
      solution:
        "Developed a centralized desktop office management application designed specifically around CA office routines to keep daily activities organized in one workspace.",
      implementation:
        "Structured dedicated client tracking, task organization, and routine administrative workflow screens inside a native desktop interface tailored for quick keyboard/mouse navigation.",
      architectureSummary:
        "Local desktop application combining a clean multi-module workspace UI with structured office task and client record storage.",
      challenges:
        "Designing an interface that stays approachable for non-technical accounting staff while covering varied daily office activities.",
      lessonsLearned:
        "Observing how real office teams organize their daily work directly informs cleaner navigation and simpler forms.",
    },
    architecture: {
      summary:
        "Focused local desktop architecture unifying daily CA client tasks and administrative workflows.",
      nodes: [
        {
          id: "workspace",
          label: "Desktop Workspace UI",
          layer: "Interface",
          tech: "Desktop GUI",
          role: "Central navigation hub for daily office activities, client lists, and workflow views.",
          connectsTo: ["workflow"],
          communicationNote:
            "Captures staff updates and renders organized task/client summaries.",
        },
        {
          id: "workflow",
          label: "Office Workflow Controller",
          layer: "Logic",
          tech: "Desktop App Logic",
          role: "Coordinates client assignments, task statuses, and routine administrative operations.",
          connectsTo: ["workspace", "records"],
          communicationNote:
            "Validates workflow state changes and synchronizes them with local office storage.",
        },
        {
          id: "records",
          label: "Local Office Records",
          layer: "Storage",
          tech: "Structured Local DB",
          role: "Persists client directories, daily office logs, and administrative records offline.",
          connectsTo: ["workflow"],
          communicationNote:
            "Ensures fast local retrieval and keeps client office data inside the firm's environment.",
        },
      ],
    },
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
    id: "frontend",
    index: "01",
    category: "Frontend & Design",
    description: "Responsive interfaces, semantic markup, and visual layout systems.",
    items: [
      {
        name: "React",
        context: "Component-driven single-page web applications and interactive user interfaces.",
        related: ["HTML & CSS", "Tailwind CSS", "Figma", "Git & GitHub"],
      },
      {
        name: "HTML & CSS",
        context: "Semantic document structure, responsive grid layouts, and modern visual styling.",
        related: ["React", "Tailwind CSS", "PHP", "Figma"],
      },
      {
        name: "Tailwind CSS",
        context: "Utility-first design systems and consistent responsive spacing.",
        related: ["React", "HTML & CSS"],
      },
      {
        name: "Figma",
        context: "Interface wireframing, visual prototyping, and layout planning.",
        related: ["HTML & CSS", "React"],
      },
    ],
  },
  {
    id: "backend",
    index: "02",
    category: "Backend & Databases",
    description: "Server-side web applications, frameworks, and relational data storage.",
    items: [
      {
        name: "PHP",
        context: "Server-rendered web applications, blood bank portals, banking & inventory systems.",
        related: ["Laravel", "MySQL", "HTML & CSS"],
      },
      {
        name: "Laravel",
        context: "Structured PHP MVC web framework for organized backend workflows.",
        related: ["PHP", "MySQL", "Git & GitHub"],
      },
      {
        name: "MySQL",
        context: "Relational schema modeling, structured tables, and transactional record storage.",
        related: ["PHP", "Laravel", "C#.NET"],
      },
    ],
  },
  {
    id: "programming",
    index: "03",
    category: "Languages & Desktop",
    description: "Core programming languages, desktop automation, and mobile development.",
    items: [
      {
        name: "Python",
        context: "Desktop utilities, PDF-to-Excel bank statement parsing, and batch automation.",
        related: ["Git & GitHub", "C", "Java"],
      },
      {
        name: "C#.NET",
        context: "Structured object-oriented desktop and application development.",
        related: ["Java", "C", "MySQL"],
      },
      {
        name: "Java",
        context: "Object-oriented software fundamentals and Android application logic.",
        related: ["Android", "C", "C#.NET"],
      },
      {
        name: "C",
        context: "Procedural programming foundations, memory basics, and algorithmic problem solving.",
        related: ["Java", "Python", "C#.NET"],
      },
      {
        name: "Android",
        context: "Mobile application layouts, screens, and native Android development basics.",
        related: ["Java", "Figma"],
      },
    ],
  },
  {
    id: "tooling",
    index: "04",
    category: "Productivity & Workflow",
    description: "Version control, documentation, and presentation tooling.",
    items: [
      {
        name: "Git & GitHub",
        context: "Source version control, clean repository history, and deployment workflows.",
        related: ["React", "PHP", "Python", "Laravel"],
      },
      {
        name: "MS Office & Presentations",
        context: "Structured spreadsheets, financial data review, and clear technical slide decks.",
        related: ["Python", "Figma"],
      },
    ],
  },
];

export const bcaFoundations = [
  {
    index: "01",
    title: "Programming in C & Java",
    detail: "Procedural foundations, control flow, and structured problem solving.",
  },
  {
    index: "02",
    title: "Relational DBMS & MySQL",
    detail: "Normalized table design, SQL queries, and transactional integrity.",
  },
  {
    index: "03",
    title: "Web Development",
    detail: "Frontend interfaces in HTML, CSS, React paired with PHP & Laravel.",
  },
  {
    index: "04",
    title: "Object-Oriented Design",
    detail: "Modular classes, encapsulation, and maintainable application structure.",
  },
  {
    index: "05",
    title: "Desktop & Android",
    detail: "Python utilities, C#.NET basics, and native Android screen layouts.",
  },
  {
    index: "06",
    title: "Communication & Teamwork",
    detail: "Orderly collaboration, clear documentation, and quick learning.",
  },
];

export const timelineEvents = [
  {
    period: "2024 – 2027",
    title: "Bachelor of Computer Applications (BCA)",
    subtitle: "Saurashtra University · Seeking First Industry Work Experience",
    description:
      "Pursuing BCA while building practical full-stack web applications, database-driven systems, and desktop utilities—combining coursework with real deployed software.",
    tag: "Education",
  },
  {
    period: "2025",
    title: "Web Platforms & CA Office Software",
    subtitle: "Chat Wala · RedCell-Connect · Apex-Bank · CA Office Management",
    description:
      "Developed a Google sign-in web chat platform, a blood donation network, a database-backed banking management system, and workflow software for Chartered Accountant offices.",
    tag: "Web & Desktop",
  },
  {
    period: "2024",
    title: "Python Automation & Industrial Inventory",
    subtitle: "Bank Statement Converter (Omni Tool Convertor) & Shivam Pump Stock",
    description:
      "Built a Python PDF-to-Excel bank statement converter and bulk image resizer for CA workflows alongside a PHP/MySQL submersible pump stock management system.",
    tag: "Automation & ERP",
  },
];
