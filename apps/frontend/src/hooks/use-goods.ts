import { Good } from "shared-types";
import useSWR from "swr";

export function useGoods() {
  return useSWR<Good[]>("/goods");
}
