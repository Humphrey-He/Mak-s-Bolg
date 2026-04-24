export function PersonaLab() {
  const personas = ["🧑‍💻 夜行 Debugger", "🛰️ 系统架构航海家", "⚡ 缓存命中猎人", "🤖 Agent 召唤师"];

  return (
    <section className="mx-auto max-w-7xl px-5 pb-14">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
        <h2 className="text-2xl font-black text-white">选择今日阅读人格</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {personas.map((item) => (
            <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200">{item}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
