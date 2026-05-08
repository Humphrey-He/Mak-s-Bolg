export type Project = {
  name: string;
  slug: string;
  type: string;
  desc: { zh: string; en: string };
  content: { zh: string; en: string };
  techStack: string[];
  highlights: string[];
  repoUrl?: string;
};

export type HeroFeaturedProject = {
  slug: string;
  name: string;
  type: string;
  summary: string;
  note: string;
};

export const projectCards: Project[] = [
  {
    name: "HCache",
    slug: "hcache",
    type: "Go Cache Engine",
    desc: {
      zh: "面向高并发场景的 Go 本地缓存引擎，覆盖分片、LRU/LFU、W-TinyLFU 与内存水位控制。",
      en: "A Go local cache engine for high-concurrency workloads with sharding, LRU/LFU, W-TinyLFU, and memory watermark control."
    },
    content: {
      zh: "## 项目背景\n\nHCache 是一个面向高并发服务场景设计的 Go 本地缓存引擎，目标是在命中率、吞吐和内存可控之间取得平衡。\n\n## 核心设计\n\n### 分片并发\n\n通过分片减少锁竞争，让读写路径更适合多核环境。\n\n### 准入策略\n\n结合 W-TinyLFU 识别热点数据，避免低价值数据污染缓存。\n\n### 内存治理\n\n通过容量和水位策略限制缓存膨胀，让服务更稳定。",
      en: "## Background\n\nHCache is a Go local cache engine built for high-concurrency services, balancing hit rate, throughput, and memory control.\n\n## Core Design\n\n### Sharded Concurrency\n\nSharding reduces lock contention and scales better on multi-core workloads.\n\n### Admission Policy\n\nW-TinyLFU helps protect the cache from low-value entries.\n\n### Memory Governance\n\nCapacity and watermark controls keep cache growth predictable."
    },
    techStack: ["Go", "Sync Pool", "Ring Buffer", "W-TinyLFU"],
    highlights: ["分片并发设计", "W-TinyLFU 准入", "内存水位控制", "多核性能优化"],
    repoUrl: "https://github.com/Humphrey-He/hcache"
  },
  {
    name: "APISIX Plugin",
    slug: "apisix-plugin",
    type: "Gateway Security",
    desc: {
      zh: "基于 APISIX Go Plugin Runner 的网关加解密插件，支持多策略路由、多版本密钥与响应解密。",
      en: "A gateway encryption plugin based on APISIX Go Plugin Runner with strategy routing, multi-version keys, and response decryption."
    },
    content: {
      zh: "## 项目背景\n\n这个项目聚焦在 API 网关层完成请求加密、响应解密和密钥演进，减少业务服务重复实现安全逻辑。\n\n## 核心设计\n\n### 插件运行机制\n\n基于 APISIX Go Plugin Runner 承接请求生命周期中的安全处理。\n\n### 策略选择\n\n支持按路由、租户或版本切换不同加密策略。\n\n### 密钥管理\n\n引入多版本密钥与热更新，兼顾安全性和线上可运维性。",
      en: "## Background\n\nThis project moves encryption, decryption, and key evolution into the API gateway so application services can stay simpler.\n\n## Core Design\n\n### Plugin Runtime\n\nThe APISIX Go Plugin Runner handles the gateway-side security flow.\n\n### Strategy Selection\n\nDifferent routes, tenants, or versions can use different encryption policies.\n\n### Key Management\n\nMulti-version key support and hot updates improve safety and operability."
    },
    techStack: ["APISIX", "Go Plugin Runner", "AES-256-GCM", "RSA"],
    highlights: ["请求加解密", "多策略路由", "多版本密钥管理", "在线热更新"],
    repoUrl: "https://github.com/Humphrey-He/apisix-diff"
  },
  {
    name: "Object Storage",
    slug: "object-storage",
    type: "COS/S3 Like Service",
    desc: {
      zh: "基于 go-zero 与 Tencent COS SDK 的对象存储网关，覆盖 Bucket、Object、ACL、Tagging 等能力。",
      en: "A COS/S3-like object storage gateway built on go-zero and Tencent COS SDK."
    },
    content: {
      zh: "## 项目背景\n\n项目目标是构建一套类 S3/COS 的对象存储网关，统一访问模型并支撑常见对象操作。\n\n## 核心设计\n\n### Bucket 能力\n\n覆盖创建、查询和列举等基础能力。\n\n### Object 能力\n\n支持上传、下载、删除与多段上传等关键路径。\n\n### 权限控制\n\n通过 ACL 与标签体系增强资源隔离和治理能力。",
      en: "## Background\n\nThe goal is to build an S3/COS-like object storage gateway with a unified access model.\n\n## Core Design\n\n### Bucket Capabilities\n\nSupports create, query, and list flows.\n\n### Object Capabilities\n\nHandles upload, download, delete, and multipart workflows.\n\n### Access Control\n\nACL and tagging improve isolation and governance."
    },
    techStack: ["Go", "go-zero", "COS SDK", "MinIO"],
    highlights: ["S3 兼容 API", "多租户隔离", "ACL 权限控制", "Multipart 上传"]
  },
  {
    name: "Agent Dev Studio",
    slug: "agent-dev-studio",
    type: "Agent Development",
    desc: {
      zh: "覆盖工具调用、工作流编排、记忆系统、向量检索、评测与部署的 Agent 工程化项目。",
      en: "An Agent engineering project covering tool calling, workflow orchestration, memory, retrieval, evaluation, and deployment."
    },
    content: {
      zh: "## 项目背景\n\nAgent Dev Studio 关注的不只是单次对话，而是把 Agent 真正做成可开发、可观测、可迭代的工程系统。\n\n## 核心设计\n\n### 工具调用\n\n支持函数调用与外部工具接入，扩展 Agent 的行动能力。\n\n### 工作流编排\n\n将任务拆解、执行和回收组织成稳定流程。\n\n### 记忆与评测\n\n通过向量检索、记忆管理和评测链路支持持续优化。",
      en: "## Background\n\nAgent Dev Studio is focused on turning agents into practical engineering systems instead of one-off demos.\n\n## Core Design\n\n### Tool Calling\n\nSupports external tools and function-style invocation.\n\n### Workflow Orchestration\n\nOrganizes task decomposition, execution, and recovery into stable flows.\n\n### Memory and Evaluation\n\nRetrieval, memory management, and evaluation loops support continuous improvement."
    },
    techStack: ["LangChain", "ChromaDB", "Redis", "Docker"],
    highlights: ["多模型适配", "工具生态", "记忆管理", "评测观测"],
    repoUrl: "https://github.com/Humphrey-He/hermes_notes"
  }
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projectCards.find((project) => project.slug === slug);
}

export const heroFeaturedProjects: HeroFeaturedProject[] = [
  {
    slug: "hcache",
    name: "HCache",
    type: "Go Cache Engine",
    summary: "高并发本地缓存引擎，覆盖分片、W-TinyLFU 准入和内存水位控制。",
    note: "代表我在缓存淘汰、性能权衡和 Go 工程实现上的完成度。"
  },
  {
    slug: "apisix-plugin",
    name: "APISIX Plugin",
    type: "Gateway Security",
    summary: "围绕网关加解密、策略路由和多版本密钥管理的一体化插件设计。",
    note: "能体现我对网关扩展点、安全边界和线上可运维性的理解。"
  },
  {
    slug: "agent-dev-studio",
    name: "Agent Dev Studio",
    type: "Agent Development",
    summary: "把工具调用、工作流编排、记忆检索和评测部署串成完整工程链路。",
    note: "最适合呈现我把 AI Agent 从概念推进到可落地系统的能力。"
  }
];
