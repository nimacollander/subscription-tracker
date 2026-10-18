type CardProps = {
  title?: string;
  className?: string;
  children: React.ReactNode;
};

export function Card({ title, className = "", children }: CardProps) {
  return (
    <section
      className={`rounded-2xl border border-border bg-surface p-5 sm:p-6 ${className}`}
    >
      {title && <h2 className="font-label mb-5 text-muted">{title}</h2>}
      {children}
    </section>
  );
}
