import { Node } from "shared-types";
import useSWR from "swr";

export function useNodes() {
  const { data: nodes, ...rest } = useSWR<Node[]>("/nodes");
  return { nodes, ...rest };
}
