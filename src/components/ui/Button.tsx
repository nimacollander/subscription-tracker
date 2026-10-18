type Variant = "primary" | "secondary" | "danger" | "ghost" | "ghost-danger";
type Size = "sm" | "md";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent/90",
  secondary: "border border-border bg-surface-2 text-foreground hover:border-muted/40",
  danger: "bg-danger text-on-accent hover:bg-danger/90",
  ghost: "text-muted hover:bg-surface-2 hover:text-foreground",
  "ghost-danger": "text-muted hover:bg-danger-soft hover:text-danger",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4.5 text-sm",
};

export function Button({ variant = "secondary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
