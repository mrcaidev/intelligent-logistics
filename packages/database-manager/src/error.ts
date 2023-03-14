/**
 * Error thrown by the database manager.
 */
export class DatabaseManagerError extends Error {
  /**
   * The name of the error.
   */
  override name = "DatabaseManagerError";
}
