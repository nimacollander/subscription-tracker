type PageHeaderProps = {
  title: string;
  /** Small line under the title; pass a non-breaking space to reserve its height. */
  description?: React.ReactNode;
  /** Right-aligned actions, e.g. a primary button. */
  children?: React.ReactNode;
};

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
      <div className="min-w-0">
        <h1 className="font-display text-4xl leading-[0.95] font-extrabold sm:text-5xl">{title}</h1>
        {description && <p className="mt-3 text-sm text-muted">{description}</p>}
      </div>
      {children}
    </div>
  );
}
