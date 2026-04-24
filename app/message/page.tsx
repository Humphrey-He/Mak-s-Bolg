import { SiteShell } from "@/components/layout/SiteShell";
import { copy } from "@/data/copy";

export default function Page() {
  const t = copy.zh;

  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl">
          <h2 className="font-serif text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">{t.messageTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400">{t.messageDesc}</p>
          <div className="mt-7 grid gap-4">
            <input className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50" placeholder="你的昵称" />
            <input className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50" placeholder="邮箱或联系方式" />
            <textarea className="min-h-[150px] rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50" placeholder="想说点什么..." />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
