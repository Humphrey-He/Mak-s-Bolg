"use client";

import { TinaCMS, TinaProvider, useCMS } from "tinacms";
import { NextMarkdown } from "next-tinacms-markdown";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  return (
    <TinaProvider>
      <TinaCMS
        branch="main"
        clientId={process.env.NEXT_PUBLIC_TINA_CLIENT_ID || ""}
        token={process.env.TINA_TOKEN || ""}
      >
        <AdminDashboard />
      </TinaCMS>
    </TinaProvider>
  );
}

function AdminDashboard() {
  const cms = useCMS();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#080817] text-white">
      <header className="border-b border-white/10 bg-black/20 px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <h1 className="font-serif text-2xl font-black tracking-wide">书鸦 管理后台</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10"
            >
              返回博客
            </button>
            <button
              onClick={() => cms.toggle()}
              className="rounded-lg border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-400/20"
            >
              {cms.enabled ? "退出编辑" : "进入编辑"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
          <h2 className="text-2xl font-bold">欢迎使用 TinaCMS</h2>
          <p className="mt-4 text-slate-400">
            点击上方"进入编辑"按钮开启可视化编辑模式，你可以在此管理博客文章和项目。
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h3 className="text-lg font-bold text-cyan-100">文章管理</h3>
              <p className="mt-2 text-sm text-slate-400">创建、编辑、发布博客文章</p>
              <button
                onClick={() => cms.toggle()}
                className="mt-4 rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100 transition hover:bg-cyan-400/20"
              >
                编辑文章
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
              <h3 className="text-lg font-bold text-fuchsia-100">项目管理</h3>
              <p className="mt-2 text-sm text-slate-400">管理项目作品集内容</p>
              <button
                onClick={() => cms.toggle()}
                className="mt-4 rounded-xl border border-fuchsia-300/30 bg-fuchsia-400/10 px-4 py-2 text-sm text-fuchsia-100 transition hover:bg-fuchsia-400/20"
              >
                编辑项目
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-yellow-300/20 bg-yellow-300/10 p-4">
            <p className="text-sm text-yellow-100">
              <strong>注意：</strong>要使用 TinaCMS 的完整功能，请配置环境变量{' '}
              <code className="rounded bg-black/30 px-2 py-0.5">NEXT_PUBLIC_TINA_CLIENT_ID</code> 和{' '}
              <code className="rounded bg-black/30 px-2 py-0.5">TINA_TOKEN</code>。
              你可以在 <a href="https://tina.io" className="underline" target="_blank" rel="noopener">tina.io</a> 注册免费账号获取。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
