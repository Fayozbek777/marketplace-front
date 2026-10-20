import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { RootLayout } from "../../layouts/RootLayout";

const HomePage = lazy(() => import("../../pages/home/HomePage"));

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
];
