/**
 * Type of token.
 */
export enum TokenType {
  LITERAL = "literal",
  KEYWORD = "keyword",
  DATA_TYPE = "data type",
  OPERATOR = "operator",
  IDENTIFIER = "identifier",
  SYMBOL = "symbol",
}

/**
 * Lexer divides a SQL statement into a list of tokens,
 * each of which is a smallest meaningful component and operating unit,
 * similar to the concept of "word" in spoken languages.
 */
export type Token = {
  type: TokenType;
  value: unknown;
};
