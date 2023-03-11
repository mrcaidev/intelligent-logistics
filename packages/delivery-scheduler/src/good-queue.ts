import type { Good } from "./good";
import { PriorityQueue } from "./priority-queue";

/**
 * Priority queue for goods.
 * Goods with higher priority are at the front of the queue,
 * which means they will be delivered first.
 */
export class GoodQueue extends PriorityQueue<Good> {
  /**
   * Create a good queue.
   */
  constructor() {
    super(GoodQueue.compare);
  }

  /**
   * Compare two goods by their arrival time.
   * VIP goods will be considered as arriving one day earlier
   * to make sure they have a higher priority.
   */
  private static compare(goodA: Good, goodB: Good) {
    const oneDay = 24 * 60 * 60 * 1000;
    const timeA = goodA.createdAt.getTime() - (goodA.isVip ? oneDay : 0);
    const timeB = goodB.createdAt.getTime() - (goodB.isVip ? oneDay : 0);
    return timeA - timeB;
  }
}
