export type TokenType =
  | "literal"
  | "keyword"
  | "dataType"
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

export type Assignments = {
  field: string;
  value: unknown;
};

export type Definition = {
  field: string;
  type: string;
};
