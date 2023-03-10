/**
 * Preprocess input into a list of statements.
 */
export class Preprocessor {
  /**
   * Store the input.
   */
  constructor(private input: string) {}

  /**
   * Breaks down the input by ";", and discard empty statements.
   * @returns A list of SQL statements.
   */
  public preprocess() {
    return this.input
      .split(";")
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 0);
  }
}
