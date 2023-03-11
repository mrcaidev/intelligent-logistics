/**
 * A simplified priority queue implementation.
 * @template T The type of the items in the queue.
 */
export class PriorityQueue<T> {
  /**
   * The queue stucture.
   */
  private queue: T[] = [];

  /**
   * Create a priority queue.
   * @param compareFn A function that compares two items in the queue.
   * It is expected to return a negative value
   * if the first argument is less than the second argument,
   * zero if they're equal, and a positive value otherwise.
   * If omitted, the elements are not sorted.
   */
  constructor(private compareFn?: (a: T, b: T) => number) {}

  /**
   * Push an item to the queue.
   * @param item The item to be added to the queue.
   */
  public push(item: T) {
    this.queue.push(item);

    if (this.compareFn) {
      this.queue.sort(this.compareFn);
    }
  }

  /**
   * Pop an item from the queue.
   * @returns The item with the highest priority.
   */
  public pop() {
    return this.queue.shift();
  }
}
