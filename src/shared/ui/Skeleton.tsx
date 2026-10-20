import { cn } from "@/shared/lib/cn";

interface Props {
  className?: string;
}

export function Skeleton({ className }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-gray-200/70",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        "before:animate-[shimmer_1.6s_infinite]",
        className,
      )}
      aria-hidden="true"
    />
  );
}
