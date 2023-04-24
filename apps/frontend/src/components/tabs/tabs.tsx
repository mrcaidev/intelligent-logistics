import clsx from "clsx";
import { PropsWithChildren, createContext, useContext, useState } from "react";

type State = {
  tab: string;
  setTab: (name: string) => void;
};

const TabsContext = createContext({} as State);

type Props = PropsWithChildren<{
  names: string[];
}>;

export function Tabs({ names, children }: Props) {
  const [tab, setTab] = useState(names[0] ?? "");

  return (
    <TabsContext.Provider value={{ tab, setTab }}>
      <div
        role="tablist"
        aria-label="侧边标签栏"
        className="flex items-center px-4"
      >
        {names.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setTab(name)}
            role="tab"
            aria-selected={tab === name}
            aria-controls={"tabpanel-" + name}
            id={"tab-" + name}
            className={clsx(
              "grow font-bold py-2 rounded-t border-b-2 hover:bg-gray-300 transition-colors",
              tab === name
                ? "border-teal-600"
                : "border-gray-300 hover:border-teal-600"
            )}
          >
            {name}
          </button>
        ))}
      </div>
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  return useContext(TabsContext);
}
