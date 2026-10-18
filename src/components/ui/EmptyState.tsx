type EmptyStateProps = {
  message: string;
  title?: string;
  /** Optional call to action, such as a button. */
  children?: React.ReactNode;
};

export function EmptyState({ message, title, children }: EmptyStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border p-8 text-center">
      {title && <p className="text-lg font-semibold">{title}</p>}
      <p className="text-sm text-muted">{message}</p>
      {children}
    </div>
  );
}
