type CardProps = {
  title?: string;
  className?: string;
  children: React.ReactNode;
};

export function Card({ title, className = "", children }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-border bg-surface p-5 shadow-sm ${className}`}
    >
      {title && <h2 className="mb-3 text-sm font-medium text-muted">{title}</h2>}
      {children}
    </section>
  );
}
