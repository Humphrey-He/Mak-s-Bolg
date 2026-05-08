"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MemoryCapsule {
  id: string;
  type: "episodic" | "semantic" | "procedural";
  label: string;
  content: string;
  strength: number;
  lastAccessed: string;
}

const mockMemories: MemoryCapsule[] = [
  {
    id: "1",
    type: "semantic",
    label: "APISIX 插件开发经验",
    content: "apisix-go-plugin-runner 最佳实践：Phase 阶段使用 error.HijackResponse() 处理响应，TLS 双向认证配置在 conf.Wasm 字段。",
    strength: 0.92,
    lastAccessed: "2 分钟前"
  },
  {
    id: "2",
    type: "episodic",
    label: "Go 缓存调优会话",
    content: "HCache W-TinyLFU 命中率在 4 核机器上达到 94%，分片数建议为 CPU 核数的 2 倍。",
    strength: 0.78,
    lastAccessed: "15 分钟前"
  },
  {
    id: "3",
    type: "procedural",
    label: "K8s 升级检查清单",
    content: "升级前：etcd 备份、APIServer 高可用检查、CNI 版本兼容性。升级后：Pod 重启验证、功能回归测试。",
    strength: 0.85,
    lastAccessed: "1 小时前"
  },
  {
    id: "4",
    type: "semantic",
    label: "S3 签名算法",
    content: "AWS Signature V4 计算顺序： CanonicalRequest → StringToSign → Signature。Region 和 Service 字段必须匹配。",
    strength: 0.71,
    lastAccessed: "3 小时前"
  }
];

const typeConfig = {
  episodic: { color: "text-purple-100", bg: "bg-purple-400/20", label: "情景记忆" },
  semantic: { color: "text-cyan-100", bg: "bg-cyan-400/20", label: "语义记忆" },
  procedural: { color: "text-emerald-100", bg: "bg-emerald-400/20", label: "程序记忆" }
};

export function AgentMemoryCapsules() {
  const [selectedType, setSelectedType] = useState<MemoryCapsule["type"] | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredMemories = selectedType === "all"
    ? mockMemories
    : mockMemories.filter((m) => m.type === selectedType);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <h3 className="mb-5 text-xl font-bold text-white">Memory Capsules</h3>

      <div className="mb-4 flex gap-2">
        {(["all", "episodic", "semantic", "procedural"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedType === type
                ? "bg-cyan-400/20 text-cyan-100 ring-1 ring-cyan-400/40"
                : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
            }`}
          >
            {type === "all" ? "全部" : typeConfig[type as MemoryCapsule["type"]].label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredMemories.map((capsule) => {
            const config = typeConfig[capsule.type];
            const isExpanded = expandedId === capsule.id;

            return (
              <motion.div
                key={capsule.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-xl border border-white/10 bg-black/30 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : capsule.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full ${config.bg} px-2 py-0.5 text-xs ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="font-medium text-white">{capsule.label}</span>
                    </div>
                    <span className="text-xs text-slate-500">{capsule.lastAccessed}</span>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${capsule.strength * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {Math.round(capsule.strength * 100)}%
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/5 px-4 py-3 text-sm text-slate-300">
                        {capsule.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
