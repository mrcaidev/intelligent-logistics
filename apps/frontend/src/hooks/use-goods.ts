import { Good } from "common";
import useSwr from "swr";

export function useGoods() {
  return useSwr<Good[]>("/goods");
}
