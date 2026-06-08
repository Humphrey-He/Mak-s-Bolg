import type { ReadingTopicFilter, ReadingTypeFilter } from "@/lib/contentFilters";

export type ReadingItem = {
  id: string;
  topic: Exclude<ReadingTopicFilter, "All">;
  type: Exclude<ReadingTypeFilter, "All">;
  title: string;
  meta: string;
  progress: number;
  notes?: string;
  relatedPosts?: string[];
};

export const recentReadings: ReadingItem[] = [
  {
    id: "ddia",
    topic: "backend",
    type: "book",
    title: "Designing Data-Intensive Applications",
    meta: "系统设计 · 数据密集型应用",
    progress: 68,
    notes: "第三章提到的复制策略对理解分布式系统很有帮助，特别是 Paxos 和 Raft 的对比。",
    relatedPosts: ["high-concurrency-go-cache", "object-storage-gateway"],
  },
  {
    id: "attention-is-all-you-need",
    topic: "agent",
    type: "paper",
    title: "Attention Is All You Need",
    meta: "Transformer · 模型基础论文",
    progress: 42,
    notes: "Self-Attention 的计算复杂度分析值得深入研究，也是理解现代 Agent 模型能力边界的基础。",
    relatedPosts: ["agent-source-code-analysis", "agent-model-access-layer"],
  },
  {
    id: "hermes-agent",
    topic: "agent",
    type: "project",
    title: "NousResearch / hermes-agent",
    meta: "Agent Runtime · 源码拆解",
    progress: 55,
    notes: "Tool Calling 的错误处理和重试机制设计得很优雅，适合作为 Agent Runtime 的源码阅读入口。",
    relatedPosts: ["agent-source-code-analysis", "agent-model-access-layer"],
  },
  {
    id: "go-web-programming",
    topic: "backend",
    type: "book",
    title: "Go Web Programming",
    meta: "Go · Web 开发",
    progress: 30,
    relatedPosts: ["go-pprof-performance"],
  },
  {
    id: "raft-consensus",
    topic: "backend",
    type: "paper",
    title: "Raft Consensus Paper",
    meta: "分布式一致性 · 协议",
    progress: 15,
    relatedPosts: ["kubernetes-canary-upgrade"],
  },
];
