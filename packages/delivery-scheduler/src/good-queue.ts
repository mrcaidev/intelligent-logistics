import type { Good } from "./good";
import { PriorityQueue } from "./priority-queue";

/**
 * Priority queue for goods.
 * Goods with smaller priority timestamp will be delivered first.
 */
export class GoodQueue extends PriorityQueue<Good> {
  /**
   * Create a good queue.
   */
  constructor() {
    super((a, b) => a.getPriorityTimestamp() - b.getPriorityTimestamp());
  }
}
