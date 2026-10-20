import { Toaster } from "sonner";
import { QueryProvider } from "./providers/QueryProvider";
import { RouterProvider } from "./providers/RouterProvider";
import { AppRouter } from "./router";

export default function App() {
  return (
    <QueryProvider>
      <RouterProvider>
        <AppRouter />
        <Toaster position="top-right" richColors />
      </RouterProvider>
    </QueryProvider>
  );
}
