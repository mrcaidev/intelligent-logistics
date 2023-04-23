import clsx from "clsx";
import { ComponentProps, useId } from "react";
import { Check } from "react-feather";

type Props = ComponentProps<"input"> & {
  label: string;
};

export function Checkbox({ label, className, ...rest }: Props) {
  const id = useId();

  return (
    <div className="flex items-center gap-2 relative">
      <input
        {...rest}
        type="checkbox"
        id={id}
        className={clsx(
          "peer appearance-none w-4 h-4 rounded border border-gray-400 outline-none focus:outline-teal-600 focus:-outline-offset-1 checked:border-none bg-transparent checked:bg-teal-600 disabled:checked:bg-gray-400",
          className
        )}
      />
      <Check
        size={16}
        className="hidden peer-checked:inline absolute left-0 top-1/2 -translate-y-1/2 stroke-gray-100 pointer-events-none"
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
