import type { Project, ProjectSlug } from "./types";

/**
 * Projects, sourced from the résumé. Numbers and their qualifiers are quoted as the
 * résumé states them. Where the résumé says *what* was built but not *why*, the copy
 * describes the choice and stops there; it doesn't invent a motive.
 *
 * When you push more work (screenshots, a live demo, tests), add `liveUrl` or extend
 * the arrays. Nothing here should be stronger than what the code can back up.
 */

export const projects: Project[] = [
  {
    slug: "medvision-ai",
    name: "MedVision AI",
    kind: "Medical imaging and document intelligence platform",
    period: "April 2026 – Present",
    ongoing: true,
    tier: "flagship",
    summary:
      "A three-service platform that checks, enhances and reads medical images and documents, from phone-captured prescriptions to X-rays.",
    brief: {
      problem: "Phone-captured prescriptions and scans are often blurred, badly lit or noisy, and raw OCR is less accurate on them.",
      approach:
        "Next.js, Spring Boot and Python FastAPI in a one-way pipeline, with validated uploads and a quality gate before OCR.",
      outcome:
        "40% higher OCR accuracy on phone-captured prescriptions than raw Tesseract, and 60% less wasted processing.",
    },
    problem:
      "Phone-captured prescriptions and scans can be blurred, badly lit or noisy. Raw Tesseract OCR is less accurate on images like these, and running OCR pipelines on uploads that turn out to be unusable wastes processing.",
    approach:
      "A platform of three services arranged as a unidirectional pipeline: a fully TypeScript-typed Next.js frontend, a Spring Boot layer that validates and stores uploads, and a Python FastAPI service for the computer-vision work. A quality gate scores each scan and auto-flags unusable uploads before the OCR pipelines run.",
    metrics: [
      {
        value: "+40%",
        label: "OCR accuracy on phone-captured prescriptions",
        context: "vs. a raw Tesseract baseline",
      },
      {
        value: "60%",
        label: "less wasted processing",
        context: "by auto-flagging unusable uploads before OCR",
      },
      { value: "10", label: "selectable CV operations" },
      { value: "6", label: "specialised medical CV modules" },
    ],
    ownership: [
      "Service architecture",
      "Spring Boot validation layer",
      "Medical CV modules",
      "Quality gate",
      "Docker and Jenkins CI/CD",
    ],
    features: [
      {
        title: "Prescription OCR",
        body: "Reads text from phone-captured prescriptions.",
      },
      {
        title: "X-ray CLAHE enhancement",
        body: "Contrast-limited adaptive histogram equalisation, which brings out detail in low-contrast images.",
      },
      {
        title: "Scan quality detection",
        body: "Scores scans for blur, brightness and noise, and auto-flags the unusable ones.",
      },
      {
        title: "6 medical modules",
        body: "Specialised computer-vision modules, including the three above.",
      },
      {
        title: "10 selectable operations",
        body: "Users pick which computer-vision operation runs on an upload.",
      },
      {
        title: "Typed frontend",
        body: "A fully TypeScript-typed Next.js frontend consuming 8 REST endpoints.",
      },
    ],
    decisions: [
      {
        title: "Three services, one direction",
        body: "Next.js 14 with TypeScript, Spring Boot 3 on Java 17, and a Python FastAPI service running OpenCV 4.9, scikit-image, NumPy and Tesseract OCR, arranged as a unidirectional pipeline. The Spring Boot layer exposes the 8 REST endpoints the frontend consumes.",
      },
      {
        title: "Validate every upload in Spring Boot",
        body: "The validation layer enforces a 5-file cap, a 10 MB limit per file and a MIME-type allowlist, and stores files under UUID-based names rather than the names they were uploaded with.",
      },
      {
        title: "Score quality before OCR",
        body: "A quality gate scores each scan for blur (Laplacian variance), brightness and noise, and auto-flags unusable uploads before the OCR pipelines run. That reduced wasted processing by 60%.",
      },
      {
        title: "Measure against a baseline",
        body: "Prescription OCR is compared with raw Tesseract on phone-captured prescriptions, and is 40% more accurate.",
      },
      {
        title: "Automate delivery and monitoring",
        body: "Services are containerised with Docker, with Jenkins CI/CD for automated testing and deployment, Kubernetes and Terraform for orchestration and infrastructure, and Prometheus and Grafana for monitoring.",
      },
    ],
    stack: [
      { layer: "Frontend", items: ["Next.js 14", "TypeScript"] },
      { layer: "API and validation", items: ["Spring Boot 3", "Java 17", "Lombok"] },
      {
        layer: "Computer vision",
        items: ["Python FastAPI", "OpenCV 4.9", "Tesseract OCR", "scikit-image", "NumPy"],
      },
      {
        layer: "Delivery and operations",
        items: ["Docker", "Jenkins CI/CD", "Kubernetes", "Terraform", "Prometheus", "Grafana"],
      },
    ],
    resumeBullets: [
      "3-service platform (Next.js, Spring Boot, FastAPI) with 10 selectable CV operations and a unidirectional pipeline; Docker and Jenkins CI/CD.",
      "6 medical CV modules including Prescription OCR, X-ray CLAHE enhancement and scan quality detection; 40% higher OCR accuracy on phone-captured prescriptions vs. a raw Tesseract baseline.",
      "Laplacian-variance quality gate scoring blur, brightness and noise; auto-flags unusable uploads before OCR, reducing wasted processing by 60%.",
      "Spring Boot validation layer: UUID-based storage, 5-file cap, 10 MB per-file limit, MIME allowlist; 8 REST endpoints; Kubernetes, Terraform, Prometheus and Grafana.",
    ],
    repo: "https://github.com/Nitinr0306/MedVision_Ai",
    similarWork: "Need documents or images checked, cleaned up and read automatically?",
  },
  {
    slug: "managio",
    name: "Managio",
    kind: "Multi-tenant business management SaaS",
    period: "January – March 2026",
    tier: "flagship",
    summary:
      "A multi-tenant SaaS platform for running a membership business: staff roles and permissions, subscriptions, reminders and bulk member data, on 95 REST APIs.",
    brief: {
      problem:
        "A membership business needs staff access limited by role, subscriptions that expire and get followed up on schedule, and member data in bulk.",
      approach:
        "A multi-tenant Spring Boot 3.3 platform with JWT rotation, rate limiting, account lockout and granular RBAC.",
      outcome:
        "Granular RBAC, automated subscription workflows, business logic tested with JUnit 5 and Mockito, and APIs documented with Swagger/OpenAPI.",
    },
    problem:
      "A business that runs on memberships needs more than a few CRUD screens. Each staff member should reach only what their role allows, subscriptions have to expire and be followed up on schedule, and member records have to move in and out in bulk.",
    approach:
      "A multi-tenant Spring Boot 3.3 platform split into 8 business modules behind 14 controllers and 95 REST APIs. The security layer, built with Spring Security, adds JWT access and refresh tokens with rotation, rate limiting, automatic account lockout and permission-level access control. Schedulers handle subscription expiry and reminders.",
    metrics: [
      { value: "95", label: "REST APIs", context: "across 14 controllers" },
      { value: "8", label: "business modules" },
      { value: "30", label: "permission controls", context: "across 6 staff roles" },
      { value: "23K+", label: "lines of code" },
    ],
    ownership: [
      "Platform design",
      "REST API",
      "Authentication and RBAC",
      "Subscription automation",
      "Testing and API docs",
    ],
    features: [
      {
        title: "Multi-tenant",
        body: "Designed as a multi-tenant SaaS platform for staff, membership and subscription management.",
      },
      {
        title: "Subscription workflows",
        body: "Scheduled expiry handling and a 3-stage reminder workflow.",
      },
      {
        title: "Bulk member data",
        body: "CSV import and export for membership management.",
      },
      {
        title: "Documented API",
        body: "REST APIs documented with Swagger/OpenAPI.",
      },
    ],
    decisions: [
      {
        title: "Permissions, not just roles",
        body: "Granular RBAC: 6 staff roles backed by 30 individual permission controls.",
      },
      {
        title: "Rotate refresh tokens",
        body: "Authentication uses JWT access and refresh tokens with token rotation, meaning a refresh token is replaced each time it is used.",
      },
      {
        title: "Guard sign-in",
        body: "Rate limiting, plus automated account lockout after failed login attempts.",
      },
      {
        title: "Automate expiry and reminders",
        body: "Subscription expiry is handled on a schedule, and reminders run as an automated 3-stage workflow.",
      },
      {
        title: "Standardise validation and errors",
        body: "Validation and exception handling are standardised across the API, and the REST APIs are documented with Swagger/OpenAPI.",
      },
      {
        title: "Test the logic, version the schema",
        body: "Backend business logic is validated with JUnit 5 and Mockito, and the PostgreSQL schema is versioned with Flyway migrations.",
      },
    ],
    stack: [
      { layer: "Core", items: ["Java 21", "Spring Boot 3.3", "JPA/Hibernate"] },
      { layer: "Security", items: ["Spring Security", "JWT"] },
      { layer: "Data", items: ["PostgreSQL", "Redis", "Flyway"] },
      { layer: "Quality and docs", items: ["JUnit 5", "Mockito", "Swagger/OpenAPI"] },
      { layer: "Delivery", items: ["Docker"] },
    ],
    resumeBullets: [
      "Multi-tenant SaaS on Spring Boot 3.3: 95 REST APIs, 14 controllers, 8 business modules, 23K+ LOC.",
      "Granular RBAC with 6 staff roles and 30 permission controls; JWT access/refresh authentication with token rotation, rate limiting and automated account lockout.",
      "Scheduled subscription expiry handling, 3-stage reminder workflows, bulk CSV import/export for membership management.",
      "Business logic validated with JUnit 5 and Mockito; Swagger/OpenAPI docs; standardised validation and exception handling.",
    ],
    repo: "https://github.com/Nitinr0306/Managio-Business-Management-System-",
    similarWork: "Need a SaaS backend with roles, permissions and subscriptions?",
  },
  {
    slug: "dice-tournament",
    name: "Dice Tournament",
    kind: "Core Java console application",
    period: "January – March 2025",
    tier: "foundation",
    summary:
      "A framework-free Java tournament engine with player management, configurable dice and rounds, tie handling, leaderboards and statistics.",
    brief: {
      problem: "Running a dice tournament means tracking players and rounds, breaking ties and tallying results.",
      approach: "Pure Java in model, repository, service, report and validation layers.",
      outcome: "Sorted leaderboards and statistics built with Streams, with player data persisted between runs.",
    },
    problem:
      "Running a multi-player dice tournament by hand means tracking players and rounds, breaking ties and tallying results. This console application does all of that, in plain Java.",
    approach:
      "No frameworks. The code is organised into model, repository, service, report and validation layers, using the Builder and Repository patterns and services separated by single responsibility. Leaderboards and reports are built with Streams, Lambdas and Comparators, and player data is persisted with Java serialization.",
    metrics: [],
    ownership: ["Design", "Implementation"],
    features: [
      { title: "Player management", body: "Add and manage the players taking part in a tournament." },
      { title: "Configurable matches", body: "Dice and number of rounds are configurable." },
      { title: "Match execution", body: "Runs matches round by round, including tie handling." },
      {
        title: "Leaderboards and statistics",
        body: "Sorted leaderboards and reports with totals, averages and player statistics.",
      },
      { title: "Persistence", body: "Player data is saved and restored with Java serialization." },
      { title: "Input validation", body: "Input validation and custom exception handling." },
    ],
    decisions: [
      {
        title: "Builder and Repository patterns",
        body: "The Builder pattern for object construction, and a Repository layer that keeps persistence separate from game logic.",
      },
      {
        title: "Single responsibility per service",
        body: "Services are separated by single responsibility across model, repository, service, report and validation layers, to improve modularity and maintainability.",
      },
      {
        title: "Streams for reporting",
        body: "Leaderboards and aggregate statistics are built with Streams, Lambdas, Comparators and Collections.",
      },
    ],
    stack: [
      { layer: "Language", items: ["Java", "OOP", "Generics", "Collections"] },
      { layer: "Techniques", items: ["Streams", "Lambdas", "Exception handling", "File I/O", "Serialization"] },
      { layer: "Patterns", items: ["Builder", "Repository", "Single responsibility"] },
    ],
    resumeBullets: [
      "Pure Java tournament app: player management, configurable dice and rounds, match execution, tie handling, leaderboards and statistics.",
      "Streams, Lambdas and Comparators for sorted leaderboards and aggregate reports; Builder and Repository patterns; serialization-based persistence.",
    ],
    repo: "https://github.com/Nitinr0306/Dice_Tournament_Management_System",
    similarWork: "Want clean, well-structured Java behind your product?",
  },
];

export const flagshipProjects = projects.filter((p) => p.tier === "flagship");

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: ProjectSlug): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  return projects[(index + 1) % projects.length]!;
}
