export type BlogSeriesDefinition = {
  slug: string;
  name: string;
  description: string;
  accent: string;
};

export const blogSeriesDefinitions: BlogSeriesDefinition[] = [
  {
    slug: "ai-agent",
    name: "AI Agent",
    description: "Agent architecture, memory, RAG, tools, orchestration, and model access.",
    accent: "cyan",
  },
  {
    slug: "docker",
    name: "Docker",
    description: "Container image, runtime, network, volume, logs, and backend delivery practices.",
    accent: "sky",
  },
  {
    slug: "kubernetes",
    name: "Kubernetes",
    description: "Backend deployment, service discovery, rollout, probes, resources, and troubleshooting.",
    accent: "blue",
  },
  {
    slug: "redis-core",
    name: "Redis 核心原理与实战",
    description: "Redis execution model, data structures, persistence, cluster, cache consistency, ops, and source code.",
    accent: "red",
  },
  {
    slug: "distributed-cache",
    name: "分布式缓存核心原理与实战",
    description: "Distributed cache patterns, Memcached, Redis internals, cache architecture, and business scenarios.",
    accent: "emerald",
  },
  {
    slug: "rpc-core",
    name: "RPC 核心原理与实战",
    description: "RPC protocol, serialization, network IO, service discovery, governance, and high availability.",
    accent: "violet",
  },
  {
    slug: "ddd-core",
    name: "DDD 核心原理与实战",
    description: "Domain-driven design strategy, tactical modeling, bounded context, layering, and microservice boundaries.",
    accent: "amber",
  },
  {
    slug: "elasticsearch-core",
    name: "Elasticsearch 核心原理与实战",
    description: "Concepts, mapping, analyzers, DSL, aggregation, read/write flow, and production practice.",
    accent: "teal",
  },
  {
    slug: "go-modules",
    name: "Go Modules",
    description: "Go dependency management, import resolution, module lookup, MVS, and package loading.",
    accent: "cyan",
  },
  {
    slug: "go-high-concurrency",
    name: "Go 高并发高可用",
    description: "Go high concurrency, high availability, HTTP timeout, retry, and reliable network requests.",
    accent: "green",
  },
  {
    slug: "kafka-sarama",
    name: "Kafka / Sarama",
    description: "Kafka producer and consumer internals, lag troubleshooting, and commit semantics.",
    accent: "orange",
  },
  {
    slug: "mysql",
    name: "MySQL",
    description: "Indexing, slow query governance, table size, B+Tree, and storage page engineering.",
    accent: "blue",
  },
  {
    slug: "java-design-patterns",
    name: "Java 设计模式",
    description: "Java design pattern principles, framework applications, and practical architecture examples.",
    accent: "rose",
  },
  {
    slug: "rocketmq",
    name: "RocketMQ",
    description: "RocketMQ high-performance architecture and messaging practice.",
    accent: "orange",
  },
  {
    slug: "sdd",
    name: "SDD 规格驱动开发",
    description: "Spec-driven development concepts, AI-era software workflow, and application scenarios.",
    accent: "fuchsia",
  },
  {
    slug: "gateway-apisix",
    name: "网关与 APISIX",
    description: "API gateway, APISIX plugin design, encryption, and backend gateway practice.",
    accent: "purple",
  },
  {
    slug: "cloud-native-notes",
    name: "云原生架构随笔",
    description: "Cloud native architecture notes outside Docker and Kubernetes focused series.",
    accent: "slate",
  },
  {
    slug: "engineering-notes",
    name: "工程实践随笔",
    description: "Standalone backend engineering notes, ID generation, cache algorithms, and practical design writeups.",
    accent: "zinc",
  },
];

export const blogSeriesBySlug = new Map(blogSeriesDefinitions.map((series) => [series.slug, series]));
