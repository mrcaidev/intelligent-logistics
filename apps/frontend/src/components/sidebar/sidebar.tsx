import { PropsWithChildren, useState } from "react";
import { Toggler } from "./toggler";

type Props = PropsWithChildren;

export const Sidebar = ({ children }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen((isOpen) => !isOpen);

  return (
    <aside>
      <Toggler isOpen={isOpen} toggle={toggle} />
      <div
        className={
          "fixed right-0 top-0 bottom-0 flex flex-col w-screen md:w-80 h-full px-6 pt-16 pb-4 bg-gray-800 transition-transform" +
          (isOpen ? " translate-x-0" : " translate-x-full")
        }
      >
        {children}
      </div>
    </aside>
  );
};
