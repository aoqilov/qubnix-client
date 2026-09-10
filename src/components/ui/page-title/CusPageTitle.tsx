interface CusPageTitleProps {
  title: string;
  description?: string;
}

export function CusPageTitle({ title, description }: CusPageTitleProps) {
  return (
    <div className="mb-4">
      <h1 className="font-condensed text-lg tracking-wide">{title}</h1>
      {description && (
        <p className="mt-0.5 text-sm text-neutral-500 dark:text-[var(--text-muted)]">
          {description}
        </p>
      )}
    </div>
  );
}
