/**
 * Preprocesses input into a list of statements.
 */
export class Preprocessor {
  /**
   * Store the input.
   */
  constructor(private input: string) {}

  /**
   * Split statements by ";", and strip comments and line breaks.
   * @returns A list of SQL statements.
   */
  public process() {
    return this.input
      .split(";")
      .map((statement) =>
        statement
          .replaceAll(/--.*/g, "")
          .replaceAll(/\s*\n\s*/g, " ")
          .trim()
      )
      .filter((statement) => statement.length > 0);
  }
}
