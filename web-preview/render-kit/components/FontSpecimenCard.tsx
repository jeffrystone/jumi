import type { FontSpecimen } from "../types";

interface FontSpecimenCardProps {
  specimen: FontSpecimen;
}

export function FontSpecimenCard({ specimen }: FontSpecimenCardProps) {
  return (
    <article className="rounded-xl border border-secondary bg-secondary p-5">
      <header className="mb-4 border-b border-secondary pb-3">
        <h3 className="text-lg font-semibold text-foreground">{specimen.title}</h3>
        <p className="mt-1 text-xs text-faint-foreground">{specimen.fontFamily}</p>
        {specimen.note ? <p className="mt-1 text-sm text-muted-foreground">{specimen.note}</p> : null}
      </header>

      <div className="space-y-3" style={{ fontFamily: specimen.fontFamily }}>
        {specimen.samples.map((sample) => (
          <div key={sample.id} className="rounded-lg bg-background p-3">
            <p className="mb-1 text-xs uppercase tracking-wider text-faint-foreground">{sample.label}</p>
            <p
              className="text-foreground"
              style={{
                fontSize: sample.fontSize,
                fontWeight: sample.fontWeight,
                lineHeight: sample.lineHeight,
                letterSpacing: sample.tracking,
              }}
            >
              {sample.text}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
