"use client";

import { useEffect, useState } from "react";
import type { ArticleHeading } from "@/lib/article";

type ArticleTableOfContentsProps = {
  headings: ArticleHeading[];
};

export function ArticleTableOfContents({ headings }: ArticleTableOfContentsProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible?.target?.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-18% 0px -65% 0px",
        threshold: [0, 1],
      },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl xl:sticky xl:top-28">
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">目录</p>
      <nav className="mt-4 space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`block rounded-xl px-3 py-2 text-sm transition ${
              activeId === heading.id ? "bg-cyan-300/10 text-cyan-100" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            } ${heading.level === 3 ? "ml-4" : ""}`}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
