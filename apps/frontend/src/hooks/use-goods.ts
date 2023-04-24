import { useGlobalState } from "contexts/global-state";
import { Good } from "shared-types";
import useSWR from "swr";

export function useGoods() {
  const { currentGraphId } = useGlobalState();

  const { data: goods, ...rest } = useSWR<Good[]>(
    currentGraphId ? "/goods?graphId=" + currentGraphId : null
  );

  return { goods, ...rest };
}
