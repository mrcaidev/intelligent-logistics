import { Graph } from "shared-types";
import useSWR from "swr";

export function useGraphs() {
  const { data, ...rest } = useSWR<Graph[]>("/graphs");
  return { graphs: data, ...rest };
}
