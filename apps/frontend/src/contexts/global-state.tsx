import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

type State = {
  currentGraphId: string;
  activeIds: string[];
  isSidebarOpen: boolean;
};

const defaultState = {
  currentGraphId: "",
  activeIds: [],
  isSidebarOpen: false,
};

type Action =
  | { type: "SET_CURRENT_GRAPH_ID"; payload: string }
  | { type: "SET_ACTIVE_IDS"; payload: string[] }
  | { type: "OPEN_SIDEBAR" }
  | { type: "CLOSE_SIDEBAR" }
  | { type: "TOGGLE_SIDEBAR" };

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "SET_CURRENT_GRAPH_ID":
      return { ...state, currentGraphId: action.payload };
    case "SET_ACTIVE_IDS":
      return { ...state, activeIds: action.payload };
    case "OPEN_SIDEBAR":
      return { ...state, isSidebarOpen: true };
    case "CLOSE_SIDEBAR":
      return { ...state, isSidebarOpen: false };
    case "TOGGLE_SIDEBAR":
      return { ...state, isSidebarOpen: !state.isSidebarOpen };
    default:
      return state;
  }
}

const GlobalStateContext = createContext(
  {} as State & { dispatch: Dispatch<Action> }
);

export function GlobalStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, defaultState);

  useEffect(() => {
    if (matchMedia("(min-width: 768px)").matches) {
      dispatch({ type: "OPEN_SIDEBAR" });
    }
  }, []);

  return (
    <GlobalStateContext.Provider value={{ ...state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  return useContext(GlobalStateContext);
}
