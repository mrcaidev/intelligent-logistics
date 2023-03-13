import { preprocess } from "src/preprocess";
import { expect, it } from "vitest";

it("splits statements", () => {
  const statements = preprocess("SELECT * FROM table1; SELECT * FROM table2");
  expect(statements).toEqual(["SELECT * FROM table1", "SELECT * FROM table2"]);
});

it("splits with a semicolon at the end", () => {
  const statements = preprocess("SELECT * FROM table1; SELECT * FROM table2;");
  expect(statements).toEqual(["SELECT * FROM table1", "SELECT * FROM table2"]);
});

it("strips comments", () => {
  const statements = preprocess("SELECT * FROM table1 -- SELECT * FROM table2");
  expect(statements).toEqual(["SELECT * FROM table1"]);
});

it("strips line breaks", () => {
  const statements = preprocess("SELECT * \n FROM table");
  expect(statements).toEqual(["SELECT * FROM table"]);
});

it("strips empty statements", () => {
  const statements = preprocess(
    "  ; ; SELECT * FROM table1; ; SELECT * FROM table2;; ;"
  );
  expect(statements).toEqual(["SELECT * FROM table1", "SELECT * FROM table2"]);
});
