/**
 * A synchronization primitive that allows
 * multiple concurrent operations to proceed,
 * but limits the number of operations
 * that can proceed concurrently.
 */
export class Semaphore {
  /**
   * The queue of pending operations.
   */
  private queue: (() => void)[] = [];

  constructor(private count = 1) {}

  /**
   * Acquires a vacancy for concurrent operation.
   * If none are available, the process will be blocked and queued.
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
   * Releases a vacancy. If there are pending operations,
   * the first one will be unqueued, unblocked and resolved.
   */
  public release() {
    this.count++;
    this.queue.shift()?.();
  }
}
