import { Preprocessor } from "src/preprocessor";
import { describe, expect, it } from "vitest";

describe("statement preprocessing", () => {
  it("splits statements", () => {
    const statements = new Preprocessor(
      "SELECT * FROM table1; SELECT * FROM table2"
    ).preprocess();
    expect(statements).toEqual([
      "SELECT * FROM table1",
      "SELECT * FROM table2",
    ]);
  });

  it("splits when there is a semicolon at the end", () => {
    const statements = new Preprocessor(
      "SELECT * FROM table1; SELECT * FROM table2;"
    ).preprocess();
    expect(statements).toEqual([
      "SELECT * FROM table1",
      "SELECT * FROM table2",
    ]);
  });

  it("ignores emtpy statements", () => {
    const statements = new Preprocessor(
      "  ; ; SELECT * FROM table1; ; SELECT * FROM table2;;;"
    ).preprocess();
    expect(statements).toEqual([
      "SELECT * FROM table1",
      "SELECT * FROM table2",
    ]);
  });
});
