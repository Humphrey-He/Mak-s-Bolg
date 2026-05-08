import Link from "next/link";
import { SiteShell } from "@/components/layout/SiteShell";
import { Icon } from "@/components/shared/Icon";

export default function AdminPage() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-4xl px-5 py-16">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10">
              <Icon name="terminal" className="h-7 w-7 text-cyan-200" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-black tracking-tight text-white">管理后台</h1>
              <p className="mt-1 text-sm text-slate-400">书鸦博客内容管理系统</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h2 className="text-lg font-bold text-cyan-100">TinaCMS 编辑器</h2>
              <p className="mt-2 text-sm text-slate-400">
                使用 TinaCMS 可视化编辑器管理博客文章和项目内容。内容以 MDX 格式存储在 Git 仓库中。
              </p>
              <div className="mt-4">
                <a
                  href="https://app.tina.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
                >
                  打开 TinaCMS
                  <Icon name="arrow" className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <h2 className="text-lg font-bold text-fuchsia-100">GitHub 仓库</h2>
              <p className="mt-2 text-sm text-slate-400">
                直接在 GitHub 上编辑 MDX 文件，或查看源代码。
              </p>
              <div className="mt-4">
                <a
                  href="https://github.com/Humphrey-He/Mak-s-Bolg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-300/30 bg-fuchsia-400/10 px-5 py-2.5 text-sm font-semibold text-fuchsia-100 transition hover:bg-fuchsia-400/20"
                >
                  打开 GitHub
                  <Icon name="github" className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4">
            <p className="text-sm text-yellow-100">
              <strong>提示：</strong> TinaCMS 需要配置环境变量才能使用可视化编辑器。
              在本地开发时运行 <code className="rounded bg-black/30 px-2 py-0.5">npm run dev</code>，
              然后访问 <code className="rounded bg-black/30 px-2 py-0.5">/admin</code>。
            </p>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-200"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
              返回博客首页
            </Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
