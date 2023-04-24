import { Good } from "shared-types";
import useSWR from "swr";

export function useGoods() {
  const { data, ...rest } = useSWR<Good[]>("/goods");
  return { goods: data, ...rest };
}
