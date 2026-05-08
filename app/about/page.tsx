import { SiteShell } from "@/components/layout/SiteShell";
import { copy } from "@/data/copy";

export default function Page() {
  const t = copy.zh;

  return (
    <SiteShell>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-16 lg:grid-cols-[.9fr_1.1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-7 backdrop-blur-xl">
          <div className="font-serif text-5xl font-black text-white">书鸿</div>
          <div className="mt-2 font-mono text-sm uppercase tracking-[0.34em] text-cyan-200/75">Juno Mak</div>
          <p className="mt-6 text-sm leading-8 text-slate-300">{t.aboutDesc}</p>
        </div>
      </section>
    </SiteShell>
  );
}
