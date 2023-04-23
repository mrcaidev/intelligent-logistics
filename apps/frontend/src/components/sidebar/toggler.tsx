import clsx from "clsx";

type Props = {
  isOpen: boolean;
  toggle: () => void;
};

export function SidebarToggler({ isOpen, toggle }: Props) {
  return (
    <button
      type="button"
      onClick={toggle}
      className={clsx(
        "fixed right-4 top-3 p-2 rounded transition-colors z-10",
        isOpen ? "hover:bg-gray-300" : "hover:bg-gray-200"
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={clsx(isOpen && "open")}
      >
        <g className="[.open_&]:rotate-45 [.open_&]:delay-150 origin-center transition-transform">
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
            className="[.open_&]:translate-y-[6px] delay-150 [.open_&]:delay-[0s] transition-transform"
          ></line>
        </g>
        <line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          className="[.open_&]:opacity-0 delay-150 [.open_&]:delay-[0s] transition-opacity"
        ></line>
        <g className="[.open_&]:-rotate-45 [.open_&]:delay-150 origin-center transition-transform">
          <line
            x1="3"
            y1="18"
            x2="21"
            y2="18"
            className="[.open_&]:-translate-y-[6px] delay-150 [.open_&]:delay-[0s] transition-transform"
          ></line>
        </g>
      </svg>
      <span className="sr-only">{isOpen ? "关闭" : "打开"}侧边栏</span>
    </button>
  );
}
