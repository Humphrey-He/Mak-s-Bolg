"use client";

import Link from "next/link";
import { useState } from "react";
import { copy } from "@/data/copy";
import { Icon } from "@/components/shared/Icon";
import { PixelButton } from "@/components/shared/PixelButton";
import { AgentTimeline } from "./AgentTimeline";
import { AgentMemoryCapsules } from "./AgentMemoryCapsules";

export function AgentPage() {
  const t = copy.zh;
  const [task, setTask] = useState("");
  const [runCount, setRunCount] = useState(0);

  const modules = [
    {
      title: "Model Adapter",
      desc: "统一封装 OpenAI、本地模型、私有模型与多模型路由。",
      href: "/blog/agent-model-access-layer",
      readingHref: "/readings?topic=agent&type=paper",
    },
    {
      title: "Tool Calling",
      desc: "定义工具 Schema、权限边界、调用日志与失败重试。",
      href: "/blog?series=ai-agent",
      readingHref: "/readings?topic=agent",
    },
    {
      title: "Memory",
      desc: "短期上下文、长期记忆、用户偏好、会话摘要与记忆淘汰。",
      href: "/blog/agent-model-access-layer",
      readingHref: "/readings?topic=agent",
    },
    {
      title: "RAG Retrieval",
      desc: "文档切分、向量检索、重排、引用生成与可信度评分。",
      href: "/blog/agent-rag-system",
      readingHref: "/readings?topic=agent&type=paper",
    },
    {
      title: "Planner",
      desc: "任务拆解、步骤调度、状态机、人工确认与中断恢复。",
      href: "/blog?series=ai-agent",
      readingHref: "/readings?topic=agent",
    },
    {
      title: "Eval & Deploy",
      desc: "离线评测、在线观测、成本统计与 Docker/K8s 部署。",
      href: "/blog?series=ai-agent",
      readingHref: "/readings?topic=agent",
    },
  ];

  const output = runCount
    ? `已模拟执行第 ${runCount} 次：\n- 任务：${task || "未输入具体任务"}\n- 步骤：意图识别 → 规划拆解 → 工具调用 → 风险检查 → 输出`
    : "等待任务输入。";

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-100">
            <Icon name="zap" /> Agent Development Lab
          </div>
          <h2 className="font-serif text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">{t.agentTitle}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-400">{t.agentDesc}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/blog?series=ai-agent"
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/50 bg-cyan-400/15 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,.2)] transition hover:-translate-y-0.5 hover:bg-cyan-400/25"
            >
              Agent 技术文章 <Icon name="arrow" />
            </Link>
            <Link
              href="/readings?topic=agent&type=paper"
              className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/45 bg-fuchsia-500/10 px-4 py-2 text-sm font-semibold text-fuchsia-100 shadow-[0_0_28px_rgba(217,70,239,.16)] transition hover:-translate-y-0.5 hover:bg-fuchsia-500/20"
            >
              Agent 论文精读 <Icon name="book" />
            </Link>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module, index) => (
            <article
              key={module.title}
              className="group rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-fuchsia-200/30 hover:bg-white/[0.065]"
            >
              <Link href={module.href} className="block">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-100 transition group-hover:bg-cyan-300/15">
                  <Icon name="cpu" />
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-cyan-100">{module.title}</h3>
                <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-400">{module.desc}</p>
                <div className="mt-5 font-mono text-xs text-fuchsia-100">agent.module.{String(index + 1).padStart(2, "0")}</div>
              </Link>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                <Link
                  href={module.href}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100 transition hover:border-cyan-200/45 hover:bg-cyan-300/15"
                >
                  技术文章 <Icon name="arrow" className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={module.readingHref}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-2 text-xs font-semibold text-fuchsia-100 transition hover:border-fuchsia-200/45 hover:bg-fuchsia-400/15"
                >
                  论文精读 <Icon name="book" className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AgentTimeline />
          <AgentMemoryCapsules />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <div className="rounded-[2rem] border border-white/10 bg-black/35 p-5 font-mono backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-2 text-sm font-bold text-cyan-100"><Icon name="terminal" /> Agent 指令沙盒</div>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="输入一个任务，例如：分析 APISIX 插件源码并生成排查清单"
            className="min-h-[118px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-cyan-100 outline-none placeholder:text-slate-600 focus:border-cyan-300/50"
          />
          <div className="mt-3 flex justify-end"><PixelButton onClick={() => setRunCount((prev) => prev + 1)}>模拟执行 <Icon name="zap" /></PixelButton></div>
          <pre className="mt-4 min-h-[120px] whitespace-pre-wrap rounded-2xl border border-cyan-300/10 bg-[#061018] p-4 text-xs leading-6 text-emerald-200">
            {output}
          </pre>
        </div>
      </section>
    </>
  );
}
