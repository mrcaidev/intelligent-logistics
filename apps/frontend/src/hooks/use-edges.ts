import { useGlobalState } from "contexts/global-state";
import { Edge } from "shared-types";
import useSWR from "swr";

export function useEdges() {
  const { currentGraphId } = useGlobalState();

  const { data: edges, ...rest } = useSWR<Edge[]>(
    currentGraphId ? "/edges?graphId=" + currentGraphId : null
  );

  return { edges, ...rest };
}
