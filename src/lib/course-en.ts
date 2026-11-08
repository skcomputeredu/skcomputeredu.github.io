import type { Module } from "@/lib/courses";

export type CourseEn = {
  duration: string;
  level: string;
  certificate: string;
  summary: string;
  forWhom: string[];
  outcomes: string[];
  tools: string[];
  modules: Module[];
  project: string;
  note?: string;
};

export const courseEn: Record<string, CourseEn> = {
  "basic-computer": {
    duration: "3–6 months",
    level: "Beginner",
    certificate: "Institute certificate",
    summary:
      "This course is for a first-time computer user. From the mouse to files, Windows, the internet and everyday tasks — taught hands-on in the lab.",
    forWhom: [
      "People who have barely touched a computer",
      "Anyone restarting study from home",
      "Shop work, a job, or helping children with a computer",
      "Students who want CCC, DCA or Office next",
    ],
    outcomes: [
      "Switch on a computer and finish a task alone",
      "Handle files, folders, a pen drive and printing",
      "Search in a browser and send a simple email",
      "A clear base for the next course",
    ],
    tools: ["Windows", "File Explorer", "Notepad", "Paint", "Chrome"],
    project: "Create your own folder and submit a short document, one picture and a PDF.",
    modules: [
      {
        title: "What a computer is made of",
        points: [
          "Hardware and software, in plain words",
          "CPU, RAM and storage — what the shop words mean",
          "Monitor, keyboard, mouse, printer and scanner",
          "Desktop, laptop and phone: what changes for work",
        ],
      },
      {
        title: "Windows and files",
        points: [
          "Desktop, Start menu and taskbar",
          "Make a folder, rename, copy and paste",
          "Use a pen drive and eject it safely",
          "Recycle Bin, shortcuts and finding things on screen",
        ],
      },
      {
        title: "Everyday small programs",
        points: [
          "Write and save in Notepad",
          "A simple edit in Paint",
          "Open a PDF, print it and choose pages",
          "Keys that matter: Shift, Ctrl, Enter, Backspace",
        ],
      },
      {
        title: "First steps on the internet",
        points: [
          "Open a browser and find a site",
          "Simple habits for a password",
          "Why you do not share unknown links or an OTP",
          "A first look at an email account",
        ],
      },
    ],
  },
  ccc: {
    duration: "2–3 months",
    level: "Beginner to intermediate",
    certificate: "NIELIT exam preparation plus institute practice record",
    summary:
      "Built on the NIELIT CCC pattern. Many government forms, banks and jobs ask for CCC. Theory plus practical Word, Excel, presentations and internet.",
    forWhom: [
      "A job that asks for CCC",
      "You know the basics and want a recognised course",
      "You want a full computer package in a short time",
    ],
    outcomes: [
      "Work through the CCC syllabus with confidence",
      "A working level of word processing, spreadsheets and slides",
      "A sense of e-governance and digital payments",
      "Mock practice before the exam",
    ],
    tools: ["Windows", "LibreOffice / MS Office", "Browser", "Email"],
    project: "A document like an application form, a small sheet and a five-slide presentation.",
    note: "The NIELIT exam form and fee are separate. The centre prepares you. NIELIT conducts the exam.",
    modules: [
      {
        title: "Computer and operating system",
        points: [
          "Input, output, memory and storage",
          "Kinds of software and file formats",
          "Windows settings, users and basic care",
          "Shortcuts that speed up work",
        ],
      },
      {
        title: "Word processing",
        points: [
          "A letter, biodata and application layout",
          "Font, margins, header, footer and page numbers",
          "Tables, bullets and pictures",
          "Print preview and making a PDF",
        ],
      },
      {
        title: "Spreadsheet and presentation",
        points: [
          "Cells, rows, columns and a simple formula",
          "Sum, average and a short list",
          "Slides, titles and a clean layout",
          "A first chart",
        ],
      },
      {
        title: "Internet, email and digital services",
        points: [
          "Search, download and safe browsing",
          "Write email, attach a file and use folders",
          "Recognise common e-governance services",
          "Care with digital payments and cyber hygiene",
        ],
      },
    ],
  },
  adca: {
    duration: "12 months",
    level: "Intermediate and beyond",
    certificate: "One-year institute diploma",
    summary:
      "A full-year advanced diploma. Office, internet, a start in design, a glimpse of the web and a project — a complete path if you want computers as your work.",
    forWhom: [
      "You want one year and a full package",
      "You want more than DCA, or a deeper course from the start",
      "An office job plus a little design and web",
    ],
    outcomes: [
      "Work freely in the office suite",
      "Build a small web page and a design file yourself",
      "Solid habits with files and internet tools",
      "A project you can keep in a portfolio",
    ],
    tools: ["MS Office", "Browser", "Intro HTML/CSS", "Intro Photoshop"],
    project: "A small website or office report, plus a banner and a presentation.",
    modules: [
      {
        title: "A strong base",
        points: [
          "Computer architecture in plain language",
          "Windows care: users, backup, updates",
          "A habit of typing speed and accuracy",
          "File names that still make sense later",
        ],
      },
      {
        title: "Office mastery",
        points: [
          "Long documents and styles in Word",
          "Excel formulas, sort and filter",
          "Professional slides in PowerPoint",
          "A look at PDF, print and mail merge",
        ],
      },
      {
        title: "A start in design and web",
        points: [
          "Colour, type and a clean poster",
          "Crop, text and export in Photoshop",
          "An HTML page and colour with CSS",
          "How the page looks on a phone",
        ],
      },
      {
        title: "Project and professional habits",
        points: [
          "Split work into folders",
          "How to show work to a teacher or a client",
          "Do not lift someone else's file",
          "Present the final project",
        ],
      },
    ],
  },
  dca: {
    duration: "12 months",
    level: "Beginner to intermediate",
    certificate: "One-year institute diploma",
    summary:
      "A year-long diploma in computer applications. After the basics, a straight path to job-ready office skills, the internet and a first step in programming.",
    forWhom: [
      "A computer diploma after class 12",
      "Preparing for office assistant or data work",
      "Several skills inside one course",
    ],
    outcomes: [
      "Office documents and sheets with confidence",
      "Working habits with internet, email and cloud",
      "The first logic of programming",
      "A finished diploma project",
    ],
    tools: ["Windows", "MS Office", "Internet", "Introduction to C"],
    project: "An office case study: report, sheet, slides and a small program.",
    modules: [
      {
        title: "Fundamentals and operating system",
        points: [
          "A short history, then today's PC",
          "Installing and removing software",
          "File systems and backup",
          "Basic protection from viruses",
        ],
      },
      {
        title: "Office applications",
        points: [
          "Business letters and tables",
          "A marks sheet or a simple account",
          "Charts and print layout",
          "Speaking with a presentation, not reading every slide",
        ],
      },
      {
        title: "Internet and communication",
        points: [
          "Browser, downloads and bookmarks",
          "Email manners",
          "Keeping files on Google Drive",
          "Filling an online form",
        ],
      },
      {
        title: "A first look at programming",
        points: [
          "An algorithm means thinking step by step",
          "What variables, if and loops mean",
          "Very small C programs",
          "Read a mistake and run it again",
        ],
      },
    ],
  },
  "o-level": {
    duration: "12 months",
    level: "Intermediate",
    certificate: "NIELIT exam preparation",
    summary:
      "One year of preparation on the current NIELIT O Level pattern: IT tools, web design, Python and a working idea of IoT.",
    forWhom: [
      "You plan to sit NIELIT O Level",
      "You want a stronger government-recognised computer qualification",
      "Exam-ready web and Python preparation",
    ],
    outcomes: [
      "Coverage of the four modules",
      "A habit of practical files",
      "A rhythm of study and mocks",
      "A clear picture of what the exam asks",
    ],
    tools: ["Office tools", "HTML/CSS", "Python", "Browser"],
    project: "One file per module: a document, a web page, a Python program and IoT notes.",
    note: "Teaching follows NIELIT's current modules (IT Tools, Web Designing, Python, IoT). Registration and exam fees follow NIELIT rules.",
    modules: [
      {
        title: "IT tools and network basics",
        points: [
          "Computer, operating system and office tools",
          "Files, security and backup",
          "Network, internet and email",
          "Practical use of digital services",
        ],
      },
      {
        title: "Web designing and publishing",
        points: [
          "The bones of a page in HTML",
          "Colour, type and layout in CSS",
          "Images, links and tables",
          "A multi-page site that also opens on a phone",
        ],
      },
      {
        title: "Programming with Python",
        points: [
          "Variables, types and input",
          "Conditions, loops and functions",
          "Lists and reading a small file",
          "Read an error and fix it",
        ],
      },
      {
        title: "Understanding the Internet of Things",
        points: [
          "What sensors and smart devices are",
          "Everyday examples: meters and home devices",
          "Where data goes, and why security matters",
          "Explain one small case in writing",
        ],
      },
    ],
  },
  "hindi-typing": {
    duration: "3–6 months",
    level: "Beginner",
    certificate: "Institute certificate",
    summary:
      "Real Hindi typing needs both Unicode and Remington / Kruti Dev. Many local forms still ask for Kruti Dev, while government work uses Unicode. This course builds both.",
    forWhom: [
      "Hindi typing for data entry or an office",
      "Court, school or office work in Hindi",
      "You want speed and accuracy together",
    ],
    outcomes: [
      "A rhythm of copy typing",
      "Comfort with Unicode (Mangal / Google Input)",
      "Recognition and practice of the Remington layout",
      "Fewer mistakes, then more speed",
    ],
    tools: ["Kruti Dev", "Unicode / Mangal", "Typing tutor", "Word"],
    project: "A full Hindi letter and a table, in both layouts, against the clock.",
    modules: [
      {
        title: "Sitting right and the keyboard",
        points: [
          "Home fingers and posture",
          "Eyes on the screen, not the keys",
          "Space, Shift and matras",
          "A small daily target",
        ],
      },
      {
        title: "Unicode typing",
        points: [
          "Vowels, consonants and matras",
          "Conjuncts and halant",
          "Numbers and punctuation",
          "Setting the font in Word",
        ],
      },
      {
        title: "Remington and Kruti Dev",
        points: [
          "A map of the layout",
          "Remembering where common letters sit",
          "Why old files are still in this font",
          "Care when converting to Unicode",
        ],
      },
      {
        title: "Speed and exam-style practice",
        points: [
          "Type a passage and count errors",
          "Use Backspace less",
          "Finish one page on time",
          "A habit of proofreading",
        ],
      },
    ],
  },
  "english-typing": {
    duration: "3–6 months",
    level: "Beginner",
    certificate: "Institute certificate",
    summary:
      "English touch typing. From the home row to letters, words and full paragraphs. The same speed helps data entry, office work and every later course.",
    forWhom: [
      "You want to type without looking at the keys",
      "Forms, mail and data are in English",
      "Speed plus a habit of correct spelling",
    ],
    outcomes: [
      "The base of touch typing",
      "Accuracy first, speed after",
      "Practice with capitals, numbers and punctuation",
      "One clean typed document",
    ],
    tools: ["Typing tutor", "Notepad", "MS Word"],
    project: "A five-minute passage, errors marked, then a clean copy.",
    modules: [
      {
        title: "Home row and posture",
        points: [
          "Fingers on ASDF and JKL;",
          "Look at the screen, not the keyboard",
          "Shoulders and wrists relaxed",
          "Short drills, repeated daily",
        ],
      },
      {
        title: "The full alphabet",
        points: [
          "Top and bottom rows",
          "Capitals with Shift",
          "Common words and sight words",
          "Breaking a wrong-finger habit",
        ],
      },
      {
        title: "Numbers, signs and format",
        points: [
          "Number row and a look at the number pad",
          "Comma, full stop and brackets",
          "Typing an email and an address",
          "Alignment in Word",
        ],
      },
      {
        title: "Speed tests",
        points: [
          "One-minute and five-minute tests",
          "What an accuracy percentage means",
          "Extra drills for weak letters",
          "Finish a letter on time",
        ],
      },
    ],
  },
  "hardware-networking": {
    duration: "3–6 months",
    level: "Beginner to intermediate",
    certificate: "Institute certificate",
    summary:
      "Open a PC, name the parts, install Windows and join a small office network. Printers, cables and common faults, without fear.",
    forWhom: [
      "You want the skill of repairing a computer",
      "You will look after hardware in an office or cyber café",
      "You want networking basics, not heavy theory",
    ],
    outcomes: [
      "Open a case and identify RAM, disk and cables",
      "Install an OS and drivers",
      "Fix common printer and internet faults",
      "Join a small LAN and test file sharing",
    ],
    tools: ["PC toolkit", "Windows installer", "LAN cable", "Printer"],
    project: "Assemble or reassemble a PC and share a file on the network.",
    modules: [
      {
        title: "Parts and safety",
        points: [
          "SMPS, motherboard, RAM, storage and processor",
          "Static safety and a habit with screws",
          "Which cable goes where",
          "Simple signs that an old part is weak",
        ],
      },
      {
        title: "Assembly and the OS",
        points: [
          "Seat the parts in the case",
          "The BIOS/UEFI settings that matter",
          "Install Windows",
          "Drivers, what activation means, and updates",
        ],
      },
      {
        title: "Peripherals and faults",
        points: [
          "No display, beeps, no boot",
          "Keyboard, mouse and USB ports",
          "Shared printer and a paper jam",
          "A slow PC: full disk or low RAM",
        ],
      },
      {
        title: "Networking basics",
        points: [
          "IP, router and switch in working language",
          "LAN cable versus Wi-Fi",
          "Share a file and a printer",
          "If the internet is down, check in order",
        ],
      },
    ],
  },
  "software-installation": {
    duration: "1 month",
    level: "Beginner",
    certificate: "Institute certificate",
    summary:
      "A straight one-month course: install Windows, Office, a browser, PDF tools and printer drivers the right way. Very practical if you look after an office system.",
    forWhom: [
      "You want to set up a new laptop",
      "You are responsible for software in an office",
      "A light start before the hardware course",
    ],
    outcomes: [
      "Install software from a pen drive or an installer",
      "Understand drivers and updates",
      "Spot unwanted software",
      "Take a backup before you change anything",
    ],
    tools: ["Windows", "Office setup", "Browser", "PDF reader", "Drivers"],
    project: "Complete a clean setup checklist and show it.",
    modules: [
      {
        title: "Before you install",
        points: [
          "Check what the system needs",
          "Back up important files",
          "Tell a real installer from a fake one",
          "What administrator permission is",
        ],
      },
      {
        title: "Windows and Office",
        points: [
          "Install steps, and care with partitions",
          "Create a user account",
          "Install Office or a free office suite",
          "Activation and updates",
        ],
      },
      {
        title: "Everyday tools",
        points: [
          "Browser, PDF reader and a zip tool",
          "Printer and scanner drivers",
          "Install fonts, including Hindi fonts",
          "Remove heavy programs from startup",
        ],
      },
      {
        title: "Safety and removal",
        points: [
          "Basic antivirus settings",
          "Uninstall cleanly",
          "The risk of browser extensions",
          "What to do when an install stops halfway",
        ],
      },
    ],
  },
  "ms-office": {
    duration: "1–2 months",
    level: "Beginner to intermediate",
    certificate: "Institute certificate",
    summary:
      "Word, Excel and PowerPoint — enough grip to get real work done. Letters, accounts, a marks sheet and meeting slides. A short course, straight to practicals.",
    forWhom: [
      "You need office work quickly",
      "Basics are done and you need documents",
      "Teachers, shops or staff work that needs Office",
    ],
    outcomes: [
      "A clean letter and a resume",
      "Sum, average and lists in a sheet",
      "A ten-slide presentation",
      "Export a PDF and send it",
    ],
    tools: ["Microsoft Word", "Excel", "PowerPoint"],
    project: "One school or shop file: report, sheet and presentation.",
    modules: [
      {
        title: "Word",
        points: [
          "Font, style and paragraphs",
          "Tables, images and a page border",
          "Header, footer and page numbers",
          "Print and PDF",
        ],
      },
      {
        title: "Excel basics",
        points: [
          "Cells, formulas and AutoSum",
          "Sort, filter and format",
          "A simple chart",
          "Print area and fit to page",
        ],
      },
      {
        title: "PowerPoint",
        points: [
          "A clean slide without heavy theory",
          "Few words, a large title",
          "Pictures kept tidy",
          "Slide show and export",
        ],
      },
      {
        title: "Using all three together",
        points: [
          "Bring an Excel chart into a slide",
          "Copy a Word table the right way",
          "File names and folders",
          "Send a document by email",
        ],
      },
    ],
  },
  "web-designing": {
    duration: "3–6 months",
    level: "Beginner to intermediate",
    certificate: "Institute certificate",
    summary:
      "Learn HTML, CSS and a little JavaScript and build your own small website. It should look right on a phone, use clear colours, and be a page you can actually link.",
    forWhom: [
      "You want to build websites, not a heavy backend",
      "A shop or coaching page is the goal",
      "A start in both design and code",
    ],
    outcomes: [
      "Write a multi-page site by hand",
      "A mobile-friendly layout",
      "The base of a form and a button",
      "Understand how a page goes on free hosting",
    ],
    tools: ["HTML", "CSS", "Intro JavaScript", "VS Code", "Browser"],
    project: "A three-page site: home, courses and contact — yours, in the spirit of this centre.",
    modules: [
      {
        title: "Structure with HTML",
        points: [
          "Tags, headings, paragraphs and lists",
          "Links, images and tables",
          "Form inputs",
          "Join pages inside a folder",
        ],
      },
      {
        title: "Look with CSS",
        points: [
          "Colour, type and spacing",
          "The box model",
          "Rows and columns with flex",
          "The same button and card, repeated",
        ],
      },
      {
        title: "Mobile and a little JavaScript",
        points: [
          "A media query for a small screen",
          "A menu that opens and closes",
          "A simple check so an empty form does not go",
          "Fast images and clear names",
        ],
      },
      {
        title: "Publishing",
        points: [
          "What a domain and hosting are",
          "How files reach a server",
          "Check your site on a phone",
          "Small faults: a broken image, a wrong path",
        ],
      },
    ],
  },
  "graphic-designing": {
    duration: "3–6 months",
    level: "Beginner to intermediate",
    certificate: "Institute certificate",
    summary:
      "Posters, social posts, visiting cards and banners. Fast work in Canva and deeper control in Photoshop. Colour and type taught so the design does not look cheap.",
    forWhom: [
      "Shop, Instagram or print work",
      "You want full design, not Photoshop alone",
      "A start in freelance work",
    ],
    outcomes: [
      "Three posts and one poster for one brand",
      "Print size and RGB versus CMYK",
      "Courage with fonts, not clutter",
      "Hand a file to a client in the right format",
    ],
    tools: ["Canva", "Photoshop", "Layout basics"],
    project: "A small business kit: logo lockup, card, poster and three social posts.",
    modules: [
      {
        title: "Learning to see",
        points: [
          "Alignment, proximity and empty space",
          "Two fonts are enough",
          "Three roles for colour: base, ink and emphasis",
          "Compare a strong poster with a weak one",
        ],
      },
      {
        title: "Fast work in Canva",
        points: [
          "Size presets and a custom size",
          "Grid, margin and a brand kit",
          "Photo cutout and background",
          "Export: PNG, JPG, PDF",
        ],
      },
      {
        title: "Control in Photoshop",
        points: [
          "Layers, masks and text",
          "Colour correction without over-smoothing skin",
          "Resolution for print",
          "Save the PSD and keep a flat copy separate",
        ],
      },
      {
        title: "Print and social",
        points: [
          "Bleed on a visiting card",
          "Ratios for a story, a post and a thumbnail",
          "Hindi text large enough to read",
          "Delivery and a revision",
        ],
      },
    ],
  },
  photoshop: {
    duration: "1–2 months",
    level: "Beginner",
    certificate: "Institute certificate",
    summary:
      "Photoshop only. Fix a photo, change a background, put text and colour on a banner. A short course, and a file opens in every class.",
    forWhom: [
      "You want photo editing quickly",
      "Learn the tool before a wider graphics course",
      "Make your own shop banners",
    ],
    outcomes: [
      "Layers stop being scary",
      "Crop, heal and a basic colour clean",
      "A banner with text",
      "Save correctly for web and for print",
    ],
    tools: ["Adobe Photoshop"],
    project: "Three before-and-after photos and one event banner.",
    modules: [
      {
        title: "Interface and files",
        points: [
          "Toolbar, layers panel and zoom",
          "A new file: size and resolution",
          "PSD versus export",
          "Undo and history",
        ],
      },
      {
        title: "Photo correction",
        points: [
          "Crop, straighten and canvas",
          "Exposure and colour without excess",
          "Remove a spot, and care with the clone tool",
          "Select a background",
        ],
      },
      {
        title: "Layers, text and shapes",
        points: [
          "Layer order and names",
          "Masks for a non-destructive edit",
          "Hindi and English text, and a shadow",
          "Simple shapes and lines",
        ],
      },
      {
        title: "Banners and delivery",
        points: [
          "Size of a social post",
          "Resolution for a flex banner",
          "When to use JPG, PNG or PDF",
          "Keep the layered file separate",
        ],
      },
    ],
  },
  ai: {
    duration: "2–3 months",
    level: "Beginner to intermediate",
    certificate: "Institute certificate",
    summary:
      "Not heavy maths — AI you can use. Write a prompt, make notes, try an image idea, get help in Office, and know when an answer is wrong. For students and small businesses. These tools are now part of study, shop work and jobs. The person who learns to ask clearly works faster and can spot a wrong answer.",
    forWhom: [
      "You want to use tools like ChatGPT cleanly",
      "Save time in study, office or a shop",
      "The word AI is intimidating and you want a start",
      "You want help with homework, mail and a small poster, without copying",
    ],
    outcomes: [
      "A structure for a clear prompt",
      "Improve study notes and a mail draft",
      "Responsible use of image tools",
      "Avoid private data and copied work",
      "Spot a wrong answer and finish the work yourself",
    ],
    tools: ["Chat assistants", "Browser", "Docs", "Image tools", "Excel"],
    project: "A one-week AI workflow document for your course or your shop.",
    note: "This is not a machine-learning research course. In two to three months you learn practical AI so the tools serve your work.",
    modules: [
      {
        title: "What AI is actually doing",
        points: [
          "A model guesses an answer. It does not know.",
          "Chat, image and voice tools are different",
          "Free and paid limits",
          "When a human must check",
        ],
      },
      {
        title: "Writing prompts",
        points: [
          "Role, task, limit and format",
          "Improve a weak prompt",
          "Shorten long notes",
          "Ask in Hindi and in English",
        ],
      },
      {
        title: "Study and office",
        points: [
          "Turn a chapter into questions, then match the answers yourself",
          "Draft a mail or an application",
          "Get a sheet formula explained",
          "An outline for slides",
        ],
      },
      {
        title: "Images, honesty and safety",
        points: [
          "An image prompt: subject, light, what must not appear",
          "Do not make someone's photo without permission",
          "Do not paste passwords, Aadhaar or client data into a chat",
          "Read AI text before you put your name on it",
        ],
      },
    ],
  },
  "internet-email": {
    duration: "1 month",
    level: "Beginner",
    certificate: "Institute certificate",
    summary:
      "One month to use the internet without panic. Browser, search, Gmail, Google Drive, online forms and how to avoid fraud. On phone and computer.",
    forWhom: [
      "You have never made an email",
      "You must fill online admission forms",
      "The household internet should be safer",
    ],
    outcomes: [
      "Your own email and a strong password",
      "Send an attachment and find it again",
      "Share a file from Drive",
      "Recognise a fake link",
    ],
    tools: ["Chrome", "Gmail", "Google Drive", "Files from WhatsApp"],
    project: "Fill a form from your email and send the teacher a Drive link.",
    modules: [
      {
        title: "The browser",
        points: [
          "Address bar versus search",
          "Tabs, bookmarks and history",
          "The downloads folder",
          "Zoom and translate",
        ],
      },
      {
        title: "Email",
        points: [
          "Create an account and a recovery number",
          "Write a mail, subject and sign-off",
          "Attachments and size",
          "Inbox, spam and delete",
        ],
      },
      {
        title: "Drive and forms",
        points: [
          "Upload a file and make a folder",
          "A link to view or to edit",
          "Fill a Google Form",
          "Download a PDF and keep it in the right place",
        ],
      },
      {
        title: "Safety",
        points: [
          "Why repeating a password is a bad idea",
          "Never share an OTP or a PIN",
          "Links that promise a deal that is too good",
          "Care on public Wi-Fi",
        ],
      },
    ],
  },
  "advanced-excel": {
    duration: "3 months",
    level: "Intermediate",
    certificate: "Institute certificate",
    summary:
      "Three deeper months for people who already know basic Excel. Lookups, pivot tables, dashboard-style charts and data validation — for accounts, stock and office reports.",
    forWhom: [
      "You work in sheets daily and formulas stall you",
      "You handle accounts, stock or student data",
      "You want depth after the Office course",
    ],
    outcomes: [
      "Join two lists with VLOOKUP or XLOOKUP",
      "A monthly report from a pivot table",
      "Stop a wrong entry",
      "One clean dashboard page",
    ],
    tools: ["Microsoft Excel"],
    project: "Three months of sales or fee data: pivot, charts and one summary page.",
    note: "Join only if you already know sum, average and cell references. Otherwise take MS Office first.",
    modules: [
      {
        title: "A grip on formulas",
        points: [
          "Relative and absolute references",
          "IF, AND, OR",
          "SUMIF, COUNTIF, AVERAGEIF",
          "Text and date functions an office actually uses",
        ],
      },
      {
        title: "Join and clean data",
        points: [
          "VLOOKUP and XLOOKUP",
          "Remove duplicates",
          "Text to columns",
          "Catch a wrong date or number format",
        ],
      },
      {
        title: "Pivot and charts",
        points: [
          "Month, name and total from a pivot",
          "A look at slicers",
          "Column, line and donut — when to use which",
          "A chart that does not lie: axis and title",
        ],
      },
      {
        title: "Control and reports",
        points: [
          "Data validation and a dropdown",
          "Protect a sheet",
          "Print layout and a PDF report",
          "What a macro is — a light recording, not magic",
        ],
      },
    ],
  },
  "c-cpp": {
    duration: "2–3 months",
    level: "Beginner",
    certificate: "Institute certificate",
    summary:
      "A real start in programming with C. Variables, conditions, loops, functions, arrays and a first look at a class in C++. A base for college and diploma work, not a full software-engineering course.",
    forWhom: [
      "Coding for the first time",
      "College C is coming and you need a base",
      "You want both logic and syntax",
    ],
    outcomes: [
      "Write and run small programs yourself",
      "Read an error line number",
      "Keep data in an array",
      "See the difference between C and C++",
    ],
    tools: ["C compiler", "C++ compiler", "VS Code or a similar editor"],
    project: "A marks sheet or a small calculator program, with a menu.",
    modules: [
      {
        title: "Starting the language",
        points: [
          "How a program runs",
          "Variables: int, float, char",
          "Input and output",
          "Read a compiler error without panic",
        ],
      },
      {
        title: "Decisions and repetition",
        points: [
          "if, else, else if",
          "for and while",
          "When a nested loop is needed",
          "Small patterns and sum programs",
        ],
      },
      {
        title: "Functions and arrays",
        points: [
          "Why you split work into functions",
          "A one-dimensional array",
          "Search and the largest number",
          "Basic string handling",
        ],
      },
      {
        title: "The doorstep of C++",
        points: [
          "cin, cout and headers",
          "What a class and an object mean",
          "Write one small class",
          "An introduction to pointers — a map, not fear",
        ],
      },
    ],
  },
  "data-entry": {
    duration: "2–3 months",
    level: "Beginner to intermediate",
    certificate: "Institute certificate",
    summary:
      "Real data entry is not speed alone. It is speed with a correct entry. English and Hindi, Excel lists, forms and proofreading. Preparation for office orders and back-office work.",
    forWhom: [
      "You want the role of a data entry operator",
      "Typing plus sheets",
      "Entry work from home or in an office",
    ],
    outcomes: [
      "A rhythm of steady copy entry",
      "A clean list in Excel",
      "Forms in both Hindi and English",
      "Catch your own mistake",
    ],
    tools: ["Word", "Excel", "Hindi typing", "English typing", "PDF"],
    project: "A fifty-row customer list, with a check report.",
    modules: [
      {
        title: "Discipline before entry",
        points: [
          "Source paper and screen together",
          "One format for names, numbers and addresses",
          "Empty cells and extra spaces",
          "Breaks that save your eyes",
        ],
      },
      {
        title: "English and Hindi entry",
        points: [
          "Mixed forms: name in English, address in Hindi",
          "One style for numbers and dates",
          "Reading from a scan",
          "Mark an unclear letter. Do not guess.",
        ],
      },
      {
        title: "Data in Excel",
        points: [
          "Column headers that still work later",
          "A dropdown so spelling stays one way",
          "Check with sort and filter",
          "Catch a duplicate mobile number",
        ],
      },
      {
        title: "Quality and time",
        points: [
          "Read twice",
          "Note the time and know your own speed",
          "File versions: v1, v2, final",
          "A short cover note when you submit",
        ],
      },
    ],
  },
  "video-editing": {
    duration: "2–3 months",
    level: "Beginner to intermediate",
    certificate: "Institute certificate",
    summary:
      "Reels, YouTube and short event videos. Cuts, text, music and voice level. Start on a phone app and finish with a clean export on a computer.",
    forWhom: [
      "You want reels and short videos",
      "Cut an event or shop video yourself",
      "Learn to sit voice and music together",
    ],
    outcomes: [
      "A clean one-minute video from raw footage",
      "Text that can be read",
      "Music that does not bury the voice",
      "Sizes for both phone and YouTube",
    ],
    tools: ["CapCut or a similar phone app", "A computer editor", "Audio levels"],
    project: "A 45–60 second promo for the centre or your shop, with music.",
    modules: [
      {
        title: "Understand the shoot, then edit",
        points: [
          "Straight light and a shaky phone",
          "Choose clips. Do not keep everything.",
          "Timeline, cut and split",
          "Start with a cover shot",
        ],
      },
      {
        title: "Text and pace",
        points: [
          "Few words, large type",
          "Safe margins, or the text gets cut",
          "A jump cut and a simple transition",
          "When too many effects hurt the video",
        ],
      },
      {
        title: "Mixing",
        points: [
          "Voice, music and room noise",
          "Keep music under the voice",
          "Fade in and fade out",
          "A safe track instead of copyrighted music",
        ],
      },
      {
        title: "Export",
        points: [
          "A vertical reel and a horizontal YouTube frame",
          "Resolution and file size",
          "Pick a cover frame",
          "Check on a phone after export",
        ],
      },
    ],
  },
  dtp: {
    duration: "3–6 months",
    level: "Beginner to intermediate",
    certificate: "Institute certificate",
    summary:
      "Make books, cards, pamphlets, bill books and banners that are ready to print. Real press work with CorelDRAW and page layout — for a shop, a press or freelance jobs.",
    forWhom: [
      "Design for a printing press or a shop",
      "Visiting cards, wedding cards and flex banners",
      "Page layout along with graphics",
    ],
    outcomes: [
      "Print size, bleed and CMYK",
      "Build a card, a letterhead and a pamphlet yourself",
      "A vector logo and a simple photo fix",
      "Hand the press a correct file",
    ],
    tools: ["CorelDRAW", "Page layout", "Photoshop", "PDF for print"],
    project: "A small print kit: visiting card, letterhead, pamphlet and banner.",
    modules: [
      {
        title: "The language of print",
        points: [
          "Screen versus paper",
          "Resolution, bleed and safe margin",
          "When to use RGB and when CMYK",
          "Keep fonts and image files together",
        ],
      },
      {
        title: "Page layout",
        points: [
          "Margins, columns and a ladder of headings",
          "What a master page means",
          "One page of a book or a register",
          "Hindi and English text on the same page",
        ],
      },
      {
        title: "Jobs in CorelDRAW",
        points: [
          "Shapes, text and colour",
          "Visiting card and letterhead",
          "A simple logo and icon",
          "The proportion of a flex banner",
        ],
      },
      {
        title: "Photo, PDF and the press",
        points: [
          "Crop a photo and a light colour clean",
          "Place an image in the layout",
          "Export a print PDF",
          "What to tell the press",
        ],
      },
    ],
  },
  tally: {
    duration: "2–3 months",
    level: "Beginner to intermediate",
    certificate: "Institute certificate",
    summary:
      "Keep a shop, an office or a small business account on the computer. Tally Prime is the current software, and Tally ERP 9 is still used in many offices — both in one course, with vouchers made in the lab.",
    forWhom: [
      "You want to keep a shop or coaching account yourself",
      "You are looking at an accounts or back-office job",
      "Bills, GST and stock should live in software, not only on paper",
      "You know Excel and now want a real book of accounts",
    ],
    outcomes: [
      "Create a company, ledgers and groups alone",
      "Pass receipt, payment, sales and purchase vouchers",
      "A GST bill and a simple stock entry",
      "Read a balance sheet, profit and loss, and an outstanding list",
    ],
    tools: ["Tally Prime", "Tally ERP 9", "GST invoice", "Ledger and stock"],
    project: "A small shop company: ten ledgers, sales and purchase, one GST bill and the month’s report.",
    modules: [
      {
        title: "Why accounts software",
        points: [
          "A paper register and a computer book are not the same habit",
          "Company, ledger and voucher — three words that run the work",
          "Tally Prime is the new screen; ERP 9 is older and still in many offices",
          "A wrong entry spoils the report later, so match the books each day",
        ],
      },
      {
        title: "Tally Prime — company and ledger",
        points: [
          "Create a company, the financial year and the currency",
          "Choose a group: cash, bank, party, purchase, sales",
          "Make a ledger and an opening balance",
          "Where a party’s GST number and address are written",
        ],
      },
      {
        title: "Vouchers, GST and stock",
        points: [
          "Contra, payment, receipt and journal",
          "Sales and purchase vouchers, cash and credit",
          "Create an item, a unit and a simple godown entry",
          "How tax is added on a GST bill",
        ],
      },
      {
        title: "Tally ERP 9 and reports",
        points: [
          "The same books in ERP 9, with a slightly different screen and keys",
          "Repeat a Prime voucher inside ERP 9",
          "Day book, ledger, outstanding and stock summary",
          "Profit and loss and the balance sheet — which figure means what",
        ],
      },
    ],
  },
};
