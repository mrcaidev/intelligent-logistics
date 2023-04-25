import clsx from "clsx";
import { useGlobalState } from "contexts/global-state";
import { PropsWithChildren } from "react";

export function CanvasContainer({ children }: PropsWithChildren) {
  const { isSidebarOpen } = useGlobalState();

  return (
    <main className={clsx("relative h-screen", isSidebarOpen && "mr-90")}>
      {children}
    </main>
  );
}
