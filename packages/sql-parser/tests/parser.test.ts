import { SqlParserError } from "src";
import { Lexer } from "src/lexer";
import { Parser } from "src/parser";
import { describe, expect, it } from "vitest";

function parse(statement: string) {
  const tokens = new Lexer(statement).tokenize();
  const ast = new Parser(tokens).parse();
  return ast;
}

describe("invalid keyword", () => {
  it("throws error with no keyword", () => {
    const result = () => parse("id FROM users");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with invalid keyword", () => {
    const result = () => parse("UNKNOWN id FROM users");
    expect(result).toThrowError(SqlParserError);
  });
});

describe("SELECT statement", () => {
  it("parses simple SELECT", () => {
    const result = parse("SELECT * FROM users");
    expect(result).toEqual({
      type: "select",
      table: "users",
      fields: "*",
      conditions: [],
    });
  });

  it("parses SELECT with column names", () => {
    const result = parse("SELECT id, name, age FROM users");
    expect(result).toEqual({
      type: "select",
      table: "users",
      fields: ["id", "name", "age"],
      conditions: [],
    });
  });

  it("parses SELECT with one condition", () => {
    const result = parse("SELECT * FROM users WHERE id = 1");
    expect(result).toEqual({
      type: "select",
      table: "users",
      fields: "*",
      conditions: [[{ field: "id", operator: "=", value: 1 }]],
    });
  });

  it("parses SELECT with AND condition", () => {
    const result = parse(
      "SELECT * FROM users WHERE name = 'John' AND age <= 30"
    );
    expect(result).toEqual({
      type: "select",
      table: "users",
      fields: "*",
      conditions: [
        [
          { field: "name", operator: "=", value: "John" },
          { field: "age", operator: "<=", value: 30 },
        ],
      ],
    });
  });

  it("parses SELECT with OR condition", () => {
    const result = parse(
      "SELECT * FROM users WHERE name = 'John' OR age <= 30"
    );
    expect(result).toEqual({
      type: "select",
      table: "users",
      fields: "*",
      conditions: [
        [{ field: "name", operator: "=", value: "John" }],
        [{ field: "age", operator: "<=", value: 30 }],
      ],
    });
  });

  it("parses SELECT with AND and OR condition", () => {
    const result = parse(
      "SELECT * FROM users WHERE id = 1 AND name = 'John' OR age <= 30"
    );
    expect(result).toEqual({
      type: "select",
      table: "users",
      fields: "*",
      conditions: [
        [
          { field: "id", operator: "=", value: 1 },
          { field: "name", operator: "=", value: "John" },
        ],
        [{ field: "age", operator: "<=", value: 30 }],
      ],
    });
  });

  it("throws error when missing fields", () => {
    const result = () => parse("SELECT FROM users");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when fields are not separated by comma", () => {
    const result = () => parse("SELECT id name FROM users");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing FROM", () => {
    const result = () => parse("SELECT * users");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing table name", () => {
    const result = () => parse("SELECT * FROM");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when no condition follows WHERE", () => {
    const result = () => parse("SELECT * FROM users WHERE");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incomplete condition", () => {
    const result = () => parse("SELECT * FROM users WHERE id =");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incorrect condition", () => {
    const result = () => parse("SELECT * FROM users WHERE id = SELECT");
    expect(result).toThrowError(SqlParserError);
  });
});

describe("INSERT statement", () => {
  it("parses simple INSERT", () => {
    const result = parse("INSERT INTO users VALUES (1, 'John')");
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: "*",
      values: [1, "John"],
    });
  });

  it("parses INSERT with column names", () => {
    const result = parse("INSERT INTO users (id, name) VALUES (1, 'John')");
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: ["id", "name"],
      values: [1, "John"],
    });
  });

  it("throws error when missing INTO", () => {
    const result = () => parse("INSERT users VALUES (1, 'John')");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing table name", () => {
    const result = () => parse("INSERT INTO VALUES (1, 'John')");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing VALUES", () => {
    const result = () => parse("INSERT INTO users (1, 'John')");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing values", () => {
    const result = () => parse("INSERT INTO users VALUES");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with empty fields", () => {
    const result = () => parse("INSERT INTO users () VALUES (1, 'John')");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with empty values", () => {
    const result = () => parse("INSERT INTO users VALUES ()");
    expect(result).toThrowError(SqlParserError);
  });
});

describe("UPDATE statement", () => {
  it("parses simple UPDATE", () => {
    const result = parse("UPDATE users SET name = 'John'");
    expect(result).toEqual({
      type: "update",
      table: "users",
      assignments: [{ field: "name", value: "John" }],
      conditions: [],
    });
  });

  it("parses UPDATE with more than one column", () => {
    const result = parse("UPDATE users SET name = 'John', age = 30");
    expect(result).toEqual({
      type: "update",
      table: "users",
      assignments: [
        { field: "name", value: "John" },
        { field: "age", value: 30 },
      ],
      conditions: [],
    });
  });

  it("parses UPDATE with conditions", () => {
    const result = parse(
      "UPDATE users SET name = 'John' WHERE id = 1 AND age = 30"
    );
    expect(result).toEqual({
      type: "update",
      table: "users",
      assignments: [{ field: "name", value: "John" }],
      conditions: [
        [
          { field: "id", operator: "=", value: 1 },
          { field: "age", operator: "=", value: 30 },
        ],
      ],
    });
  });

  it("throws error when missing table name", () => {
    const result = () => parse("UPDATE SET name = 'John'");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing SET", () => {
    const result = () => parse("UPDATE users name = 'John'");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing fields", () => {
    const result = () => parse("UPDATE users SET");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incomplete assignments", () => {
    const result = () => parse("UPDATE users SET name =");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incorrect assignments", () => {
    const result = () => parse("UPDATE users SET name = SELECT");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when assignments are not separated by comma", () => {
    const result = () => parse("UPDATE users SET name = 'John' age = 30");
    expect(result).toThrowError(SqlParserError);
  });
});

describe("DELETE statement", () => {
  it("parses simple DELETE", () => {
    const result = parse("DELETE FROM users");
    expect(result).toEqual({
      type: "delete",
      table: "users",
      conditions: [],
    });
  });

  it("parses DELETE with conditions", () => {
    const result = parse("DELETE FROM users WHERE id = 1");
    expect(result).toEqual({
      type: "delete",
      table: "users",
      conditions: [[{ field: "id", operator: "=", value: 1 }]],
    });
  });

  it("throws error when missing FROM", () => {
    const result = () => parse("DELETE users");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing table name", () => {
    const result = () => parse("DELETE FROM");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when no condition follows WHERE", () => {
    const result = () => parse("DELETE FROM users WHERE");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incomplete condition", () => {
    const result = () => parse("DELETE FROM users WHERE id =");
    expect(result).toThrowError(SqlParserError);
  });
});

describe("CREATE statement", () => {
  it("parses simple CREATE", () => {
    const result = parse("CREATE TABLE users (id NUMERIC, name TEXT)");
    expect(result).toEqual({
      type: "create",
      table: "users",
      definitions: [
        { field: "id", type: "NUMERIC" },
        { field: "name", type: "TEXT" },
      ],
    });
  });

  it("throws error when missing TABLE", () => {
    const result = () => parse("CREATE users (id NUMERIC, name TEXT)");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing table name", () => {
    const result = () => parse("CREATE TABLE (id NUMERIC, name TEXT)");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing fields", () => {
    const result = () => parse("CREATE TABLE users");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing field name", () => {
    const result = () => parse("CREATE TABLE users (NUMERIC, name TEXT)");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing field type", () => {
    const result = () => parse("CREATE TABLE users (id, name TEXT)");
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when fields are not separated by comma", () => {
    const result = () => parse("CREATE TABLE users (id NUMERIC name TEXT)");
    expect(result).toThrowError(SqlParserError);
  });
});
