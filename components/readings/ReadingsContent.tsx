"use client";

import { useSearchParams } from "next/navigation";
import { ReadingTimeline } from "@/components/readings/ReadingTimeline";
import { Icon } from "@/components/shared/Icon";
import { recentReadings } from "@/data/readings";
import { normalizeReadingFilters } from "@/lib/contentFilters";

export function ReadingsContent() {
  const searchParams = useSearchParams();
  const params = {
    topic: searchParams.get("topic") ?? undefined,
    type: searchParams.get("type") ?? undefined,
  };
  const filters = normalizeReadingFilters(params);
  const isAgentPapers = filters.topic === "agent" && filters.type === "paper";
  const isAgentReadings = filters.topic === "agent";

  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <div className="mb-10">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-100">
          <Icon name="book" /> Knowledge Flow
        </div>
        <h1 className="font-serif text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
          {isAgentPapers ? "Agent 论文精读" : isAgentReadings ? "Agent 阅读索引" : "最近阅读"}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
          {isAgentPapers
            ? "聚合 Agent、模型基础、工具调用、RAG 和运行时相关论文，关联到站内技术文章。"
            : isAgentReadings
              ? "聚合 Agent 方向论文、源码项目和阅读笔记，作为技术文章之外的延伸入口。"
              : "技术书籍、论文、开源项目的阅读沉淀。每项记录都会关联到影响到的站内文章。"}
        </p>
      </div>

      <ReadingTimeline items={recentReadings} initialFilters={filters} />
    </section>
  );
}
