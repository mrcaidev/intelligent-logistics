import { Graph } from "shared-types";
import useSwr from "swr";

export function useGraphs() {
  return useSwr<Graph[]>("/graphs");
}
