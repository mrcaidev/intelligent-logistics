export type TokenType =
  | "literal"
  | "keyword"
  | "identifier"
  | "operator"
  | "comment"
  | "separator";

export type Token = {
  type: TokenType;
  value: unknown;
};

export type Condition = {
  field: string;
  operator: string;
  value: unknown;
};
