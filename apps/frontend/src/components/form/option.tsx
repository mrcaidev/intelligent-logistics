import clsx from "clsx";
import { ComponentProps } from "react";

type Props = ComponentProps<"option">;

export function Option({ className, ...rest }: Props) {
  return <option {...rest} className={clsx("bg-gray-200", className)} />;
}
