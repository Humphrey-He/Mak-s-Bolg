"use client";

import { motion } from "framer-motion";

export function BackgroundGrid() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-[#080817]">
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,.25),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(217,70,239,.18),transparent_28%),radial-gradient(circle_at_50%_85%,rgba(59,130,246,.16),transparent_35%)]"
      />
      <motion.div
        animate={{ backgroundPosition: ["0px 0px", "42px 42px"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(34,211,238,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.12)_1px,transparent_1px)] bg-[size:42px_42px]"
      />
    </div>
  );
}
