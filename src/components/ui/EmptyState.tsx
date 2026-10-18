type EmptyStateProps = {
  message: string;
  title?: string;
  /** Optional call to action, such as a button. */
  children?: React.ReactNode;
};

export function EmptyState({ message, title, children }: EmptyStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-6 text-center">
      {title && <p className="font-medium">{title}</p>}
      <p className="text-sm text-muted">{message}</p>
      {children}
    </div>
  );
}
