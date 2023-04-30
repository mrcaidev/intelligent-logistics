/**
 * A synchronization primitive that controls access
 * to a common resource shared by multiple processes,
 * in order to avoid critical section problems.
 *
 * @see https://en.wikipedia.org/wiki/Semaphore_(programming)
 */
export class Semaphore {
  /**
   * The queue of pending processes.
   */
  private queue: (() => void)[] = [];

  constructor(
    /**
     * The maximum number of processes that
     * can access the critical resource concurrently.
     */
    private count = 1
  ) {}

  /**
   * The number of vacancies that is currently
   * available for concurrent operation.
   */
  public get availableCount() {
    return Math.max(0, this.count);
  }

  /**
   * The number of processes that is currently
   * blocked and queued on this semaphore.
   */
  public get blockedCount() {
    return Math.max(0, -this.count);
  }

  /**
   * Acquires a vacancy for concurrent operation.
   *
   * If there is none available,
   * the requesting process will be blocked and queued.
   */
  public async acquire() {
    return new Promise<void>((resolve) => {
      this.count--;

      if (this.count >= 0) {
        return resolve();
      }

      this.queue.push(resolve);
    });
  }

  /**
   * Releases an acquired vacancy.
   *
   * If there are pending processes in the queue,
   * the first one will be unblocked and resolved.
   */
  public release() {
    this.count++;

    if (this.count <= 0) {
      this.queue.shift()?.();
    }
  }
}
