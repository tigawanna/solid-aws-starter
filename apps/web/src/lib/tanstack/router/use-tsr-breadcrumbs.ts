import { useLocation } from "@tanstack/solid-router";
import { createMemo } from "solid-js";

const routeLabels: Record<string, string> = {
  sse: "SSE",
};

export function useTSRBreadCrumbs() {
  const location = useLocation();

  const breadcrumb_routes = createMemo(() => {
    const route_history = location()
      .pathname.split("/")
      .filter((part) => part.length > 0);

    if (route_history.length === 0) {
      return [{ name: "Home", path: "/" }];
    }

    return route_history.reduce((acc: { name: string; path: string }[], route) => {
      const prev_path = acc[acc.length - 1]?.path ?? "";
      const fallbackName = route.charAt(0).toUpperCase() + route.slice(1).replaceAll("-", " ");
      const name = routeLabels[route] ?? fallbackName;
      acc.push({ name, path: `${prev_path}/${route}` });
      return acc;
    }, []);
  });

  return { breadcrumb_routes };
}
