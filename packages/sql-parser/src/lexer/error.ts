/**
 * Errors throwed by lexer.
 */
export class LexerError extends Error {
  /**
   * Initialize the error.
   * @param message Error message.
   */
  constructor(message: string) {
    super(message);
    this.name = "LexerError";
  }
}
