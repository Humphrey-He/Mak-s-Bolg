import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { PixelButton } from "@/components/shared/PixelButton";
import { copy } from "@/data/copy";

export function AgentFeatureCard() {
  const t = copy.zh;

  return (
    <section className="mx-auto max-w-7xl px-5 pb-10">
      <div className="relative overflow-hidden rounded-[2rem] border border-fuchsia-300/20 bg-gradient-to-r from-fuchsia-400/10 via-white/[0.04] to-cyan-300/10 p-6 backdrop-blur-xl">
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-100">
              <Icon name="zap" /> Agent Studio
            </div>
            <h3 className="text-2xl font-black text-white">Agent 开发项目</h3>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">工具调用、记忆系统、任务规划、向量检索、评测与部署的工程化项目入口。</p>
          </div>
          <Link href="/agent"><PixelButton>进入 Agent 项目页 <Icon name="arrow" /></PixelButton></Link>
        </div>
      </div>
    </section>
  );
}
