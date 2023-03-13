/**
 * Splits an input into a list of statements.
 * Comments, line breaks and empty statements are stripped.
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
