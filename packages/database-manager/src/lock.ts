import { Semaphore } from "./semaphore";

/**
 * An SS2PL lock manager of a database table.
 *
 * @see https://en.wikipedia.org/wiki/Two-phase_locking
 */
export class LockManager {
  /**
   * Queues the requests for S/X locks in FIFO order.
   */
  private queueSemaphore = new Semaphore();

  /**
   * Blocks the acquisition of incompatible locks (S-X, X-S, X-X).
   */
  private writerSemaphore = new Semaphore();

  /**
   * Excludes access to `readerCount`.
   */
  private readerCountMutex = new Semaphore();

  /**
   * The number of readers currently reading the table.
   */
  private readerCount = 0;

  /**
   * Acquires an S lock.
   */
  public async acquireSharedLock() {
    await this.queueSemaphore.acquire();
    await this.readerCountMutex.acquire();
    if (this.readerCount === 0) {
      await this.writerSemaphore.acquire();
    }
    this.readerCount++;
    this.readerCountMutex.release();
    this.queueSemaphore.release();
  }

  /**
   * Releases an S lock.
   */
  public async releaseSharedLock() {
    await this.readerCountMutex.acquire();
    this.readerCount--;
    if (this.readerCount === 0) {
      this.writerSemaphore.release();
    }
    this.readerCountMutex.release();
  }

  /**
   * Acquires an X lock.
   */
  public async acquireExclusiveLock() {
    await this.queueSemaphore.acquire();
    await this.writerSemaphore.acquire();
  }

  /**
   * Releases an X lock.
   */
  public async releaseExclusiveLock() {
    this.writerSemaphore.release();
    this.queueSemaphore.release();
  }
}
