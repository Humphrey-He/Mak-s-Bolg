import { SiteShell } from "@/components/layout/SiteShell";
import { ReadingTimeline } from "@/components/readings/ReadingTimeline";
import { Icon } from "@/components/shared/Icon";

export default function ReadingsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-5 py-16">
        <div className="mb-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-100">
            <Icon name="book" /> Knowledge Flow
          </div>
          <h1 className="font-serif text-4xl font-black tracking-[-0.04em] text-white md:text-5xl">
            最近阅读
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            技术书籍、论文、开源项目的阅读沉淀。每项记录都会关联到影响到的站内文章。
          </p>
        </div>

        <ReadingTimeline />
      </section>
    </SiteShell>
  );
}
