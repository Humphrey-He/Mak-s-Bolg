"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/shared/Icon";

interface ReadingItem {
  id: string;
  type: "book" | "paper" | "project";
  title: string;
  meta: string;
  progress: number;
  notes?: string;
  relatedPosts?: string[];
}

const mockReadings: ReadingItem[] = [
  {
    id: "1",
    type: "book",
    title: "Designing Data-Intensive Applications",
    meta: "系统设计 · 数据密集型应用",
    progress: 68,
    notes: "第三章提到的复制策略对理解分布式系统很有帮助，特别是 Paxos 和 Raft 的对比。",
    relatedPosts: ["high-concurrency-go-cache", "object-storage-gateway"]
  },
  {
    id: "2",
    type: "paper",
    title: "Attention Is All You Need",
    meta: "Transformer · 模型基础论文",
    progress: 42,
    notes: "Self-Attention 的计算复杂度分析值得深入研究。",
    relatedPosts: ["agent-source-code-analysis"]
  },
  {
    id: "3",
    type: "project",
    title: "NousResearch / hermes-agent",
    meta: "Agent Runtime · 源码拆解",
    progress: 55,
    notes: "Tool Calling 的错误处理和重试机制设计得很优雅。",
    relatedPosts: ["agent-source-code-analysis", "keycloak-apisix-rbac"]
  },
  {
    id: "4",
    type: "book",
    title: "Go Web Programming",
    meta: "Go · Web 开发",
    progress: 30,
    relatedPosts: ["go-pprof-performance"]
  },
  {
    id: "5",
    type: "paper",
    title: " raft consensus paper",
    meta: "分布式一致性 · 协议",
    progress: 15,
    relatedPosts: ["kubernetes-canary-upgrade"]
  }
];

const typeConfig = {
  book: { label: "书籍", icon: "book", color: "text-cyan-100", bg: "bg-cyan-400/20" },
  paper: { label: "论文", icon: "file", color: "text-fuchsia-100", bg: "bg-fuchsia-400/20" },
  project: { label: "项目", icon: "github", color: "text-emerald-100", bg: "bg-emerald-400/20" }
};

export function ReadingTimeline() {
  const [selectedType, setSelectedType] = useState<ReadingItem["type"] | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = selectedType === "all"
    ? mockReadings
    : mockReadings.filter((r) => r.type === selectedType);

  return (
    <div className="space-y-4">
      <div className="mb-6 flex gap-2">
        {(["all", "book", "paper", "project"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              selectedType === type
                ? "bg-cyan-400/20 text-cyan-100 ring-1 ring-cyan-400/40"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
            }`}
          >
            {type === "all" ? "全部" : typeConfig[type].label}
          </button>
        ))}
      </div>

      {filtered.map((item, index) => {
        const config = typeConfig[item.type];
        const isExpanded = expandedId === item.id;

        return (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:border-cyan-200/30"
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
              className="w-full text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.bg}`}>
                    <Icon name={config.icon} className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full ${config.bg} px-2 py-0.5 text-xs ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="font-bold text-white">{item.title}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">{item.meta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-slate-500">{item.progress}%</span>
                  <Icon
                    name="chevron"
                    className={`h-5 w-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                />
              </div>
            </button>

            {isExpanded && item.notes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="mt-4 border-t border-white/5 pt-4"
              >
                <div className="rounded-xl bg-black/20 p-4">
                  <p className="text-sm leading-relaxed text-slate-300">{item.notes}</p>
                </div>

                {item.relatedPosts && item.relatedPosts.length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">影响文章</p>
                    <div className="flex flex-wrap gap-2">
                      {item.relatedPosts.map((slug) => (
                        <a
                          key={slug}
                          href={`/blog/${slug}`}
                          className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-100 transition hover:bg-cyan-300/20"
                        >
                          {slug.replace(/-/g, " ")}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.article>
        );
      })}
    </div>
  );
}
