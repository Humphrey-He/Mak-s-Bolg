export type Project = {
  name: string;
  slug: string;
  type: string;
  desc: { zh: string; en: string };
  content: { zh: string; en: string };
  techStack: string[];
  highlights: string[];
};

export const projectCards: Project[] = [
  {
    name: "HCache",
    slug: "hcache",
    type: "Go Cache Engine",
    desc: {
      zh: "面向多核并发场景的 Go 本地缓存，支持分片、LRU/LFU、W-TinyLFU 与内存水位控制。",
      en: "A Go local cache for multicore concurrency with sharding, LRU/LFU, W-TinyLFU and memory-watermark control."
    },
    content: {
      zh: "## 项目背景\n\nHCache 是一个面向高并发场景设计的 Go 本地缓存引擎。\n\n## 核心设计\n\n### 分片策略\n\n采用分片锁减少竞争...\n\n### 准入策略\n\nW-TinyLFU 实现热点识别...",
      en: "## Background\n\nHCache is a Go local cache engine designed for high-concurrency scenarios..."
    },
    techStack: ["Go", "Sync Pool", "Ring Buffer", "W-TinyLFU"],
    highlights: ["无锁分片设计", "W-TinyLFU 准入", "内存水位控制", "多核优化"]
  },
  {
    name: "APISIX Plugin",
    slug: "apisix-plugin",
    type: "Gateway Security",
    desc: {
      zh: "基于 APISIX Go Plugin Runner 的网关加解密插件，支持多策略、多版本密钥与响应解密。",
      en: "A gateway encryption plugin based on APISIX Go Plugin Runner with strategy routing and multi-version keys."
    },
    content: {
      zh: "## 项目背景\n\n在 API 网关层实现请求加解密...\n\n## 架构设计\n\n### 插件运行机制\n\n基于 apisix-go-plugin-runner...",
      en: "## Background\n\nImplementing request encryption/decryption at the API gateway layer..."
    },
    techStack: ["APISIX", "Go Plugin Runner", "AES-256-GCM", "RSA"],
    highlights: ["请求解密", "多策略路由", "版本密钥管理", "热更新"]
  },
  {
    name: "Object Storage",
    slug: "object-storage",
    type: "COS/S3 Like Service",
    desc: {
      zh: "基于 go-zero 与 Tencent COS SDK 的对象存储网关，覆盖 Bucket、Object、ACL、Tagging 等能力。",
      en: "A COS/S3-like storage gateway based on go-zero and Tencent COS SDK."
    },
    content: {
      zh: "## 项目背景\n\n构建类 S3/COS 的对象存储网关...\n\n## API 设计\n\n### Bucket 操作\n\nCreateBucket, ListBuckets...\n\n### Object 操作\n\nPutObject, GetObject, DeleteObject...",
      en: "## Background\n\nBuilding an S3/COS-like object storage gateway..."
    },
    techStack: ["Go", "go-zero", "COS SDK", "MinIO"],
    highlights: ["S3 兼容 API", "多租户隔离", "ACL 权限控制", "Multipart 上传"]
  },
  {
    name: "Agent Dev Studio",
    slug: "agent-dev-studio",
    type: "Agent Development",
    desc: {
      zh: "覆盖工具调用、工作流编排、记忆系统、向量检索、评测与部署。",
      en: "Tool calling, workflow orchestration, memory, vector retrieval, evaluation and deployment."
    },
    content: {
      zh: "## 项目背景\n\n构建企业级 Agent 开发平台...\n\n## 核心模块\n\n### 工具调用\n\n支持 Function Calling 与 Tool Use...\n\n### 记忆系统\n\n向量数据库 + 结构化记忆...",
      en: "## Background\n\nBuilding an enterprise-grade Agent development platform..."
    },
    techStack: ["LangChain", "ChromaDB", "Redis", "Docker"],
    highlights: ["多模型适配", "工具生态", "记忆管理", "评测观测"]
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projectCards.find((p) => p.slug === slug);
}

export const projectNames = projectCards.map((project) => project.name);
