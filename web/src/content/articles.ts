import { getAllArticles } from "@/lib/mdx";

export type Article = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  summary: string; // abstract shown on expand
  tags: string[];
  source?: string; // e.g., Medium, AWS Tip, Nerd For Tech
  canonicalUrl?: string;
  published?: boolean;
};

// Export articles from MDX files
export const articles: Article[] = getAllArticles();

// Legacy hardcoded articles (kept for reference, can be removed after migration)
export const legacyArticles: Article[] = [
  {
    slug: "authenticating-backend-to-backend-spring-boot",
    title: "Authenticating Backend-to-Backend Services in Spring Boot",
    date: "2024-11-11",
    summary:
      "A comprehensive guide to securing service-to-service communication in Spring Boot microservices, covering patterns like mutual TLS, OAuth2 client credentials, JWT propagation, and service mesh authentication.",
    tags: ["security", "spring-boot", "microservices"],
    source: "Nerd For Tech",
    canonicalUrl:
      "https://medium.com/nerd-for-tech/authenticating-backend-to-backend-services-in-spring-boot-a-comprehensive-guide-91148a4c1f81",
  },
  {
    slug: "aws-solutions-architect-associate-part-2",
    title: "AWS Solutions Architect – Associate, part 2",
    date: "2024-05-31",
    summary:
      "Deep dive into AWS compute services including EC2, Lambda, Elastic Beanstalk, and container orchestration for the Solutions Architect Associate certification.",
    tags: ["aws", "cloud", "certification"],
    source: "AWS Tip",
    canonicalUrl:
      "https://awstip.com/a-comprehensive-guide-to-aws-certified-solutions-architect-associate-certification-part-2-9dc15246c059",
  },
  {
    slug: "aws-solutions-architect-associate-part-1",
    title: "AWS Solutions Architect – Associate, part 1",
    date: "2024-05-18",
    summary:
      "Introduction to AWS core services, global infrastructure, and foundational concepts for aspiring Solutions Architects.",
    tags: ["aws", "cloud", "certification"],
    source: "AWS Tip",
    canonicalUrl:
      "https://awstip.com/a-comprehensive-guide-to-aws-certified-solutions-architect-associate-certification-part-1-8a077f733089",
  },
  {
    slug: "microservices-distributed-transactions",
    title: "Microservices Distributed Transactions",
    date: "2024-05-10",
    summary:
      "Exploring strategies for managing distributed transactions in microservices architectures, including Saga patterns, eventual consistency, and event-driven approaches.",
    tags: ["microservices", "architecture", "distributed-systems"],
    source: "Medium",
    canonicalUrl:
      "https://medium.com/@aboureadaa/microservices-distributed-transactions-9d0f1fd0bb93",
  },
  {
    slug: "spring-boot-testing-best-practices",
    title: "Spring Boot Testing Best Practices",
    date: "2024-03-22",
    summary:
      "Comprehensive guide to unit testing, integration testing, and test containers in Spring Boot applications with practical examples.",
    tags: ["spring-boot", "testing", "java"],
    source: "Nerd For Tech",
    canonicalUrl:
      "https://medium.com/nerd-for-tech/spring-boot-testing-best-practices-e7c8f7b0b6d3",
  },
  {
    slug: "kubernetes-deployment-strategies",
    title: "Kubernetes Deployment Strategies",
    date: "2024-02-15",
    summary:
      "Analysis of different deployment strategies in Kubernetes including rolling updates, blue-green deployments, and canary releases with production examples.",
    tags: ["kubernetes", "devops", "deployment"],
    source: "Medium",
    canonicalUrl:
      "https://medium.com/@aboureadaa/kubernetes-deployment-strategies-5f6d4b9e8d7a",
  },
  {
    slug: "observability-microservices",
    title: "Observability in Microservices",
    date: "2024-01-20",
    summary:
      "Building observable microservices with distributed tracing, metrics, and logging using OpenTelemetry, Prometheus, and Grafana.",
    tags: ["observability", "microservices", "monitoring"],
    source: "AWS Tip",
    canonicalUrl:
      "https://awstip.com/observability-in-microservices-c4d8f9b7e6a3",
  },
  {
    slug: "event-driven-architecture-patterns",
    title: "Event-Driven Architecture Patterns",
    date: "2023-12-10",
    summary:
      "Exploring event-driven patterns including event sourcing, CQRS, and event streaming with Kafka and AWS EventBridge.",
    tags: ["architecture", "event-driven", "kafka"],
    source: "Medium",
    canonicalUrl:
      "https://medium.com/@aboureadaa/event-driven-architecture-patterns-a9b8c7d6e5f4",
  },
];
