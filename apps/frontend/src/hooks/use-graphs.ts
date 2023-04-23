import { Graph } from "shared-types";
import useSWR from "swr";

export function useGraphs() {
  return useSWR<Graph[]>("/graphs");
}
