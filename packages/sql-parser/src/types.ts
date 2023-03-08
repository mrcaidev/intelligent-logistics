export type Token =
  | {
      type: "literal";
      value: unknown;
    }
  | {
      type: "keyword" | "identifier" | "operator" | "comment";
      value: string;
    };

export type Condition = {
  field: string;
  operator: string;
  value: unknown;
};
