import { PropsWithChildren, createContext, useContext, useState } from "react";

type State = {
  currentGraphId: string;
  setCurrentGraphId: (id: string) => void;
  activeIds: string[];
  setActiveIds: (ids: string[]) => void;
};

const GlobalStateContext = createContext({} as State);

export function GlobalStateProvider({ children }: PropsWithChildren) {
  const [currentGraphId, setCurrentGraphId] = useState("");
  const [activeIds, setActiveIds] = useState<string[]>([]);

  return (
    <GlobalStateContext.Provider
      value={{
        currentGraphId,
        setCurrentGraphId,
        activeIds,
        setActiveIds,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
