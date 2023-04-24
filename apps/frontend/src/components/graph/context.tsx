import { useGraphs } from "hooks/use-graphs";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Edge } from "shared-types";
import useSWR, { SWRResponse } from "swr";

type State = {
  edges: SWRResponse<Edge[]>;
  nodes: string[];
  graphId: string;
  setGraphId: (id: string) => void;
  activeIds: string[];
  setActiveIds: (ids: string[]) => void;
};

const GraphContext = createContext<State>({} as State);

export function GraphProvider({ children }: PropsWithChildren) {
  const { graphs } = useGraphs();
  const [graphId, setGraphId] = useState("");
  const edges = useSWR<Edge[]>(graphId ? "/edges?graphId=" + graphId : null);
  const nodes = collectNodes(edges.data ?? []);
  const [activeIds, setActiveIds] = useState<string[]>([]);

  useEffect(() => {
    if (graphs && graphs[0]) {
      setGraphId(graphs[0].id);
    }
  }, [graphs]);

  return (
    <GraphContext.Provider
      value={{
        edges,
        nodes,
        graphId,
        setGraphId,
        activeIds,
        setActiveIds,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}

export function useGraph() {
  return useContext(GraphContext);
}

function collectNodes(edges: Edge[]) {
  const nodes = new Set<string>();
  for (const { source, target } of edges) {
    nodes.add(source);
    nodes.add(target);
  }
  return Array.from(nodes);
}
