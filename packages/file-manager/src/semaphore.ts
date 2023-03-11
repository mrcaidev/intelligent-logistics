/**
 * A synchronization primitive that allows
 * multiple concurrent operations to proceed,
 * but limits the number of operations
 * that can proceed concurrently.
 */
export class Semaphore {
  /**
   * Current number of vacancies for concurrent operations.
   */
  private count: number;

  /**
   * Queue of pending operations.
   */
  private queue: (() => void)[] = [];

  /**
   * Specify the maximum number of concurrent operations.
   */
  constructor(initialCount = 1) {
    this.count = initialCount;
  }

  /**
   * Acquire a vacancy for a concurrent operation.
   */
  public async acquire() {
    return new Promise<void>((resolve) => {
      if (this.count <= 0) {
        this.queue.push(resolve);
        return;
      }

      this.count--;
      resolve();
    });
  }

  /**
   * Release a vacancy in favor of pending operations.
   */
  public release() {
    this.count++;
    this.queue.shift()?.();
  }
}
