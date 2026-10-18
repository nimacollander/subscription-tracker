type CardProps = {
  title?: string;
  icon?: React.ReactNode;
  /** Right side of the header, e.g. a link or filter. */
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
};

export function Card({ title, icon, action, className = "", children }: CardProps) {
  return (
    <section className={`rounded-2xl border border-border bg-surface p-5 sm:p-6 ${className}`}>
      {(title || action) && (
        <div className="mb-5 flex items-center justify-between gap-4">
          {title && (
            <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight">
              {icon && <span className="text-accent">{icon}</span>}
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
