export const projectCards = [
  {
    name: "HCache",
    type: "Go Cache Engine",
    desc: {
      zh: "面向多核并发场景的 Go 本地缓存，支持分片、LRU/LFU、W-TinyLFU 与内存水位控制。",
      en: "A Go local cache for multicore concurrency with sharding, LRU/LFU, W-TinyLFU and memory-watermark control."
    }
  },
  {
    name: "APISIX Plugin",
    type: "Gateway Security",
    desc: {
      zh: "基于 APISIX Go Plugin Runner 的网关加解密插件，支持多策略、多版本密钥与响应解密。",
      en: "A gateway encryption plugin based on APISIX Go Plugin Runner with strategy routing and multi-version keys."
    }
  },
  {
    name: "Object Storage",
    type: "COS/S3 Like Service",
    desc: {
      zh: "基于 go-zero 与 Tencent COS SDK 的对象存储网关，覆盖 Bucket、Object、ACL、Tagging 等能力。",
      en: "A COS/S3-like storage gateway based on go-zero and Tencent COS SDK."
    }
  },
  {
    name: "Agent Dev Studio",
    type: "Agent Development",
    desc: {
      zh: "覆盖工具调用、工作流编排、记忆系统、向量检索、评测与部署。",
      en: "Tool calling, workflow orchestration, memory, vector retrieval, evaluation and deployment."
    }
  }
];

export const projectNames = projectCards.map((project) => project.name);
