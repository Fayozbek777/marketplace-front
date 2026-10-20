import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";

// ===== Card =====
const cardVariants = cva(
  "bg-white rounded-xl border border-gray-200 shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        outline: "shadow-none",
        ghost: "border-transparent bg-transparent shadow-none",
        muted: "bg-gray-50 border-gray-200 shadow-none",
      },
      padding: {
        none: "",
        sm: "p-3",
        md: "p-4",
        lg: "p-6",
      },
      hoverable: {
        true: "transition hover:shadow-md hover:border-gray-300 cursor-pointer",
      },
    },
    defaultVariants: { variant: "default", padding: "none" },
  },
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hoverable, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, hoverable }), className)}
      {...props}
    />
  ),
);
Card.displayName = "Card";

// ===== CardHeader =====
export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pb-2", className)} {...props} />;
}

// ===== CardTitle =====
export function CardTitle({
  className,
  as: As = "h3",
  ...props
}: HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4";
}) {
  return (
    <As
      className={cn(
        "text-base font-semibold text-gray-900 leading-tight",
        className,
      )}
      {...props}
    />
  );
}

// ===== CardDescription =====
export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-gray-500 mt-1", className)} {...props} />
  );
}

// ===== CardContent =====
export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 pt-2", className)} {...props} />;
}

// ===== CardFooter =====
export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-4 pt-2 flex items-center justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}

// ===== CardMedia (картинка сверху) =====
export function CardMedia({
  src,
  alt = "",
  className,
  aspect = "square",
  children,
}: {
  src?: string;
  alt?: string;
  aspect?: "square" | "video" | "wide";
  className?: string;
  children?: ReactNode;
}) {
  const aspectCls = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[16/9]",
  }[aspect];

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100 rounded-t-xl",
        aspectCls,
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        children
      )}
    </div>
  );
}
