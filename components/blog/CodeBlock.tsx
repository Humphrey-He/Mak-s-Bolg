"use client";

import { useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";

type CodeBlockProps = {
  children?: ReactNode;
};

function getTextContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  }

  if (!node || typeof node !== "object") {
    return "";
  }

  const element = node as ReactElement<{ children?: ReactNode }>;
  return getTextContent(element.props?.children);
}

function getCodeMeta(children: ReactNode) {
  const child = children as ReactElement<{ className?: string; children?: ReactNode }>;
  const className = child?.props?.className || "";
  const language = className
    .split(" ")
    .find((item) => item.startsWith("language-"))
    ?.replace("language-", "")
    .toUpperCase();

  return {
    language: language || "CODE",
    code: getTextContent(child?.props?.children ?? children).trimEnd(),
  };
}

export function CodeBlock({ children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { language, code } = useMemo(() => getCodeMeta(children), [children]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="group mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#07101b] shadow-[0_18px_80px_rgba(8,15,30,0.45)]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-200/70">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-slate-300 transition hover:border-cyan-200/40 hover:text-cyan-100"
        >
          {copied ? "已复制" : "复制代码"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-slate-100">{children}</pre>
    </div>
  );
}
