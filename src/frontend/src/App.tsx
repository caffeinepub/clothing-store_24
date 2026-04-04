import { Toaster } from "@/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { useInitializeStore } from "./hooks/useQueries";
import { routeTree } from "./routeTree";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function StoreInitializer() {
  useInitializeStore();
  return null;
}

export default function App() {
  return (
    <>
      <StoreInitializer />
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
