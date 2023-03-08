export type Token = {
  type:
    | "literal"
    | "keyword"
    | "identifier"
    | "operator"
    | "comment"
    | "separator";
  value: unknown;
};

export type Condition = {
  field: string;
  operator: string;
  value: unknown;
};
