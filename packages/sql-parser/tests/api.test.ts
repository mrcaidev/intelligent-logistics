import { parse } from "src";
import { expect, it } from "vitest";

it("parses an input into a list of ASTs", () => {
  const result = parse("SELECT * FROM users; SELECT * FROM posts;");
  expect(result).toEqual([
    {
      type: "select",
      table: "users",
      fields: "*",
      conditions: [],
    },
    {
      type: "select",
      table: "posts",
      fields: "*",
      conditions: [],
    },
  ]);
});
