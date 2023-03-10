/**
 * Errors throwed by parser.
 */
export class ParserError extends Error {
  /**
   * Initialize the error.
   * @param message Error message.
   */
  constructor(message: string) {
    super(message);
    this.name = "ParserError";
  }
}
