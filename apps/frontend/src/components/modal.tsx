import { PropsWithChildren, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { X } from "react-feather";

type Props = PropsWithChildren<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
}>;

export function Modal({ isOpen, onClose, title, children }: Props) {
  const id = useId();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  });

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <>
      <div
        role="presentation"
        onClick={onClose}
        className="fixed left-0 right-0 top-0 bottom-0 bg-gray-900/75 z-20"
      />
      <div
        role="dialog"
        aria-labelledby={id}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/5 max-w-3xl px-8 py-6 m-8 rounded-lg bg-gray-200 z-20"
      >
        <div className="flex justify-between items-center gap-3 pb-5">
          <h2 id={id} className="font-bold text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-300 transition-colors"
          >
            <X />
            <span className="sr-only">关闭模态框</span>
          </button>
        </div>
        {children}
      </div>
    </>,
    document.body
  );
}
