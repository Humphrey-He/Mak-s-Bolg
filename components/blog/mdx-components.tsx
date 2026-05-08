import type { ReactNode } from "react";
import { CodeBlock } from "@/components/blog/CodeBlock";
import { slugifyHeading } from "@/lib/article";

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

  const element = node as { props?: { children?: ReactNode } };
  return getTextContent(element.props?.children);
}

function SectionTitle({ children, level = 2 }: { children?: ReactNode; level?: 2 | 3 }) {
  const id = slugifyHeading(getTextContent(children));

  if (level === 3) {
    return (
      <h3 id={id} className="group mt-10 scroll-mt-28 text-2xl font-bold tracking-tight text-cyan-100">
        <a href={`#${id}`} className="inline-flex items-center gap-2">
          <span>{children}</span>
          <span className="text-sm text-cyan-200/0 transition group-hover:text-cyan-200/70">#</span>
        </a>
      </h3>
    );
  }

  return (
    <h2 id={id} className="group mt-14 scroll-mt-28 border-t border-white/8 pt-8 text-3xl font-black tracking-tight text-white first:mt-0 first:border-t-0 first:pt-0">
      <a href={`#${id}`} className="inline-flex items-center gap-2">
        <span>{children}</span>
        <span className="text-sm text-cyan-200/0 transition group-hover:text-cyan-200/70">#</span>
      </a>
    </h2>
  );
}

const mdxComponents = {
  h1: ({ children }: { children?: ReactNode }) => <h1 className="mt-12 text-4xl font-black tracking-tight text-white first:mt-0">{children}</h1>,
  h2: ({ children }: { children?: ReactNode }) => <SectionTitle>{children}</SectionTitle>,
  h3: ({ children }: { children?: ReactNode }) => <SectionTitle level={3}>{children}</SectionTitle>,
  p: ({ children }: { children?: ReactNode }) => <p className="mt-5 text-[1.05rem] leading-8 text-slate-300">{children}</p>,
  ul: ({ children }: { children?: ReactNode }) => <ul className="mt-6 space-y-3 pl-6 text-slate-300 marker:text-cyan-200 list-disc">{children}</ul>,
  ol: ({ children }: { children?: ReactNode }) => <ol className="mt-6 space-y-3 pl-6 text-slate-300 marker:text-cyan-200 list-decimal">{children}</ol>,
  li: ({ children }: { children?: ReactNode }) => <li className="pl-1 leading-8">{children}</li>,
  strong: ({ children }: { children?: ReactNode }) => <strong className="font-bold text-white">{children}</strong>,
  em: ({ children }: { children?: ReactNode }) => <em className="text-cyan-100">{children}</em>,
  hr: () => <hr className="my-10 border-white/10" />,
  code: ({ children }: { children?: ReactNode }) => <code className="rounded-md border border-white/10 bg-white/8 px-1.5 py-0.5 text-cyan-100">{children}</code>,
  pre: ({ children }: { children?: ReactNode }) => <CodeBlock>{children}</CodeBlock>,
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="mt-8 rounded-r-2xl border-l-4 border-cyan-300/40 bg-cyan-300/6 px-5 py-4 text-slate-300">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: { children?: ReactNode; href?: string }) => (
    <a href={href} className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 transition hover:text-cyan-100">
      {children}
    </a>
  ),
  table: ({ children }: { children?: ReactNode }) => (
    <div className="mt-8 overflow-x-auto rounded-[1.5rem] border border-white/10">
      <table className="min-w-full border-collapse bg-black/20 text-left text-sm text-slate-300">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: ReactNode }) => <thead className="bg-white/6 text-slate-100">{children}</thead>,
  tbody: ({ children }: { children?: ReactNode }) => <tbody>{children}</tbody>,
  tr: ({ children }: { children?: ReactNode }) => <tr className="border-t border-white/10">{children}</tr>,
  th: ({ children }: { children?: ReactNode }) => <th className="px-4 py-3 font-semibold">{children}</th>,
  td: ({ children }: { children?: ReactNode }) => <td className="px-4 py-3 align-top leading-7">{children}</td>,
};

export default mdxComponents;
