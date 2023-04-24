import { useGlobalState } from "contexts/global-state";
import { Edge } from "shared-types";
import useSWR from "swr";

export function useEdges() {
  const { currentGraphId } = useGlobalState();

  const { data: edges, ...rest } = useSWR<Edge[]>(
    currentGraphId ? "/edges?graphId=" + currentGraphId : null
  );
  const nodes = collectNodes(edges ?? []);

  return { edges, nodes, ...rest };
}

function collectNodes(edges: Edge[]) {
  const nodes = new Set<string>();
  for (const { source, target } of edges) {
    nodes.add(source);
    nodes.add(target);
  }
  return Array.from(nodes);
}
