"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@/components/shared/Icon";
import { copy } from "@/data/copy";
import { localize } from "@/lib/i18n";

export function StartHere() {
  const t = copy.zh;

  const entries = [
    {
      title: "新手入口",
      desc: "第一次来？从这里开始",
      icon: "sparkles" as const,
      href: "/blog/high-concurrency-go-cache",
      gradient: "from-cyan-400/20 to-cyan-400/5",
      border: "border-cyan-300/30",
      textColor: "text-cyan-100",
      tag: "推荐阅读"
    },
    {
      title: "主题入口",
      desc: "按专题探索内容",
      icon: "tag" as const,
      href: "/blog",
      gradient: "from-fuchsia-400/20 to-fuchsia-400/5",
      border: "border-fuchsia-300/30",
      textColor: "text-fuchsia-100",
      tag: "专题"
    },
    {
      title: "项目入口",
      desc: "查看工程实践",
      icon: "cpu" as const,
      href: "/projects",
      gradient: "from-blue-400/20 to-blue-400/5",
      border: "border-blue-300/30",
      textColor: "text-blue-100",
      tag: "工程"
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 pb-14">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10">
            <Icon name="zap" className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-black text-white">从这里开始</h2>
            <p className="text-sm text-slate-400">选择你的阅读路径</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                href={entry.href}
                className={`group block rounded-2xl border ${entry.border} bg-gradient-to-br ${entry.gradient} p-5 transition-all hover:scale-[1.02] hover:shadow-lg`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className={`rounded-full border ${entry.border} bg-black/20 px-2.5 py-1 text-xs ${entry.textColor}`}>
                    {entry.tag}
                  </span>
                  <Icon name={entry.icon} className={`h-5 w-5 ${entry.textColor} transition-transform group-hover:translate-x-1`} />
                </div>
                <h3 className="text-lg font-black text-white">{entry.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{entry.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
