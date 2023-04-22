import { Graph } from "common";
import useSwr from "swr";

export function useGraphs() {
  return useSwr<Graph[]>("/graphs");
}
