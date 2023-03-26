import { SqlParserError } from "src";
import { TokenType } from "src/lexer";
import { Parser } from "src/parser";
import { describe, expect, it } from "vitest";

describe("invalid keyword", () => {
  it("throws error with no keyword", () => {
    const result = () =>
      new Parser([
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.KEYWORD, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with invalid keyword", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "FOO" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.KEYWORD, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("SELECT statement", () => {
  it("parses wildcard fields", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "SELECT" },
      { type: TokenType.OPERATOR, value: "*" },
      { type: TokenType.KEYWORD, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
    ]).parse();
    expect(result).toEqual({
      type: "select",
      table: "users",
      fields: "*",
      conditions: [],
    });
  });

  it("parses specified fields", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "SELECT" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.OPERATOR, value: "," },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.OPERATOR, value: "," },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.KEYWORD, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
    ]).parse();
    expect(result).toEqual({
      type: "select",
      table: "users",
      fields: ["id", "name", "age"],
      conditions: [],
    });
  });

  it("parses single condition", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "SELECT" },
      { type: TokenType.OPERATOR, value: "*" },
      { type: TokenType.KEYWORD, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.KEYWORD, value: "WHERE" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.OPERATOR, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
    ]).parse();
    expect(result).toEqual({
      type: "select",
      table: "users",
      fields: "*",
      conditions: [[{ field: "id", operator: "=", value: 1 }]],
    });
  });

  it("parses conditions joined by AND", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "SELECT" },
      { type: TokenType.OPERATOR, value: "*" },
      { type: TokenType.KEYWORD, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.KEYWORD, value: "WHERE" },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.OPERATOR, value: "=" },
      { type: TokenType.LITERAL, value: "John" },
      { type: TokenType.KEYWORD, value: "AND" },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.OPERATOR, value: "<=" },
      { type: TokenType.LITERAL, value: 30 },
    ]).parse();
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

  it("parses conditions joined by OR", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "SELECT" },
      { type: TokenType.OPERATOR, value: "*" },
      { type: TokenType.KEYWORD, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.KEYWORD, value: "WHERE" },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.OPERATOR, value: "=" },
      { type: TokenType.LITERAL, value: "John" },
      { type: TokenType.KEYWORD, value: "OR" },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.OPERATOR, value: "<=" },
      { type: TokenType.LITERAL, value: 30 },
    ]).parse();
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

  it("parses conditions joined by AND and OR", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "SELECT" },
      { type: TokenType.OPERATOR, value: "*" },
      { type: TokenType.KEYWORD, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.KEYWORD, value: "WHERE" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.OPERATOR, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.KEYWORD, value: "AND" },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.OPERATOR, value: "=" },
      { type: TokenType.LITERAL, value: "John" },
      { type: TokenType.KEYWORD, value: "OR" },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.OPERATOR, value: "<=" },
      { type: TokenType.LITERAL, value: 30 },
    ]).parse();
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
    const result = () =>
      new Parser([{ type: TokenType.KEYWORD, value: "SELECT" }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when fields are not separated by commas", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "SELECT" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.IDENTIFIER, value: "name" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing FROM", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "SELECT" },
        { type: TokenType.IDENTIFIER, value: "id" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing table name", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "SELECT" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.KEYWORD, value: "FROM" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when no condition follows WHERE", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "SELECT" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.KEYWORD, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "WHERE" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incomplete condition", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "SELECT" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.KEYWORD, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "WHERE" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.OPERATOR, value: "=" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incorrect condition", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "SELECT" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.KEYWORD, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "WHERE" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.OPERATOR, value: "=" },
        { type: TokenType.KEYWORD, value: "SELECT" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("INSERT statement", () => {
  it("parses wildcard fields", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "INSERT" },
      { type: TokenType.KEYWORD, value: "INTO" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.KEYWORD, value: "VALUES" },
      { type: TokenType.BOUNDARY, value: "(" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.BOUNDARY, value: ")" },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: "*",
      values: [1],
    });
  });

  it("parses INSERT with column names", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "INSERT" },
      { type: TokenType.KEYWORD, value: "INTO" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.BOUNDARY, value: "(" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.BOUNDARY, value: ")" },
      { type: TokenType.KEYWORD, value: "VALUES" },
      { type: TokenType.BOUNDARY, value: "(" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.BOUNDARY, value: ")" },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: ["id"],
      values: [1],
    });
  });

  it("throws error when missing INTO", () => {
    const result = () =>
      new Parser([{ type: TokenType.KEYWORD, value: "INSERT" }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing table name", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "INSERT" },
        { type: TokenType.KEYWORD, value: "INTO" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing VALUES", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "INSERT" },
        { type: TokenType.KEYWORD, value: "INTO" },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing values", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "INSERT" },
        { type: TokenType.KEYWORD, value: "INTO" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "VALUES" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with empty fields", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "INSERT" },
        { type: TokenType.KEYWORD, value: "INTO" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.BOUNDARY, value: "(" },
        { type: TokenType.BOUNDARY, value: ")" },
        { type: TokenType.KEYWORD, value: "VALUES" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with empty values", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "INSERT" },
        { type: TokenType.KEYWORD, value: "INTO" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "VALUES" },
        { type: TokenType.BOUNDARY, value: "(" },
        { type: TokenType.BOUNDARY, value: ")" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("UPDATE statement", () => {
  it("parses single assignment", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "UPDATE" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.KEYWORD, value: "SET" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.OPERATOR, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
    ]).parse();
    expect(result).toEqual({
      type: "update",
      table: "users",
      assignments: [{ field: "id", value: 1 }],
      conditions: [],
    });
  });

  it("parses multiple assignments", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "UPDATE" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.KEYWORD, value: "SET" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.OPERATOR, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.BOUNDARY, value: "," },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.OPERATOR, value: "=" },
      { type: TokenType.LITERAL, value: 30 },
    ]).parse();
    expect(result).toEqual({
      type: "update",
      table: "users",
      assignments: [
        { field: "id", value: 1 },
        { field: "age", value: 30 },
      ],
      conditions: [],
    });
  });

  it("parses condition", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "UPDATE" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.KEYWORD, value: "SET" },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.OPERATOR, value: "=" },
      { type: TokenType.LITERAL, value: 30 },
      { type: TokenType.KEYWORD, value: "WHERE" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.OPERATOR, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
    ]).parse();
    expect(result).toEqual({
      type: "update",
      table: "users",
      assignments: [{ field: "age", value: 30 }],
      conditions: [[{ field: "id", operator: "=", value: 1 }]],
    });
  });

  it("throws error when missing table name", () => {
    const result = () =>
      new Parser([{ type: TokenType.KEYWORD, value: "UPDATE" }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing SET", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "UPDATE" },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing assignments", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "UPDATE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "SET" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incomplete assignments", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "UPDATE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "SET" },
        { type: TokenType.IDENTIFIER, value: "id" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error without =", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "UPDATE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "SET" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.LITERAL, value: 1 },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incorrect assignments", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "UPDATE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "SET" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.OPERATOR, value: "=" },
        { type: TokenType.KEYWORD, value: "SELECT" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when assignments are not separated by commas", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "UPDATE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "SET" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.OPERATOR, value: "=" },
        { type: TokenType.LITERAL, value: 1 },
        { type: TokenType.IDENTIFIER, value: "age" },
        { type: TokenType.OPERATOR, value: "=" },
        { type: TokenType.LITERAL, value: 30 },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("DELETE statement", () => {
  it("parses without conditions", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "DELETE" },
      { type: TokenType.KEYWORD, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
    ]).parse();
    expect(result).toEqual({
      type: "delete",
      table: "users",
      conditions: [],
    });
  });

  it("parses with conditions", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "DELETE" },
      { type: TokenType.KEYWORD, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.KEYWORD, value: "WHERE" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.OPERATOR, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
    ]).parse();
    expect(result).toEqual({
      type: "delete",
      table: "users",
      conditions: [[{ field: "id", operator: "=", value: 1 }]],
    });
  });

  it("throws error when missing FROM", () => {
    const result = () =>
      new Parser([{ type: TokenType.KEYWORD, value: "DELETE" }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing table name", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "DELETE" },
        { type: TokenType.KEYWORD, value: "FROM" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when no condition follows WHERE", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "DELETE" },
        { type: TokenType.KEYWORD, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "WHERE" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incomplete condition", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "DELETE" },
        { type: TokenType.KEYWORD, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "WHERE" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.OPERATOR, value: "=" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incorrect condition", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "DELETE" },
        { type: TokenType.KEYWORD, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.KEYWORD, value: "WHERE" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.OPERATOR, value: "=" },
        { type: TokenType.KEYWORD, value: "SELECT" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("CREATE statement", () => {
  it("parses single definition", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "CREATE" },
      { type: TokenType.KEYWORD, value: "TABLE" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.BOUNDARY, value: "(" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.DATA_TYPE, value: "NUMERIC" },
      { type: TokenType.BOUNDARY, value: ")" },
    ]).parse();
    expect(result).toEqual({
      type: "create",
      table: "users",
      ifNotExists: false,
      definitions: [{ field: "id", type: "NUMERIC" }],
    });
  });

  it("parses multiple definitions", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "CREATE" },
      { type: TokenType.KEYWORD, value: "TABLE" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.BOUNDARY, value: "(" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.DATA_TYPE, value: "NUMERIC" },
      { type: TokenType.BOUNDARY, value: "," },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.DATA_TYPE, value: "TEXT" },
      { type: TokenType.BOUNDARY, value: ")" },
    ]).parse();
    expect(result).toEqual({
      type: "create",
      table: "users",
      ifNotExists: false,
      definitions: [
        { field: "id", type: "NUMERIC" },
        { field: "name", type: "TEXT" },
      ],
    });
  });

  it("parses IF NOT EXISTS", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "CREATE" },
      { type: TokenType.KEYWORD, value: "TABLE" },
      { type: TokenType.KEYWORD, value: "IF" },
      { type: TokenType.KEYWORD, value: "NOT" },
      { type: TokenType.KEYWORD, value: "EXISTS" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.BOUNDARY, value: "(" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.DATA_TYPE, value: "NUMERIC" },
      { type: TokenType.BOUNDARY, value: ")" },
    ]).parse();
    expect(result).toEqual({
      type: "create",
      table: "users",
      ifNotExists: true,
      definitions: [{ field: "id", type: "NUMERIC" }],
    });
  });

  it("throws error when missing TABLE", () => {
    const result = () =>
      new Parser([{ type: TokenType.KEYWORD, value: "CREATE" }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when IF NOT EXISTS is not complete", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "CREATE" },
        { type: TokenType.KEYWORD, value: "TABLE" },
        { type: TokenType.KEYWORD, value: "IF" },
        { type: TokenType.KEYWORD, value: "NOT" },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing table name", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "CREATE" },
        { type: TokenType.KEYWORD, value: "TABLE" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing fields", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "CREATE" },
        { type: TokenType.KEYWORD, value: "TABLE" },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with empty definition", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "CREATE" },
        { type: TokenType.KEYWORD, value: "TABLE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.BOUNDARY, value: "(" },
        { type: TokenType.BOUNDARY, value: ")" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing field name", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "CREATE" },
        { type: TokenType.KEYWORD, value: "TABLE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.BOUNDARY, value: "(" },
        { type: TokenType.DATA_TYPE, value: "NUMERIC" },
        { type: TokenType.BOUNDARY, value: ")" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing field type", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "CREATE" },
        { type: TokenType.KEYWORD, value: "TABLE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.BOUNDARY, value: "(" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.BOUNDARY, value: ")" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when fields are not separated by commas", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "CREATE" },
        { type: TokenType.KEYWORD, value: "TABLE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.BOUNDARY, value: "(" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.DATA_TYPE, value: "NUMERIC" },
        { type: TokenType.IDENTIFIER, value: "name" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("DROP statement", () => {
  it("parses drop command", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "DROP" },
      { type: TokenType.KEYWORD, value: "TABLE" },
      { type: TokenType.IDENTIFIER, value: "users" },
    ]).parse();
    expect(result).toEqual({
      type: "drop",
      table: "users",
      ifExists: false,
    });
  });

  it("parses IF EXISTS", () => {
    const result = new Parser([
      { type: TokenType.KEYWORD, value: "DROP" },
      { type: TokenType.KEYWORD, value: "TABLE" },
      { type: TokenType.KEYWORD, value: "IF" },
      { type: TokenType.KEYWORD, value: "EXISTS" },
      { type: TokenType.IDENTIFIER, value: "users" },
    ]).parse();
    expect(result).toEqual({
      type: "drop",
      table: "users",
      ifExists: true,
    });
  });

  it("throws error when missing TABLE", () => {
    const result = () =>
      new Parser([{ type: TokenType.KEYWORD, value: "DROP" }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when IF EXISTS is not complete", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "DROP" },
        { type: TokenType.KEYWORD, value: "TABLE" },
        { type: TokenType.KEYWORD, value: "IF" },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when missing table name", () => {
    const result = () =>
      new Parser([
        { type: TokenType.KEYWORD, value: "DROP" },
        { type: TokenType.KEYWORD, value: "TABLE" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});
