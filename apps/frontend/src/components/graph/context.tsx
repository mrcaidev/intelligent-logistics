import { Edge } from "common";
import { useGraphs } from "hooks/use-graphs";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import useSwr, { SWRResponse } from "swr";

type State = {
  graphId: string;
  setGraphId: (id: string) => void;
  edges: SWRResponse<Edge[]>;
  nodes: string[];
};

const GraphContext = createContext<State>({} as State);

export function GraphProvider({ children }: PropsWithChildren) {
  const { data: graphs } = useGraphs();
  const [graphId, setGraphId] = useState("");
  const edges = useSwr<Edge[]>(() => "/edges?graphId=" + graphId);
  const nodes = collectNodes(edges.data ?? []);

  useEffect(() => {
    if (graphs && graphs[0]) {
      setGraphId(graphs[0].id);
    }
  }, [graphs]);

  return (
    <GraphContext.Provider value={{ graphId, setGraphId, edges, nodes }}>
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
