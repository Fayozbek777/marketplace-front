import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/cn";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Показать счётчик символов (использует maxLength) */
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      id,
      required,
      showCount,
      maxLength,
      value,
      defaultValue,
      ...props
    },
    ref,
  ) => {
    const autoId = useId();
    const textareaId = id ?? autoId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    const currentLength =
      typeof value === "string"
        ? value.length
        : typeof defaultValue === "string"
          ? defaultValue.length
          : 0;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block mb-1 text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={!!error || undefined}
          aria-describedby={
            [error && errorId, hint && hintId].filter(Boolean).join(" ") ||
            undefined
          }
          className={cn(
            "w-full px-3 py-2 rounded-lg border bg-white text-sm outline-none transition resize-y min-h-24",
            "border-gray-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100",
            "placeholder:text-gray-400",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            error && "border-red-500 focus:border-red-500 focus:ring-red-100",
            className,
          )}
          {...props}
        />
        <div className="mt-1 flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {error ? (
              <p
                id={errorId}
                className="text-sm text-red-500 flex items-center gap-1"
              >
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </p>
            ) : hint ? (
              <p id={hintId} className="text-sm text-gray-500">
                {hint}
              </p>
            ) : null}
          </div>
          {showCount && maxLength && (
            <span
              className={cn(
                "text-xs tabular-nums flex-shrink-0",
                currentLength >= maxLength ? "text-red-500" : "text-gray-400",
              )}
            >
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);
Textarea.displayName = "Textarea";
