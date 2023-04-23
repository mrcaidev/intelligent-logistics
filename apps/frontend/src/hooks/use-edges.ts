import { Edge } from "common";
import useSwr from "swr";

export function useEdges(graphId?: string) {
  return useSwr<Edge[]>(() => "/edges?graphId=" + graphId);
}
