import { backendApiGroups, backendDesignModels, backendRoadmap } from "@/data/backend";
import { recentReadings } from "@/data/readings";
import { copy } from "@/data/copy";
import { localize } from "@/lib/i18n";
import { Icon } from "@/components/shared/Icon";

export function BackendSection() {
  const t = copy.zh;

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 pt-8">
      <div className="mb-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-100">
          <Icon name="terminal" /> Backend Capability Map
        </div>
        <h2 className="text-3xl font-black text-white md:text-4xl">{t.backendTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{t.backendDesc}</p>
      </div>

      <div className="mb-8 rounded-[2rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/10 via-white/[0.04] to-fuchsia-400/10 p-6 backdrop-blur-xl">
        <h3 className="text-2xl font-black text-white">核心数据模型</h3>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
          {backendDesignModels.map((model) => (
            <div key={model.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="font-mono text-sm font-black text-cyan-100">{model.name}</div>
              <div className="mt-1 font-mono text-[11px] text-slate-500">{model.fields}</div>
              <p className="mt-2 text-xs leading-6 text-slate-400">{localize(model.desc, "zh")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.75fr)_minmax(360px,.85fr)]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h3 className="text-2xl font-black text-white">核心 API 分组</h3>
            <div className="mt-5 space-y-4">
              {backendApiGroups.map((group) => (
                <div key={group.group} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="font-mono text-sm font-black text-fuchsia-100">{group.group}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {group.apis.map((api) => <span key={api} className="rounded-full border border-cyan-300/15 bg-cyan-300/10 px-2.5 py-1 font-mono text-[10px] text-cyan-100">{api}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h3 className="text-2xl font-black text-white">实施阶段</h3>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {backendRoadmap.map((item, index) => (
                <div key={item.phase} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="font-mono text-sm font-black text-cyan-100">{index + 1}. {item.phase}</div>
                  <p className="mt-2 text-xs leading-6 text-slate-400">{item.zh}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-cyan-300/20 bg-white/[0.045] p-5 backdrop-blur-xl lg:sticky lg:top-28 lg:self-start">
          <h3 className="text-2xl font-black text-white">最近阅读</h3>
          <p className="mt-2 text-xs leading-6 text-slate-400">技术书籍、论文、开源项目的近期阅读沉淀。</p>
          <div className="mt-5 space-y-4">
            {recentReadings.map((item) => (
              <article key={`${item.type}-${localize(item.title, "zh")}`} className="rounded-3xl border border-white/10 bg-black/20 p-4">
                <div className="mb-2 text-xs text-cyan-100">{item.type.toUpperCase()} · {item.progress}%</div>
                <h4 className="text-sm font-black text-white">{localize(item.title, "zh")}</h4>
                <p className="mt-1 text-xs text-slate-400">{localize(item.meta, "zh")}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div style={{ width: `${item.progress}%` }} className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-fuchsia-300" />
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
