import clsx from "clsx";
import { ComponentProps, useId } from "react";

type Props = ComponentProps<"input"> & {
  label: string;
};

export function Input({ label, className, ...rest }: Props) {
  const id = useId();

  return (
    <div className="space-y-2">
      <label htmlFor={id}>{label}</label>
      <input
        {...rest}
        id={id}
        className={clsx(
          "block min-w-0 w-full px-3 py-2 rounded border border-gray-400 outline-none focus:outline-teal-600 focus:-outline-offset-1 bg-transparent disabled:text-gray-600",
          className
        )}
      />
    </div>
  );
}
