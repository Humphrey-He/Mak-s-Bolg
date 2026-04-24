import { projectCards } from "@/data/projects";
import { copy } from "@/data/copy";
import { localize } from "@/lib/i18n";

export function ProjectsPage() {
  const t = copy.zh;

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-8">
        <h2 className="font-serif text-4xl font-black tracking-[-0.04em] text-white md:text-6xl">{t.projectTitle}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">{t.projectDesc}</p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projectCards.map((project) => (
          <article key={project.name} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl hover:border-cyan-200/30">
            <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-xs text-fuchsia-100">{project.type}</span>
            <h3 className="mt-5 text-2xl font-black text-white">{project.name}</h3>
            <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-400">{localize(project.desc, "zh")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
