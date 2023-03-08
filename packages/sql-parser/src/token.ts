export type TokenType =
  | "literal"
  | "keyword"
  | "identifier"
  | "operator"
  | "comment";

export type Token = {
  type: TokenType;
  value: unknown;
};

export const keywords = [
  "SELECT",
  "FROM",
  "WHERE",
  "AND",
  "OR",
  "NOT",
  "IN",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
  "CREATE",
  "TABLE",
  "DROP",
];
