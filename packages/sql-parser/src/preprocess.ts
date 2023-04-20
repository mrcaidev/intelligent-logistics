/**
 * Splits a string into a list of SQL statements.
 *
 * Comments, line breaks and empty statements are stripped.
 *
 * @param input A string containing one or more SQL statements.
 */
export function preprocess(input: string) {
  return input
    .split(";")
    .map((statement) =>
      statement
        .replaceAll(/--.*/g, "")
        .replaceAll(/\s*\n\s*/g, " ")
        .trim()
    )
    .filter((statement) => statement.length > 0);
}
