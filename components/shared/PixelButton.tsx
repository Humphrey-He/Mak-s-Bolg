"use client";

import { motion } from "framer-motion";

export function PixelButton({
  children,
  variant = "primary",
  onClick
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}) {
  const styles =
    variant === "primary"
      ? "border-cyan-300/60 bg-cyan-400/15 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,.25)] hover:bg-cyan-400/25"
      : "border-fuchsia-300/50 bg-fuchsia-500/10 text-fuchsia-100 shadow-[0_0_28px_rgba(217,70,239,.18)] hover:bg-fuchsia-500/20";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.035 }}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 ${styles}`}
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
