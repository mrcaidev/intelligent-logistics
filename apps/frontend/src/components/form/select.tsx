import clsx from "clsx";
import { ComponentProps, useId } from "react";
import { ChevronDown } from "react-feather";
import { Option } from "./option";

type Props = ComponentProps<"select"> & {
  label: string;
  placeholder?: string | undefined;
};

export function Select({
  label,
  placeholder,
  className,
  children,
  ...rest
}: Props) {
  const id = useId();

  return (
    <div className="space-y-2">
      <label htmlFor={id}>{label}</label>
      <div className="relative">
        <select
          {...rest}
          id={id}
          className={clsx(
            "peer appearance-none min-w-0 w-full px-3 py-2 rounded border border-gray-400 outline-none focus:outline-teal-600 focus:-outline-offset-1 bg-transparent disabled:text-gray-600",
            className
          )}
        >
          {placeholder && (
            <Option value="" disabled>
              {placeholder}
            </Option>
          )}
          {children}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>
    </div>
  );
}
