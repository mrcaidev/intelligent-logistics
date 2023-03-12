/**
 * A synchronization primitive that allows
 * multiple concurrent operations to proceed,
 * but limits the number of operations
 * that can proceed concurrently.
 */
export class Semaphore {
  /**
   * Queue of pending operations.
   */
  private queue: (() => void)[] = [];

  /**
   * Set concurrency limit.
   */
  constructor(private count = 1) {}

  /**
   * Acquire a vacancy for concurrent operation.
   * If none are available, the process will be queued.
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
   * Release a vacancy. If there are pending operations,
   * the first one will be unblocked.
   */
  public release() {
    this.count++;
    this.queue.shift()?.();
  }
}
