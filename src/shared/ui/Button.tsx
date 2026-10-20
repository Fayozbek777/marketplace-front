import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  [
    "relative inline-flex items-center justify-center gap-2",
    "rounded-lg font-medium whitespace-nowrap select-none",
    "transition-[background-color,color,border-color,box-shadow,transform] duration-150",
    "active:translate-y-px",
    "disabled:opacity-50 disabled:pointer-events-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
    "aria-busy:cursor-wait",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-brand-600 text-white shadow-sm hover:bg-brand-700 hover:shadow",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        outline:
          "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-400",
        ghost: "text-gray-700 hover:bg-gray-100",
        soft: "bg-brand-50 text-brand-700 hover:bg-brand-100",
        link: "text-brand-600 hover:text-brand-700 underline-offset-4 hover:underline px-0",
        danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0 gap-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    compoundVariants: [
      // у link-варианта не должно быть паддингов и высоты
      { variant: "link", size: "sm", class: "h-auto px-0" },
      { variant: "link", size: "md", class: "h-auto px-0" },
      { variant: "link", size: "lg", class: "h-auto px-0 text-base" },
    ],
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  /** Текст/иконки сохраняют позицию при загрузке — кнопка не «прыгает» */
  loadingText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      loading,
      loadingText,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-busy={loading || undefined}
        aria-disabled={disabled || loading || undefined}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {/* Контент остаётся на месте, когда появился спиннер */}
        <span
          className={cn(
            "inline-flex items-center justify-center gap-2 transition-opacity",
            loading && "opacity-0",
          )}
        >
          {children}
        </span>

        {/* Оверлей загрузки поверх контента */}
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center gap-2">
            <span
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
              aria-hidden="true"
            />
            {loadingText && <span>{loadingText}</span>}
          </span>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";
