import { SiteShell } from "@/components/layout/SiteShell";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";

export default function BlogNotFound() {
  return (
    <SiteShell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5">
        <h1 className="font-serif text-6xl font-black text-white">404</h1>
        <p className="mt-4 text-lg text-slate-400">文章不存在或已被移除</p>
        <Link
          href="/blog"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-cyan-200/50 hover:text-cyan-100"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          返回文章列表
        </Link>
      </div>
    </SiteShell>
  );
}
