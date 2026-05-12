import type { Metadata } from "next";
import "@/styles/globals.css";
import { MascotCompanion } from "@/components/layout/MascotCompanion";

export const metadata: Metadata = {
  title: "书鸿 · Juno Mak",
  description: "Backend, cloud native, gateway, cache, object storage and AI Agent engineering blog."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <MascotCompanion />
      </body>
    </html>
  );
}
