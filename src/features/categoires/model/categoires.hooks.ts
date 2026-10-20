import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/categoires.api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 30 * 60 * 1000,
  });
}
