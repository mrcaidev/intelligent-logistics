import { Graph } from "shared-types";
import useSWR from "swr";

export function useGraphs() {
  const { data: graphs, ...rest } = useSWR<Graph[]>("/graphs");
  return { graphs, ...rest };
}
