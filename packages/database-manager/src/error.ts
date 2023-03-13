/**
 * Error thrown by the database manager.
 */
export class DatabaseManagerError extends Error {
  /**
   * Initialize the error.
   * @param message Error message.
   */
  public constructor(message: string) {
    super(message);
    this.name = "DatabaseManagerError";
  }
}
