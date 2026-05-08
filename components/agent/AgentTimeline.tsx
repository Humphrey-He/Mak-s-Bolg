"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface TimelineEvent {
  id: string;
  type: "input" | "thinking" | "tool" | "memory" | "output" | "error";
  label: string;
  detail: string;
  timestamp: string;
}

const mockTimeline: TimelineEvent[] = [
  { id: "1", type: "input", label: "用户输入", detail: "分析 APISIX 插件源码并生成排查清单", timestamp: "10:23:01" },
  { id: "2", type: "thinking", label: "意图识别", detail: "识别为源码分析 + 工具生成复合任务", timestamp: "10:23:02" },
  { id: "3", type: "tool", label: "工具调用", detail: "read_file: apisix-plugin-runner/main.go", timestamp: "10:23:03" },
  { id: "4", type: "memory", label: "记忆检索", detail: "找到相关记忆：APISIX 插件开发经验 (强度: 0.85)", timestamp: "10:23:04" },
  { id: "5", type: "thinking", label: "规划拆解", detail: "拆解为 3 个子任务：代码结构 → 关键函数 → 生成清单", timestamp: "10:23:05" },
  { id: "6", type: "tool", label: "工具调用", detail: "search_code: crypto.decrypt pattern", timestamp: "10:23:06" },
  { id: "7", type: "output", label: "生成输出", detail: "排查清单已生成，包含 12 个关键检查点", timestamp: "10:23:08" }
];

const typeConfig: Record<TimelineEvent["type"], { color: string; bg: string; icon: string }> = {
  input: { color: "text-cyan-100", bg: "bg-cyan-400/20 border-cyan-400/40", icon: "✏️" },
  thinking: { color: "text-yellow-100", bg: "bg-yellow-400/20 border-yellow-400/40", icon: "💭" },
  tool: { color: "text-blue-100", bg: "bg-blue-400/20 border-blue-400/40", icon: "🔧" },
  memory: { color: "text-purple-100", bg: "bg-purple-400/20 border-purple-400/40", icon: "🧠" },
  output: { color: "text-emerald-100", bg: "bg-emerald-400/20 border-emerald-400/40", icon: "✅" },
  error: { color: "text-red-100", bg: "bg-red-400/20 border-red-400/40", icon: "❌" }
};

export function AgentTimeline() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [events, setEvents] = useState<TimelineEvent[]>([]);

  const runDemo = () => {
    setIsRunning(true);
    setEvents([]);
    let i = 0;
    const interval = setInterval(() => {
      if (i < mockTimeline.length) {
        setEvents((prev) => [...prev, mockTimeline[i]]);
        i++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 600);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">Tool Calling Timeline</h3>
        <button
          onClick={runDemo}
          disabled={isRunning}
          className="rounded-xl border border-fuchsia-300/30 bg-fuchsia-400/10 px-4 py-2 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-400/20 disabled:opacity-50"
        >
          {isRunning ? "执行中..." : "运行演示"}
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-400/50 via-fuchsia-400/50 to-emerald-400/50" />

        <div className="space-y-4">
          {events.length === 0 && !isRunning && (
            <p className="py-8 text-center text-sm text-slate-500">点击"运行演示"查看执行链路</p>
          )}

          {events.map((event, index) => {
            const config = typeConfig[event.type];
            const isActive = activeId === event.id;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="relative pl-10"
              >
                <div className={`absolute left-2 top-3 h-4 w-4 rounded-full border-2 ${config.bg}`} />

                <button
                  onClick={() => setActiveId(isActive ? null : event.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${config.bg} ${
                    isActive ? "ring-2 ring-cyan-400/30" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{config.icon}</span>
                      <span className={`font-bold ${config.color}`}>{event.label}</span>
                    </div>
                    <span className="font-mono text-xs text-slate-400">{event.timestamp}</span>
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      className="mt-3 text-sm text-slate-300"
                    >
                      {event.detail}
                    </motion.div>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
