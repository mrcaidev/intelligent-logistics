import { Semaphore } from "./semaphore";

/**
 * The guard of a database table, which solves
 * the readers-writers problem with a fair policy.
 * All readers and writers must ask the guard for permission
 * before they can actually access the table.
 */
export class Guard {
  /**
   * Both reader and writer must queue on this semaphore
   * in an FIFO manner before they can access the table.
   */
  private sharedSemaphore = new Semaphore();

  /**
   * Only one writer can access the table at a time.
   * A writer may only acquire this semaphore if there are no readers,
   * and all readers must wait for the writer to finish.
   */
  private writerSemaphore = new Semaphore();

  /**
   * The mutex for `readerCount`.
   */
  private readerCountMutex = new Semaphore();

  /**
   * The number of readers currently reading the table.
   */
  private readerCount = 0;

  /**
   * Waits for the table to be available for reading.
   */
  public async waitToRead() {
    await this.sharedSemaphore.acquire();
    await this.readerCountMutex.acquire();
    if (this.readerCount === 0) {
      await this.writerSemaphore.acquire();
    }
    this.readerCount++;
    this.readerCountMutex.release();
    this.sharedSemaphore.release();
  }

  /**
   * Finishes reading the table.
   */
  public async finishReading() {
    await this.readerCountMutex.acquire();
    this.readerCount--;
    if (this.readerCount === 0) {
      this.writerSemaphore.release();
    }
    this.readerCountMutex.release();
  }

  /**
   * Waits for the table to be available for writing.
   */
  public async waitToWrite() {
    await this.sharedSemaphore.acquire();
    await this.writerSemaphore.acquire();
  }

  /**
   * Finishes writing the table.
   */
  public async finishWriting() {
    this.writerSemaphore.release();
    this.sharedSemaphore.release();
  }
}
