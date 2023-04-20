export enum TokenType {
  // Keywords.
  SELECT = "SELECT",
  FROM = "FROM",
  WHERE = "WHERE",
  AND = "AND",
  OR = "OR",
  NOT = "NOT",
  INSERT = "INSERT",
  INTO = "INTO",
  VALUES = "VALUES",
  UPDATE = "UPDATE",
  SET = "SET",
  DELETE = "DELETE",
  CREATE = "CREATE",
  TABLE = "TABLE",
  IF = "IF",
  EXISTS = "EXISTS",
  DROP = "DROP",
  NUMERIC = "NUMERIC",
  TEXT = "TEXT",
  BOOLEAN = "BOOLEAN",

  // Operators.
  EQUAL = "=",
  NOT_EQUAL = "!=",
  GREATER_THAN = ">",
  GREATER_THAN_OR_EQUAL = ">=",
  LESS_THAN = "<",
  LESS_THAN_OR_EQUAL = "<=",
  ADD = "+",
  SUBTRACT = "-",
  MULTIPLY = "*",
  DIVIDE = "/",

  // Boundaries.
  LEFT_PARENTHESIS = "(",
  RIGHT_PARENTHESIS = ")",
  COMMA = ",",
  DOT = ".",

  // Identifier.
  IDENTIFIER = "identifier",

  // Literal.
  LITERAL = "literal",
}

/**
 * The "word" of SQL statements.
 *
 * - For identifiers, the value is the identifier name.
 * - For literals, the value is the literal value.
 * - For any other token, the value is undefined.
 */
export type Token = { type: TokenType; value?: unknown };
