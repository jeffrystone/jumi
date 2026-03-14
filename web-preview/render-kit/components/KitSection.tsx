import type { ReactNode } from "react";

interface KitSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function KitSection({ title, description, children }: KitSectionProps) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        {description ? <p className="mt-1 text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}
