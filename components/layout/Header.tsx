"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Icon } from "@/components/shared/Icon";
import type { Copy } from "@/data/copy";

export function Header({ t }: { t: Copy }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-cyan-300/10 bg-[#080817]/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="group flex items-center gap-3 text-left">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_28px_rgba(34,211,238,.3)] transition group-hover:rotate-3 group-hover:scale-105">
            <Icon name="terminal" className="h-5 w-5 text-cyan-200" />
          </div>
          <div>
            <div className="font-serif text-2xl font-black tracking-[0.24em] text-white md:text-3xl">书鸿</div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.34em] text-cyan-200/75">Juno Mak</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.035] p-1 md:flex">
          {t.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.key} href={item.href} className="relative">
                <motion.div
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative min-w-[76px] rounded-xl px-3 py-2 text-center transition ${
                    active ? "bg-cyan-300/12 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,.16)]" : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {active && <motion.span layoutId="activeNavPill" className="absolute inset-0 rounded-xl border border-cyan-200/30 bg-cyan-300/10" />}
                  <span className="relative z-10 block text-[13px] font-bold tracking-[0.14em]">{item.label}</span>
                  <span className="relative z-10 mt-0.5 block font-mono text-[9px] uppercase tracking-[0.16em] opacity-55">{item.hint}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <a
          className="hidden h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-slate-200 transition hover:-translate-y-0.5 hover:border-cyan-200/50 hover:text-cyan-100 sm:grid"
          href="https://github.com/Humphrey-He"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub: Humphrey-He"
        >
          <Icon name="github" className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}
