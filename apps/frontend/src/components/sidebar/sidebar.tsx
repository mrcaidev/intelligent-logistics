import clsx from "clsx";
import { useBoolean } from "hooks/use-boolean";
import { PropsWithChildren } from "react";
import { createPortal } from "react-dom";
import { SidebarToggler } from "./toggler";

export function Sidebar({ children }: PropsWithChildren) {
  const { value: isOpen, toggle } = useBoolean();

  return (
    <>
      <SidebarToggler isOpen={isOpen} toggle={toggle} />
      {createPortal(
        <aside
          className={clsx(
            "flex flex-col fixed right-0 top-0 bottom-0 w-screen sm:w-90 pt-13 pb-4 border-l border-gray-300 bg-gray-200 shadow-lg transition-transform",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {children}
        </aside>,
        document.body
      )}
    </>
  );
}
