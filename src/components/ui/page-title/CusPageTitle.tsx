interface CusPageTitleProps {
  title: string;
  description?: string;
}

export function CusPageTitle({ title, description }: CusPageTitleProps) {
  return (
    <div className="mb-4">
      <h1 className="font-condensed text-3xl tracking-wide">{title}</h1>
      {description && (
        <p className="mt-0.5 text-sm text-[var(--text-muted)]">
          {description}
        </p>
      )}
    </div>
  );
}
