export enum TokenType {
  // Keywords.
  SELECT,
  FROM,
  WHERE,
  AND,
  OR,
  NOT,
  INSERT,
  INTO,
  VALUES,
  UPDATE,
  SET,
  DELETE,
  CREATE,
  TABLE,
  IF,
  EXISTS,
  DROP,
  RETURNING,
  NUMERIC,
  TEXT,
  BOOLEAN,

  // Operators.
  EQUAL,
  NOT_EQUAL,
  GREATER_THAN,
  GREATER_THAN_OR_EQUAL,
  LESS_THAN,
  LESS_THAN_OR_EQUAL,
  ADD,
  SUBTRACT,
  MULTIPLY,
  DIVIDE,

  // Boundaries.
  LEFT_PARENTHESIS,
  RIGHT_PARENTHESIS,
  COMMA,
  DOT,

  // Identifier.
  IDENTIFIER,

  // Literal.
  LITERAL,
}

/**
 * The "word" of SQL statements.
 *
 * - For identifiers, the value is its name.
 * - For literals, the value is its value.
 * - For any other token, the value is its string representation.
 */
export type Token = { type: TokenType; value: unknown };
