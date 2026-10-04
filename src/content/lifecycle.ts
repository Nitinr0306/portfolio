import type { LifecycleStage } from "./types";

/**
 * The hero's "schema to deploy" rail. Each stage lists the tools from the résumé
 * and the project where that stage actually shows up. A tool with no project
 * behind it stays in the list but gets no proof line.
 */
export const lifecycle: LifecycleStage[] = [
  {
    id: "model",
    verb: "Model the data",
    tools: ["PostgreSQL", "Redis", "Flyway", "JPA/Hibernate", "MySQL"],
    proof: [
      {
        project: "managio",
        note: "PostgreSQL, Redis, Flyway and JPA/Hibernate behind a multi-tenant SaaS platform",
      },
    ],
  },
  {
    id: "api",
    verb: "Design the API",
    tools: ["Spring Boot", "Spring MVC", "REST", "FastAPI"],
    proof: [
      { project: "managio", note: "95 REST APIs across 14 controllers and 8 business modules" },
      { project: "medvision-ai", note: "8 REST endpoints consumed by a typed Next.js frontend" },
    ],
  },
  {
    id: "secure",
    verb: "Secure it",
    tools: ["Spring Security", "JWT", "RBAC"],
    proof: [
      {
        project: "managio",
        note: "JWT rotation, rate limiting, account lockout, 6 roles and 30 permission controls",
      },
      { project: "medvision-ai", note: "A 5-file cap, a 10 MB per-file limit and a MIME-type allowlist on uploads" },
    ],
  },
  {
    id: "interface",
    verb: "Build the interface",
    tools: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    proof: [{ project: "medvision-ai", note: "A fully TypeScript-typed Next.js 14 frontend" }],
  },
  {
    id: "test",
    verb: "Test and document",
    tools: ["JUnit 5", "Mockito", "Swagger/OpenAPI", "Postman"],
    proof: [
      {
        project: "managio",
        note: "Business logic tested with JUnit 5 and Mockito; APIs documented with Swagger/OpenAPI",
      },
    ],
  },
  {
    id: "ship",
    verb: "Ship it",
    tools: ["Docker", "Jenkins", "Kubernetes", "Terraform", "AWS EC2", "Render"],
    proof: [
      { project: "medvision-ai", note: "Docker, Jenkins CI/CD, Kubernetes and Terraform" },
      { project: "managio", note: "Containerised with Docker" },
    ],
  },
  {
    id: "observe",
    verb: "Watch it run",
    tools: ["Prometheus", "Grafana"],
    proof: [{ project: "medvision-ai", note: "Monitoring with Prometheus and Grafana" }],
  },
];
