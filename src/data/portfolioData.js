export const projectsData = [
  {
    id: 1,
    title: "Come try out my game: Kelvin The Diver",
    description: "This is a web arcade game inspired by the game 'Dave The Diver' Where the player controls a diver to explore the ocean, collect treasures, and avoid or hunt sea creatures.",
    tags: ["HTML5", "JavaScript", "GIT"],
    githubUrl: "https://github.com/kelvinchow2003/Kelvin-The-Diver",
    liveUrl: "https://kelvinchow2003.github.io/Kelvin-The-Diver/"
  },
  
  {
    id: 3,
    title: "Income Prediction Model",
    description: "Built income classification models using the Adult Income dataset with 5 ML algorithms (SVM, Logistic Regression, etc.). Handled data cleaning, scaling, and feature selection (RFE). Achieved 84% accuracy with SVM.",
    tags: ["Machine Learning", "Python", "Scikit-learn", "Pandas", "Data Mining"],
    githubUrl: "https://github.com/kelvinchow2003/Adult_Incone_Prediction", 
    liveUrl: ""
  },
  {
    id: 2,
    title: "Immigration Web Portal and Permit Automation",
    description: "This project was developed during my time at Green and Spigel where I helped implement a customer facing portal to help extract their information and transform it into usable data to be stored in our database. It was then loaded into a PDF filing program we created to help automate the process of filling out permit forms.",
    tags: ["Python", "SQL", "Java", "Spring boot", "Rest api", "Figma, GIT", "MatterSphere", "Trello"],
    githubUrl: "",
    liveUrl: "https://sapc.cchifirm.ca/3/clientportal/#/login"
  },
  
  {
    id: 4,
    title: "Kiosk Lockdown Configurator",
    description: "Creates and configures secure Kiosk mode for Windows computers, limiting user access to a single landing page and enforcing application security via tools like Logon Expert. Implemented using PowerShell and HTML for a streamlined deployment.",
    tags: ["Powershell", "HTML", "Windows", "Logon Expert"],
    githubUrl: "https://github.com/kelvinchow2003/Kiosk_Setup",
    liveUrl: "#"
  },

  {
    id: 5,
    title: "Laptop Configuration Automation",
    description: "Developed a PowerShell-based solution to streamline pre-domain setup for Windows 11 desktops and laptops. Automated critical tasks like system configuration, updates, firewall management, and application deployment, reducing manual setup time.",
    tags: ["PowerShell", "Automation", "Windows", "IT Operations"],
    githubUrl: "https://github.com/kelvinchow2003/IT_Automation",
    liveUrl: "#"
  },

  {
    id: 6,
    title: "Palette Pilot",
    description: "This is a web app designed to generate a random colour palette along with an image uploader to help find exact hex colours within that image.",
    tags: ["HTML", "JavaScript", "Fonts API", "Tailwind CSS"],
    githubUrl: "https://github.com/kelvinchow2003/Pallete-Pilot",
    liveUrl: "https://kelvinchow2003.github.io/Pallete-Pilot/"
  },
  {
    id: 7,
    title: "Background Remover",
    description: "This is a web app designed to allow a user to upload an image, crop the image into a transparant background. Ideally for presentation, web-logo use",
    tags: ["HTML", "JavaScript", "Fonts API", "Tailwind CSS", "Firebase"],
    githubUrl: "https://github.com/kelvinchow2003/Background-Remover",
    liveUrl: "https://kelvinchow2003.github.io/Background-Remover/"
  },
  {
    id: 8,
    title: "Falling Trend Stock ETL",
    description: "Utilizes a stock market api that fetches high volume major top stocks as recommendations for purchasing.",
    tags: ["Python", "Market API"],
    githubUrl: "https://github.com/kelvinchow2003/Stock_ETL",
    liveUrl: "#"
  },
  

  
  
  
];

export const experienceData = [
  {
    id: 1,
    year: "May 2025 - Present",
    title: "System Support Engineer",
    company: "Toronto Parking Authority (GreenP)",
    details: "Delivered L1, L2, and L3 technical support, assisted with cybersecurity (CrowdStrike, Symantec), and developed automation scripts (Intune, PowerShell) to streamline system configuration and improve operational efficiency. Participated in AI-driven customer support solutions (Co-pilot, Power Apps).",
    logoUrl: "./TPA.png" 
  },
  {
    id: 2,
    year: "Sept 2023 - Sept 2024",
    title: "Junior Developer",
    company: "Green and Spiegel LLP",
    details: "Designed and implemented a secure client intake web portal (AWS, Rest API) and automated dynamic PDF generation using SQL, Python, and Java, which reduced manual workload by 53%. Contributed to code optimization through thorough code reviews.",
    logoUrl: "./Gands.png" 
  },
  {
    id: 3,
    year: "May 2023 - Sept 2023",
    title: "Information Technology Co-op",
    company: "Bothwell Accurate Co. Inc.",
    details: "Provided comprehensive technical support (resolving over 200 issues) and automated onboarding processes for new employees by developing and deploying robust shell scripts, significantly streamlining IT operations.",
    logoUrl: "./Bothwell.png" 
  },
  {
    id: 4,
    year: "April 2021 - Present",
    title: "Bachelors of Science Computer Science Co-op",
    company: "Toronto Metropolitan University",
    details: "Engaged in advanced coursework and projects in algorithms, data structures, machine learning, and software development. Collaborated on team projects using Agile methodologies and version control (Git).",
    logoUrl: "./TMU.png" 
  },
  {
    id: 5,
    year: "Sept 2019 - Present",
    title: "Aquatic Supervisor II",
    company: "City Of Markham",
    details: "Managed aquatic safety operations, supervised staff, and ensured compliance with health and safety regulations at community pools. Developed leadership and crisis management skills in a dynamic environment.",
    logoUrl: "./markham.png" 
  },
];

export const skillGroups = {
    "Languages & Core": ["Python", "Java", "C", "SQL", "Javascript", "HTML", "CSS"],
    "Frameworks & Data": ["React", "Scikit-learn", "Pandas", "Jupyter"],
    "DevOps & Automation": ["PowerShell", "Bash", "GIT", "Active Directory", "Intune", "Docker "], 
    "Cloud & Tools": ["AWS Cloud Practitioner", "Azure AI (In-progress)", "AWS Data Engineer (In-progress)", "Office 365", "Co-pilot", "Power Apps"],
};

export const communityServiceData = [
  // Aquatics
  { name: "National Lifeguard", issued: "2025-06-14", expires: "2027-06-13", category: "Aquatics" },
  { name: "Aquatic Supervisor", issued: "2022-06-19", expires: "N/A", category: "Aquatics" },
  
  // Instructional / Examining
  { name: "Standard First Aid Instructor", issued: "2025-11-09", expires: "2027-11-08", category: "Instructional & Examining" },
  { name: "SEE Auditor", issued: "2025-03-18", expires: "2027-03-17", category: "Instructional & Examining" },
  { name: "Examiner Mentor", issued: "2024-12-13", expires: "2026-12-12", category: "Instructional & Examining" },
  { name: "Emergency First Aid Instructor", issued: "2024-07-21", expires: "2026-07-20", category: "Instructional & Examining" },
  { name: "Examiner - Bronze Reappointment", issued: "2024-07-21", expires: "2026-07-20", category: "Instructional & Examining" },
  { name: "Swim and Lifesaving Instructor", issued: "2024-07-21", expires: "2026-07-20", category: "Instructional & Examining" },
  
  
  // First Aid
  { name: "Standard First Aid with CPR-C", issued: "2025-02-01", expires: "2028-01-31", category: "First Aid & Safety" },
  { name: "Airway Management", issued: "2024-05-15", expires: "2026-05-14", category: "First Aid & Safety" },
];


export const groupedCommunityData = communityServiceData.reduce((acc, item) => {
    if (!acc[item.category]) {
        acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
}, {});