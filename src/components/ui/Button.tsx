type Variant = "primary" | "secondary" | "danger" | "ghost" | "ghost-danger";
type Size = "sm" | "md";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const VARIANTS: Record<Variant, string> = {
  // Primary is ink, not accent: the teal is kept for state (active, focus, data).
  primary: "bg-foreground text-surface hover:bg-foreground/85",
  secondary: "border border-border bg-surface hover:border-foreground/30 hover:bg-background",
  danger: "bg-danger text-on-danger hover:opacity-90",
  ghost: "text-muted hover:bg-border/50 hover:text-foreground",
  "ghost-danger": "text-muted hover:bg-danger-soft hover:text-danger",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4.5 text-sm",
};

export function Button({ variant = "secondary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
