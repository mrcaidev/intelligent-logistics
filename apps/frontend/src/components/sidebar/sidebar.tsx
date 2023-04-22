import clsx from "clsx";
import { PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SidebarToggler } from "./toggler";

export function Sidebar({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((isOpen) => !isOpen);

  useEffect(() => {
    const isLaptop = window.matchMedia("(min-width: 768px)").matches;
    setIsOpen(isLaptop);
  }, []);

  return (
    <>
      <SidebarToggler isOpen={isOpen} toggle={toggle} />
      {createPortal(
        <aside
          className={clsx(
            "flex flex-col fixed right-0 top-0 bottom-0 w-screen sm:w-90 pt-15 pb-4 border-l border-gray-300 bg-gray-200 shadow-lg transition-transform z-10",
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
