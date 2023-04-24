import clsx from "clsx";
import { ComponentProps } from "react";
import { Icon, Loader } from "react-feather";

type ColorScheme = "teal" | "red" | "gray";
type Variant = "solid" | "dim" | "ghost" | "link";
type Size = "normal" | "small";

type Props = ComponentProps<"button"> & {
  colorScheme?: ColorScheme;
  variant?: Variant;
  size?: Size;
  icon?: Icon;
  isLoading?: boolean;
};

export function Button({
  colorScheme = "teal",
  variant = "solid",
  size = "normal",
  icon: Icon,
  isLoading = false,
  type = "button",
  disabled,
  className,
  children,
  ...rest
}: Props) {
  const color = getButtonColor(variant, colorScheme);
  const layout = getButtonLayout(variant, size);
  const iconSize = getIconSize(size);

  return (
    <button
      {...rest}
      type={type}
      disabled={isLoading || disabled}
      className={clsx(
        "inline-flex justify-center items-center gap-2 transition disabled:opacity-40 disabled:pointer-events-none",
        color,
        layout,
        className
      )}
    >
      {Icon && isLoading && <Loader size={iconSize} className="animate-spin" />}
      {Icon && !isLoading && <Icon size={iconSize} />}
      {children}
    </button>
  );
}

function getButtonColor(variant: Variant, colorScheme: ColorScheme) {
  const colorMap = {
    solid: {
      teal: "bg-teal-600 hover:bg-teal-700 text-gray-100",
      red: "bg-red-600 hover:bg-red-700 text-gray-100",
      gray: "bg-gray-600 hover:bg-gray-700 text-gray-100",
    },
    dim: {
      teal: "bg-teal-600/15 hover:bg-teal-600/30",
      red: "bg-red-600/15 hover:bg-red-600/30",
      gray: "bg-gray-600/15 hover:bg-gray-600/30",
    },
    ghost: {
      teal: "hover:bg-teal-600/15",
      red: "hover:bg-red-600/15",
      gray: "hover:bg-gray-600/15",
    },
    link: {
      teal: "text-teal-600 hover:text-teal-900",
      red: "text-red-600 hover:text-red-900",
      gray: "text-gray-600 hover:text-gray-900",
    },
  };
  return colorMap[variant][colorScheme];
}

function getButtonLayout(variant: Variant, size: Size) {
  if (variant === "link") {
    const sizeMap = {
      normal: "",
      small: "text-sm",
    };
    return sizeMap[size];
  }

  const sizeMap = {
    normal: "px-4 py-3 rounded-md font-bold",
    small: "px-2 py-1 rounded text-sm",
  };
  return sizeMap[size];
}

function getIconSize(size: Size) {
  const sizeMap = {
    normal: 20,
    small: 18,
  };
  return sizeMap[size];
}
