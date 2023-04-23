import clsx from "clsx";
import { ComponentProps } from "react";
import { Icon, Loader } from "react-feather";

type ButtonVariant = "primary" | "danger" | "ghost";
type ButtonSize = "normal" | "small";

type Props = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: Icon;
  isLoading?: boolean;
};

export function Button({
  variant = "primary",
  size = "normal",
  icon: Icon,
  isLoading = false,
  type = "button",
  disabled,
  className,
  children,
  ...rest
}: Props) {
  const buttonColor = getButtonColor(variant);
  const buttonSize = getButtonSize(size);
  const iconSize = getIconSize(size);

  return (
    <button
      {...rest}
      type={type}
      disabled={isLoading || disabled}
      className={clsx(
        "flex items-center disabled:bg-gray-600 disabled:hover:bg-gray-600 transition-colors",
        buttonColor,
        buttonSize,
        className
      )}
    >
      {Icon && isLoading && <Loader size={iconSize} className="animate-spin" />}
      {Icon && !isLoading && <Icon size={iconSize} />}
      {children}
    </button>
  );
}

function getButtonColor(variant: ButtonVariant) {
  switch (variant) {
    case "primary":
      return "bg-teal-600 hover:bg-teal-700 text-gray-100";
    case "danger":
      return "bg-red-600 hover:bg-red-700 text-gray-100";
    case "ghost":
      return "bg-gray-300 hover:bg-gray-400";
  }
}

function getButtonSize(size: ButtonSize) {
  switch (size) {
    case "normal":
      return "gap-2 px-4 py-3 rounded-md font-bold";
    case "small":
      return "gap-1 px-2 py-1 rounded text-sm";
  }
}

function getIconSize(size: ButtonSize) {
  switch (size) {
    case "normal":
      return 18;
    case "small":
      return 14;
  }
}
