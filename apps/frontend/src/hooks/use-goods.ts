import { Good } from "shared-types";
import useSwr from "swr";

export function useGoods() {
  return useSwr<Good[]>("/goods");
}
