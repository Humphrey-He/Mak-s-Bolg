"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "@/components/shared/Icon";
import { PixelButton } from "@/components/shared/PixelButton";
import { copy } from "@/data/copy";
import { projectNames } from "@/data/projects";

export function Hero() {
  const t = copy.zh;

  return (
    <section className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 pb-12 pt-14 lg:grid-cols-[1.15fr_.85fr] lg:pt-20">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
          <Icon name="sparkles" /> {t.badge}
        </div>
        <h1 className="max-w-4xl font-serif text-[3.25rem] font-black leading-[0.98] tracking-[-0.06em] text-white md:text-[5.8rem] lg:text-[6.7rem]">
          {t.heroTitle}
          <span className="ml-4 align-middle font-mono text-lg font-semibold uppercase tracking-[0.34em] text-cyan-200/70 md:text-2xl">Juno Mak</span>
          <span className="mt-4 block bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-blue-200 bg-clip-text font-sans text-[2.25rem] tracking-[-0.045em] text-transparent md:text-[4.35rem] lg:text-[5.2rem]">
            {t.heroSubtitle}
          </span>
        </h1>
        <p className="mt-7 max-w-2xl text-[15px] leading-8 text-slate-300 md:text-lg">{t.heroDesc}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/blog"><PixelButton>{t.readPosts}<Icon name="arrow" /></PixelButton></Link>
          <Link href="/projects"><PixelButton variant="secondary">{t.viewProjects}<Icon name="cpu" /></PixelButton></Link>
          <Link href="/agent"><PixelButton variant="secondary">{t.agentTitle}<Icon name="zap" /></PixelButton></Link>
          <Link href="/message"><PixelButton variant="secondary">{t.leaveMessage}<Icon name="chat" /></PixelButton></Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotateX: 8 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
        className="relative min-h-[420px] rounded-[2rem] border border-cyan-300/20 bg-[#10102a]/70 p-5 shadow-[0_0_80px_rgba(34,211,238,.16)] backdrop-blur-xl"
      >
        <div className="relative h-full rounded-[1.45rem] border border-white/10 bg-black/30 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex gap-2"><span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-yellow-300" /><span className="h-3 w-3 rounded-full bg-green-300" /></div>
            <span className="text-xs text-cyan-200/60">/blog/index.tsx</span>
          </div>
          <div className="font-mono text-sm leading-7 text-slate-300">
            <p><span className="text-fuchsia-300">const</span> author = <span className="text-cyan-200">"书鸦 / Juno Mak"</span>;</p>
            <p><span className="text-fuchsia-300">const</span> role = <span className="text-cyan-200">"Backend & Cloud Native Developer"</span>;</p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3">
            {projectNames.slice(0, 4).map((p, i) => (
              <motion.div key={p} whileHover={{ y: -4, scale: 1.03 }} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-100"><Icon name="cpu" /></div>
                <div className="font-semibold text-white">{p}</div>
                <div className="mt-1 text-xs text-slate-500">#{String(i + 1).padStart(2, "0")}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
