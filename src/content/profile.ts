/**
 * Personal and career facts — sourced from the résumé (resume_final_draft.pdf).
 */

export const profile = {
  name: "Dunna Nitin",
  firstName: "Nitin",
  handle: "nitinr0306",
  positioning: "Backend-focused full-stack engineer",
  location: "India",
  availability: "Open to software engineering roles and freelance projects",
  email: "nitinr0306@gmail.com",
  /** Kept out of the public pages to avoid scraping; it is on the PDF résumé. */
  phone: "+91-6304454756",
  showPhone: false,
  links: {
    github: "https://github.com/Nitinr0306",
    linkedin: "https://www.linkedin.com/in/nitinr0306",
  },
  resumePdf: "/Dunna-Nitin-Resume.pdf",
} as const;

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Java", "C++", "C", "JavaScript"] },
  {
    group: "Backend",
    items: ["Spring Boot", "Spring MVC", "Spring Security", "REST APIs", "JPA/Hibernate"],
  },
  {
    group: "Frontend",
    items: ["React", "Next.js", "TypeScript", "HTML", "CSS", "Tailwind CSS"],
  },
  { group: "Databases & caching", items: ["PostgreSQL", "MySQL", "Redis"] },
  { group: "Testing & API docs", items: ["JUnit 5", "Mockito", "Swagger/OpenAPI"] },
  {
    group: "Tools & DevOps",
    items: [
      "Git",
      "GitHub",
      "Maven",
      "Postman",
      "Docker",
      "Jenkins",
      "Kubernetes",
      "Terraform",
      "AWS EC2",
      "Render",
      "Prometheus",
      "Grafana",
      "Flyway",
    ],
  },
  {
    group: "Core computer science",
    items: [
      "Data structures & algorithms",
      "Object-oriented programming",
      "DBMS",
      "Operating systems",
    ],
  },
];

export const education = [
  {
    school: "Lovely Professional University",
    place: "Punjab, India",
    credential: "B.Tech, Computer Science and Engineering",
    detail: "CGPA 7.47",
    period: "Aug 2023 – Present",
  },
  {
    school: "Gayatri Junior College",
    place: "Srikakulam, Andhra Pradesh",
    credential: "Intermediate",
    detail: "81.5%",
    period: "2021 – 2023",
  },
  {
    school: "Bhashyam High School",
    place: "Palasa, Andhra Pradesh",
    credential: "Matriculation",
    detail: "99%",
    period: "2020 – 2021",
  },
] as const;

export const certificates = [
  {
    title: "Data Structures and Algorithms",
    issuer: "CipherSchools",
    date: "July 2025",
    href: "https://www.cipherschools.com/certificate/preview?id=6881293e589a14da23de45e9",
  },
  {
    title: "Introduction to Hardware & Operating Systems",
    issuer: "Coursera",
    date: "September 2024",
    href: "https://onedrive.live.com/?redeem=aHR0cHM6Ly8xZHJ2Lm1zL2IvYy85MTBjZWRkMDU5YTZmMTJlL0VTSEh6SDZGd2VkRnR2bE5iNXJBQnFBQkEtYTdFMEpDRTdsdkVlNGN0LVpPYkE%5FZT1OM2JxT3M&cid=910CEDD059A6F12E&id=910CEDD059A6F12E%21s7eccc721c18545e7b6f94d6f9ac006a0&parId=910CEDD059A6F12E%21104&o=OneUp",
  },
] as const;

export const achievements = [
  {
    title: "150+ LeetCode problems solved, covering core data structures and algorithms patterns",
    date: "Aug 2026",
  },
  {
    title: "3-star rating in Problem Solving on HackerRank",
    date: "Mar 2024",
  },
] as const;