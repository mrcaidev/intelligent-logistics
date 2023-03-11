import type { Good } from "./good";

/**
 * Priority queue for goods.
 * Goods with higher priority are at the front of the queue,
 * which means they will be delivered first.
 */
export class GoodQueue {
  /**
   * Queue of goods.
   */
  private queue: Good[] = [];

  /**
   * Push a good to the queue.
   * @param good The good to be added.
   */
  public push(good: Good) {
    this.queue.push(good);
    this.queue.sort(GoodQueue.compare);
  }

  /**
   * Pop a good from the queue.
   * @returns The good with the highest priority.
   */
  public pop() {
    return this.queue.shift();
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
