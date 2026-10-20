import { BrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function RouterProvider({ children }: Props) {
  return <BrowserRouter>{children}</BrowserRouter>;
}
