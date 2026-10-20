import { Skeleton } from "@/shared/ui/Skeleton";

export function ListingSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  );
}
