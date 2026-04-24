export function ScanLine() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.08] mix-blend-screen">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,.7)_51%)] bg-[length:100%_4px]" />
      <div className="absolute inset-0 animate-[scan_6s_linear_infinite] bg-gradient-to-b from-transparent via-cyan-300/30 to-transparent" />
    </div>
  );
}
