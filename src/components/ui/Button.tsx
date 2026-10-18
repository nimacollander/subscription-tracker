type Variant = "primary" | "secondary" | "danger" | "ghost" | "ghost-danger";
type Size = "sm" | "md";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:opacity-90",
  secondary: "border border-border bg-surface hover:bg-border/50",
  danger: "bg-danger text-on-danger hover:opacity-90",
  ghost: "text-muted hover:bg-border/50 hover:text-foreground",
  "ghost-danger": "text-muted hover:bg-danger-soft hover:text-danger",
};

const SIZES: Record<Size, string> = {
  sm: "px-2.5 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export function Button({ variant = "secondary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
