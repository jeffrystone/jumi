import type { ReactNode } from "react";

interface KitPageProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function KitPage({ title, subtitle, children }: KitPageProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-10 md:px-10">
        <header className="mb-8 border-b border-secondary pb-5">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
          {subtitle ? <p className="mt-2 text-muted-foreground">{subtitle}</p> : null}
        </header>
        {children}
      </div>
    </main>
  );
}
