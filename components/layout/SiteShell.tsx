import { copy } from "@/data/copy";
import { BackgroundGrid } from "@/components/layout/BackgroundGrid";
import { Header } from "@/components/layout/Header";
import { MascotCompanion } from "@/components/layout/MascotCompanion";
import { ScanLine } from "@/components/layout/ScanLine";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const t = copy.zh;

  return (
    <main className="min-h-screen overflow-hidden text-slate-100">
      <BackgroundGrid />
      <ScanLine />
      <div className="relative z-10">
        <Header t={t} />
        {children}
      </div>
      <MascotCompanion />
    </main>
  );
}
