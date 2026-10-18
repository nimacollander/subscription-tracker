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
      <label htmlFor={id} className="text-[13px] font-medium text-muted">
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
    className: `h-11 w-full rounded-xl border bg-surface-2 px-3.5 text-sm outline-none transition placeholder:text-muted/70 focus:ring-2 [&:is(textarea)]:h-auto [&:is(textarea)]:py-2.5 ${
      error ? "border-danger focus:ring-danger/30" : "border-border focus:border-accent focus:ring-accent/30"
    }`,
  };
}
