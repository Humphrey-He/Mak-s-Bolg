"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { localize } from "@/lib/i18n";
import { Icon } from "@/components/shared/Icon";
import type { Project } from "@/data/projects";

interface ProjectDetailProps {
  project: Project;
}

function renderContent(content: string): string {
  return content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(.+)$/gm, (line) => {
      if (line.startsWith("<h")) return line;
      return `<p>${line}</p>`;
    });
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-black/40">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const lang = "zh";

  return (
    <>
      <ReadingProgress />

      <div className="mx-auto max-w-4xl px-5 py-8">
        <header className="mb-8">
          <a
            href="/projects"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-cyan-200"
          >
            <Icon name="arrow" className="h-4 w-4" />
            返回项目列表
          </a>

          <div className="mt-6">
            <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 px-3 py-1 text-sm text-fuchsia-100">
              {project.type}
            </span>
          </div>

          <h1 className="mt-6 font-serif text-4xl font-black tracking-tight text-white md:text-5xl">
            {project.name}
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-slate-400">
            {localize(project.desc, lang)}
          </p>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-cyan-200/70">技术栈</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-cyan-200/70">核心亮点</h3>
            <ul className="space-y-2">
              {project.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div
          ref={contentRef}
          className="prose prose-invert prose-cyan max-w-none"
          dangerouslySetInnerHTML={{ __html: renderContent(localize(project.content, lang)) }}
        />
      </div>
    </>
  );
}
