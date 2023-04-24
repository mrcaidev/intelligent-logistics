import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type State = {
  currentGraphId: string;
  setCurrentGraphId: Dispatch<SetStateAction<string>>;
  activeIds: string[];
  setActiveIds: Dispatch<SetStateAction<string[]>>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

const GlobalStateContext = createContext({} as State);

export function GlobalStateProvider({ children }: PropsWithChildren) {
  const [currentGraphId, setCurrentGraphId] = useState("");
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const isWideScreen = window.matchMedia("(min-width: 768px)").matches;
    setIsSidebarOpen(isWideScreen);
  }, []);

  return (
    <GlobalStateContext.Provider
      value={{
        currentGraphId,
        setCurrentGraphId,
        activeIds,
        setActiveIds,
        isSidebarOpen,
        setIsSidebarOpen,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
