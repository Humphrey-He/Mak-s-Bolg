export default {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mt-12 text-4xl font-black tracking-tight text-white first:mt-0">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mt-12 text-3xl font-black tracking-tight text-white">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mt-10 text-2xl font-bold text-cyan-100">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => <p className="mt-5 text-base leading-8 text-slate-300">{children}</p>,
  ul: ({ children }: { children?: React.ReactNode }) => <ul className="mt-5 list-disc space-y-2 pl-6 text-slate-300">{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-slate-300">{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => <li className="leading-8">{children}</li>,
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-bold text-white">{children}</strong>,
  code: ({ children }: { children?: React.ReactNode }) => <code className="rounded bg-white/8 px-1.5 py-0.5 text-cyan-100">{children}</code>,
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="mt-6 overflow-x-auto rounded-3xl border border-white/10 bg-[#07101b] p-5 text-sm leading-7 text-emerald-200">{children}</pre>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="mt-6 border-l-4 border-cyan-300/40 bg-cyan-300/6 px-5 py-4 text-slate-300">{children}</blockquote>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a href={href} className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 transition hover:text-cyan-100">{children}</a>
  ),
};
