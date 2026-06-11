import { Suspense } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { ReadingsContent } from "@/components/readings/ReadingsContent";

export default function ReadingsPage() {
  return (
    <SiteShell>
      <Suspense fallback={<ReadingsLoadingSkeleton />}>
        <ReadingsContent />
      </Suspense>
    </SiteShell>
  );
}

function ReadingsLoadingSkeleton() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-16">
      <div className="mb-10">
        <div className="mb-4 h-8 w-48 animate-pulse rounded-full bg-white/10" />
        <div className="h-12 w-64 animate-pulse rounded bg-white/10" />
        <div className="mt-4 h-20 w-full max-w-2xl animate-pulse rounded bg-white/5" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/[0.04]" />
        ))}
      </div>
    </section>
  );
}
