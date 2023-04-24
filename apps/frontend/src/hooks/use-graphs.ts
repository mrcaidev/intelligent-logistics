import { useGlobalState } from "contexts/global-state";
import { useEffect } from "react";
import { Graph } from "shared-types";
import useSWR from "swr";

export function useGraphs() {
  const { setCurrentGraphId } = useGlobalState();

  const { data: graphs, ...rest } = useSWR<Graph[]>("/graphs");

  useEffect(() => {
    setCurrentGraphId(graphs?.at(0)?.id ?? "");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(graphs)]);

  return { graphs, ...rest };
}
