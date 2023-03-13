/**
 * Error thrown by the SQL parser.
 */
export class SqlParserError extends Error {
  /**
   * The name of the error.
   */
  override name = "SqlParserError";
}
