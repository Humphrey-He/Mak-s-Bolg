export type Post = {
  id: number;
  top?: boolean;
  title: { zh: string; en: string };
  desc: { zh: string; en: string };
  date: string;
  tag: string;
  read: string;
  featured?: boolean;
};

export const tags = ["All", "Go / Cache", "Cloud Native", "Gateway", "AI Agent", "Database", "Architecture"];

export const posts: Post[] = [
  {
    id: 1,
    top: true,
    title: { zh: "从零构建一个高并发 Go 缓存系统", en: "Building a High-Concurrency Go Cache from Scratch" },
    desc: { zh: "记录 HCache 的分片设计、W-TinyLFU 准入策略、内存控制与多核并发优化实践。", en: "Notes on HCache sharding, W-TinyLFU admission, memory control, and multicore tuning." },
    date: "2026-04-18",
    tag: "Go / Cache",
    read: "12 min",
    featured: true
  },
  {
    id: 2,
    top: true,
    title: { zh: "Kubernetes 集群升级灰度方案设计", en: "Designing a Canary Upgrade Plan for Kubernetes Clusters" },
    desc: { zh: "围绕 kube-apiserver、kubelet、etcd、CNI、CSI 的生产级升级路径与回滚策略。", en: "Production upgrade and rollback across kube-apiserver, kubelet, etcd, CNI and CSI." },
    date: "2026-04-12",
    tag: "Cloud Native",
    read: "16 min"
  },
  {
    id: 3,
    top: true,
    title: { zh: "APISIX 网关加解密插件设计笔记", en: "Design Notes for an APISIX Gateway Encryption Plugin" },
    desc: { zh: "基于 apisix-go-plugin-runner 实现请求加密、响应解密、策略选择和多版本密钥管理。", en: "Encryption/decryption, strategy routing and multi-version keys with APISIX Go Plugin Runner." },
    date: "2026-04-08",
    tag: "Gateway",
    read: "14 min"
  },
  {
    id: 4,
    top: true,
    title: { zh: "Agent 项目源码拆解的五条主线", en: "Five Main Threads for Reading Agent Source Code" },
    desc: { zh: "从运行时、工具调用、记忆系统、规划调度和工程化落地五个维度分析 Agent 项目。", en: "Analyze Agent projects through runtime, tools, memory, planning and deployment." },
    date: "2026-03-29",
    tag: "AI Agent",
    read: "10 min",
    featured: true
  },
  {
    id: 5,
    top: true,
    title: { zh: "电商订单号与支付单号生成方案", en: "Order ID and Payment ID Generation for E-commerce" },
    desc: { zh: "覆盖雪花算法、号段模式、幂等、重试、补偿、退款与对账场景。", en: "Snowflake, segment allocation, idempotency, retry, compensation, refunds and reconciliation." },
    date: "2026-03-21",
    tag: "Architecture",
    read: "13 min",
    featured: true
  },
  {
    id: 6,
    title: { zh: "MySQL 索引优化与慢查询治理", en: "MySQL Index Optimization and Slow Query Governance" },
    desc: { zh: "从执行计划、联合索引、回表、覆盖索引和分页优化拆解电商查询性能治理。", en: "Execution plans, composite indexes, covering indexes and pagination optimization." },
    date: "2026-03-12",
    tag: "Database",
    read: "11 min"
  },
  {
    id: 7,
    title: { zh: "Redis 缓存一致性与热点 Key 治理", en: "Redis Consistency and Hot-Key Governance" },
    desc: { zh: "分析旁路缓存、延迟双删、消息补偿、热点拆分和本地缓存兜底策略。", en: "Cache-aside, delayed double deletion, message compensation, hot-key splitting and local fallback." },
    date: "2026-03-03",
    tag: "Go / Cache",
    read: "9 min"
  },
  {
    id: 8,
    title: { zh: "从 pprof 定位 Go 服务性能瓶颈", en: "Finding Go Service Bottlenecks with pprof" },
    desc: { zh: "结合 CPU、堆内存、goroutine、mutex profile 进行接口延迟与资源占用分析。", en: "CPU, heap, goroutine and mutex profiling for latency and resource analysis." },
    date: "2026-02-26",
    tag: "Go / Cache",
    read: "8 min"
  },
  {
    id: 9,
    title: { zh: "对象存储网关 API 设计", en: "Object Storage Gateway API Design" },
    desc: { zh: "围绕 Bucket、Object、ACL、Tagging、Multipart 与签名认证设计类 S3/COS 服务。", en: "S3/COS-like APIs for buckets, objects, ACL, tagging, multipart upload and auth." },
    date: "2026-02-15",
    tag: "Architecture",
    read: "15 min"
  },
  {
    id: 10,
    title: { zh: "Keycloak + APISIX 多租户 RBAC 设计", en: "Multi-Tenant RBAC with Keycloak and APISIX" },
    desc: { zh: "以中台和子系统权限模型为例，拆解 SSO、租户角色、资源权限和网关鉴权。", en: "SSO, tenant roles, resource permissions and gateway authorization." },
    date: "2026-02-02",
    tag: "Gateway",
    read: "17 min"
  }
];
