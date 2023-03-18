type Props = {
  isOpen: boolean;
  toggle: () => void;
};

export const Toggler = ({ isOpen, toggle }: Props) => {
  return (
    <button
      type="button"
      onClick={toggle}
      className={
        "fixed right-6 top-4 p-2 rounded transition-colors z-10" +
        (isOpen ? " hover:bg-gray-700" : " hover:bg-gray-800")
      }
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
      >
        <g
          className={
            "origin-center transition-transform" +
            (isOpen ? " rotate-45 delay-150" : "")
          }
        >
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
            className={
              "delay-150 transition-transform" +
              (isOpen ? " translate-y-[6px] delay-[0s]" : "")
            }
          ></line>
        </g>
        <line
          x1="3"
          y1="12"
          x2="21"
          y2="12"
          className={
            "delay-150 transition-opacity" +
            (isOpen ? " opacity-0 delay-[0s]" : "")
          }
        ></line>
        <g
          className={
            "origin-center transition-transform" +
            (isOpen ? " -rotate-45 delay-150" : "")
          }
        >
          <line
            x1="3"
            y1="18"
            x2="21"
            y2="18"
            className={
              "delay-150 transition-transform" +
              (isOpen ? " -translate-y-[6px] delay-[0s]" : "")
            }
          ></line>
        </g>
      </svg>
      <span className="sr-only">{isOpen ? "Close" : "Open"} the sidebar</span>
    </button>
  );
};
