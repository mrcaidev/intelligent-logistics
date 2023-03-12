import { Preprocessor } from "src/preprocessor";
import { describe, expect, it } from "vitest";

describe("statement preprocessing", () => {
  it("splits statements", () => {
    const statements = new Preprocessor(
      "SELECT * FROM table1; SELECT * FROM table2"
    ).process();
    expect(statements).toEqual([
      "SELECT * FROM table1",
      "SELECT * FROM table2",
    ]);
  });

  it("splits when there is a semicolon at the end", () => {
    const statements = new Preprocessor(
      "SELECT * FROM table1; SELECT * FROM table2;"
    ).process();
    expect(statements).toEqual([
      "SELECT * FROM table1",
      "SELECT * FROM table2",
    ]);
  });

  it("ignores empty statements", () => {
    const statements = new Preprocessor(
      "  ; ; SELECT * FROM table1; ; SELECT * FROM table2;;;"
    ).process();
    expect(statements).toEqual([
      "SELECT * FROM table1",
      "SELECT * FROM table2",
    ]);
  });

  it("strips comments", () => {
    const statements = new Preprocessor(
      "SELECT * FROM table1 -- SELECT * FROM table2"
    ).process();
    expect(statements).toEqual(["SELECT * FROM table1"]);
  });

  it("strips line breaks", () => {
    const statements = new Preprocessor("SELECT *\nFROM table").process();
    expect(statements).toEqual(["SELECT * FROM table"]);
  });

  it("strips comments and line breaks", () => {
    const statements = new Preprocessor(
      "SELECT * -- comments \n FROM table1"
    ).process();
    expect(statements).toEqual(["SELECT * FROM table1"]);
  });
});
