"use client";

import { useState } from "react";
import { copy } from "@/data/copy";
import { Icon } from "@/components/shared/Icon";
import { PixelButton } from "@/components/shared/PixelButton";

export function AgentPage() {
  const t = copy.zh;
  const [task, setTask] = useState("");
  const [runCount, setRunCount] = useState(0);

  const modules = [
    ["Model Adapter", "统一封装 OpenAI、本地模型、私有模型与多模型路由。"],
    ["Tool Calling", "定义工具 Schema、权限边界、调用日志与失败重试。"],
    ["Memory", "短期上下文、长期记忆、用户偏好、会话摘要与记忆淘汰。"],
    ["RAG Retrieval", "文档切分、向量检索、重排、引用生成与可信度评分。"],
    ["Planner", "任务拆解、步骤调度、状态机、人工确认与中断恢复。"],
    ["Eval & Deploy", "离线评测、在线观测、成本统计与 Docker/K8s 部署。"]
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
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {modules.map(([title, desc], index) => (
            <article key={title} className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl hover:border-fuchsia-200/30">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-100"><Icon name="cpu" /></div>
              <h3 className="text-xl font-black text-white">{title}</h3>
              <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-400">{desc}</p>
              <div className="mt-5 font-mono text-xs text-fuchsia-100">agent.module.{String(index + 1).padStart(2, "0")}</div>
            </article>
          ))}
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
