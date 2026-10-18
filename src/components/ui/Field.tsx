type FieldProps = {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
};

/** Label plus inline error for one input. Pair with fieldProps() on the input itself. */
export function Field({ id, label, error, optional, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Connects an input to its label and error message for screen readers. */
export function fieldProps(id: string, error?: string) {
  return {
    id,
    name: id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    className: `w-full rounded-lg border bg-surface px-3 py-2 text-sm outline-none transition focus:ring-2 ${
      error ? "border-danger focus:ring-danger/30" : "border-border focus:border-accent focus:ring-accent/30"
    }`,
  };
}
