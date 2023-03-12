/**
 * Errors throwed by runner.
 */
export class RunnerError extends Error {
  /**
   * Initialize the error.
   * @param message Error message.
   */
  constructor(message: string) {
    super(message);
    this.name = "RunnerError";
  }
}
