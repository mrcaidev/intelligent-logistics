import { SqlParserError } from "error";
import { Parser } from "parser";
import { TokenType } from "token";
import { describe, expect, it } from "vitest";

describe("SELECT statement", () => {
  it("parses wildcard fields", () => {
    const result = new Parser([
      { type: TokenType.SELECT, value: "SELECT" },
      { type: TokenType.MULTIPLY, value: "*" },
      { type: TokenType.FROM, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
    ]).parse();
    expect(result).toEqual({
      type: "select",
      table: "users",
      fields: "*",
      conditions: [],
    });
  });

  it("parses single field", () => {
    const result = new Parser([
      { type: TokenType.SELECT, value: "SELECT" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.FROM, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
    ]).parse();
    expect(result).toEqual({
      type: "select",
      table: "users",
      fields: ["id"],
      conditions: [],
    });
  });

  it("parses multiple fields", () => {
    const result = new Parser([
      { type: TokenType.SELECT, value: "SELECT" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.COMMA, value: "," },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.COMMA, value: "," },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.FROM, value: "FROM" },
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
      { type: TokenType.SELECT, value: "SELECT" },
      { type: TokenType.MULTIPLY, value: "*" },
      { type: TokenType.FROM, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.WHERE, value: "WHERE" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
    ]).parse();
    expect(result).toEqual({
      type: "select",
      table: "users",
      fields: "*",
      conditions: [[{ field: "id", operator: "=", value: 1 }]],
    });
  });

  it("parses multiple conditions joined by AND", () => {
    const result = new Parser([
      { type: TokenType.SELECT, value: "SELECT" },
      { type: TokenType.MULTIPLY, value: "*" },
      { type: TokenType.FROM, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.WHERE, value: "WHERE" },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.EQUAL, value: "=" },
      { type: TokenType.LITERAL, value: "John" },
      { type: TokenType.AND, value: "AND" },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.LESS_THAN, value: "<=" },
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

  it("parses multiple conditions joined by OR", () => {
    const result = new Parser([
      { type: TokenType.SELECT, value: "SELECT" },
      { type: TokenType.MULTIPLY, value: "*" },
      { type: TokenType.FROM, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.WHERE, value: "WHERE" },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.EQUAL, value: "=" },
      { type: TokenType.LITERAL, value: "John" },
      { type: TokenType.OR, value: "OR" },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.LESS_THAN, value: "<=" },
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

  it("parses multiple conditions joined by AND and OR", () => {
    const result = new Parser([
      { type: TokenType.SELECT, value: "SELECT" },
      { type: TokenType.MULTIPLY, value: "*" },
      { type: TokenType.FROM, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.WHERE, value: "WHERE" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.AND, value: "AND" },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.EQUAL, value: "=" },
      { type: TokenType.LITERAL, value: "John" },
      { type: TokenType.OR, value: "OR" },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.LESS_THAN, value: "<=" },
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

  it("throws error when fields are missing", () => {
    const result = () =>
      new Parser([{ type: TokenType.SELECT, value: "SELECT" }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when multiple fields are not separated by commas", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT, value: "SELECT" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.IDENTIFIER, value: "name" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when FROM is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT, value: "SELECT" },
        { type: TokenType.MULTIPLY, value: "*" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when table name is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT, value: "SELECT" },
        { type: TokenType.MULTIPLY, value: "*" },
        { type: TokenType.FROM, value: "FROM" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when no condition follows WHERE", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT, value: "SELECT" },
        { type: TokenType.MULTIPLY, value: "*" },
        { type: TokenType.FROM, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.WHERE, value: "WHERE" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when condition is incomplete", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT, value: "SELECT" },
        { type: TokenType.MULTIPLY, value: "*" },
        { type: TokenType.FROM, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.WHERE, value: "WHERE" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.EQUAL, value: "=" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when condition format is invalid", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT, value: "SELECT" },
        { type: TokenType.MULTIPLY, value: "*" },
        { type: TokenType.FROM, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.WHERE, value: "WHERE" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.EQUAL, value: "=" },
        { type: TokenType.SELECT, value: "SELECT" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when conditions are not seperated by AND or OR", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT, value: "SELECT" },
        { type: TokenType.MULTIPLY, value: "*" },
        { type: TokenType.FROM, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.WHERE, value: "WHERE" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.EQUAL, value: "=" },
        { type: TokenType.LITERAL, value: 1 },
        { type: TokenType.IDENTIFIER, value: "name" },
        { type: TokenType.EQUAL, value: "=" },
        { type: TokenType.LITERAL, value: "John" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("INSERT statement", () => {
  it("parses wildcard fields", () => {
    const result = new Parser([
      { type: TokenType.INSERT, value: "INSERT" },
      { type: TokenType.INTO, value: "INTO" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.VALUES, value: "VALUES" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: "*",
      values: [[1]],
      returning: [],
    });
  });

  it("parses single field", () => {
    const result = new Parser([
      { type: TokenType.INSERT, value: "INSERT" },
      { type: TokenType.INTO, value: "INTO" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
      { type: TokenType.VALUES, value: "VALUES" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: ["id"],
      values: [[1]],
      returning: [],
    });
  });

  it("parses multiple fields", () => {
    const result = new Parser([
      { type: TokenType.INSERT, value: "INSERT" },
      { type: TokenType.INTO, value: "INTO" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.COMMA, value: "," },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.COMMA, value: "," },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
      { type: TokenType.VALUES, value: "VALUES" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: ["id", "name", "age"],
      values: [[1]],
      returning: [],
    });
  });

  it("parses multiple values", () => {
    const result = new Parser([
      { type: TokenType.INSERT, value: "INSERT" },
      { type: TokenType.INTO, value: "INTO" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.VALUES, value: "VALUES" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.COMMA, value: "," },
      { type: TokenType.LITERAL, value: 2 },
      { type: TokenType.COMMA, value: "," },
      { type: TokenType.LITERAL, value: 3 },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: "*",
      values: [[1, 2, 3]],
      returning: [],
    });
  });

  it("parses multiple lines of values", () => {
    const result = new Parser([
      { type: TokenType.INSERT, value: "INSERT" },
      { type: TokenType.INTO, value: "INTO" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.VALUES, value: "VALUES" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
      { type: TokenType.COMMA, value: "," },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.LITERAL, value: 2 },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: "*",
      values: [[1], [2]],
      returning: [],
    });
  });

  it("parses wildcard returning fields", () => {
    const result = new Parser([
      { type: TokenType.INSERT, value: "INSERT" },
      { type: TokenType.INTO, value: "INTO" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.VALUES, value: "VALUES" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
      { type: TokenType.RETURNING, value: "RETURNING" },
      { type: TokenType.MULTIPLY, value: "*" },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: "*",
      values: [[1]],
      returning: "*",
    });
  });

  it("parses single returning field", () => {
    const result = new Parser([
      { type: TokenType.INSERT, value: "INSERT" },
      { type: TokenType.INTO, value: "INTO" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.VALUES, value: "VALUES" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
      { type: TokenType.RETURNING, value: "RETURNING" },
      { type: TokenType.IDENTIFIER, value: "id" },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: "*",
      values: [[1]],
      returning: ["id"],
    });
  });

  it("parses multiple returning fields", () => {
    const result = new Parser([
      { type: TokenType.INSERT, value: "INSERT" },
      { type: TokenType.INTO, value: "INTO" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.VALUES, value: "VALUES" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
      { type: TokenType.RETURNING, value: "RETURNING" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.COMMA, value: "," },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.COMMA, value: "," },
      { type: TokenType.IDENTIFIER, value: "age" },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: "*",
      values: [[1]],
      returning: ["id", "name", "age"],
    });
  });

  it("throws error when INTO is missing", () => {
    const result = () =>
      new Parser([{ type: TokenType.INSERT, value: "INSERT" }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when table name is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.INSERT, value: "INSERT" },
        { type: TokenType.INTO, value: "INTO" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when fields are empty", () => {
    const result = () =>
      new Parser([
        { type: TokenType.INSERT, value: "INSERT" },
        { type: TokenType.INTO, value: "INTO" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.LEFT_PARENTHESIS, value: "(" },
        { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when VALUES is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.INSERT, value: "INSERT" },
        { type: TokenType.INTO, value: "INTO" },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when values are missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.INSERT, value: "INSERT" },
        { type: TokenType.INTO, value: "INTO" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.VALUES, value: "VALUES" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when values are empty", () => {
    const result = () =>
      new Parser([
        { type: TokenType.INSERT, value: "INSERT" },
        { type: TokenType.INTO, value: "INTO" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.VALUES, value: "VALUES" },
        { type: TokenType.LEFT_PARENTHESIS, value: "(" },
        { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when no field follows RETURNING", () => {
    const result = () =>
      new Parser([
        { type: TokenType.INSERT, value: "INSERT" },
        { type: TokenType.INTO, value: "INTO" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.VALUES, value: "VALUES" },
        { type: TokenType.LEFT_PARENTHESIS, value: "(" },
        { type: TokenType.LITERAL, value: 1 },
        { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
        { type: TokenType.RETURNING, value: "RETURNING" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when returning fields are not seperated by commas", () => {
    const result = () =>
      new Parser([
        { type: TokenType.INSERT, value: "INSERT" },
        { type: TokenType.INTO, value: "INTO" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.VALUES, value: "VALUES" },
        { type: TokenType.LEFT_PARENTHESIS, value: "(" },
        { type: TokenType.LITERAL, value: 1 },
        { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
        { type: TokenType.RETURNING, value: "RETURNING" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.IDENTIFIER, value: "name" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("UPDATE statement", () => {
  it("parses single assignment", () => {
    const result = new Parser([
      { type: TokenType.UPDATE, value: "UPDATE" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.SET, value: "SET" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
    ]).parse();
    expect(result).toEqual({
      type: "update",
      table: "users",
      assignments: [{ field: "id", value: 1 }],
      conditions: [],
      returning: [],
    });
  });

  it("parses multiple assignments", () => {
    const result = new Parser([
      { type: TokenType.UPDATE, value: "UPDATE" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.SET, value: "SET" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.COMMA, value: "," },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.EQUAL, value: "=" },
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
      returning: [],
    });
  });

  it("parses conditions", () => {
    const result = new Parser([
      { type: TokenType.UPDATE, value: "UPDATE" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.SET, value: "SET" },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.EQUAL, value: "=" },
      { type: TokenType.LITERAL, value: 30 },
      { type: TokenType.WHERE, value: "WHERE" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
    ]).parse();
    expect(result).toEqual({
      type: "update",
      table: "users",
      assignments: [{ field: "age", value: 30 }],
      conditions: [[{ field: "id", operator: "=", value: 1 }]],
      returning: [],
    });
  });

  it("parses returning fields", () => {
    const result = new Parser([
      { type: TokenType.UPDATE, value: "UPDATE" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.SET, value: "SET" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.RETURNING, value: "RETURNING" },
      { type: TokenType.MULTIPLY, value: "*" },
    ]).parse();
    expect(result).toEqual({
      type: "update",
      table: "users",
      assignments: [{ field: "id", value: 1 }],
      conditions: [],
      returning: "*",
    });
  });

  it("throws error when table name is missing", () => {
    const result = () =>
      new Parser([{ type: TokenType.UPDATE, value: "UPDATE" }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when SET is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.UPDATE, value: "UPDATE" },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when assignments are missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.UPDATE, value: "UPDATE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.SET, value: "SET" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when assignment is incomplete", () => {
    const result = () =>
      new Parser([
        { type: TokenType.UPDATE, value: "UPDATE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.SET, value: "SET" },
        { type: TokenType.IDENTIFIER, value: "id" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incorrect assignments", () => {
    const result = () =>
      new Parser([
        { type: TokenType.UPDATE, value: "UPDATE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.SET, value: "SET" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.LESS_THAN, value: "<" },
        { type: TokenType.LITERAL, value: 1 },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when assignments are not separated by commas", () => {
    const result = () =>
      new Parser([
        { type: TokenType.UPDATE, value: "UPDATE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.SET, value: "SET" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.EQUAL, value: "=" },
        { type: TokenType.LITERAL, value: 1 },
        { type: TokenType.IDENTIFIER, value: "age" },
        { type: TokenType.EQUAL, value: "=" },
        { type: TokenType.LITERAL, value: 30 },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("DELETE statement", () => {
  it("parses condition-less deletion", () => {
    const result = new Parser([
      { type: TokenType.DELETE, value: "DELETE" },
      { type: TokenType.FROM, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
    ]).parse();
    expect(result).toEqual({
      type: "delete",
      table: "users",
      conditions: [],
      returning: [],
    });
  });

  it("parses conditions", () => {
    const result = new Parser([
      { type: TokenType.DELETE, value: "DELETE" },
      { type: TokenType.FROM, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.WHERE, value: "WHERE" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL, value: "=" },
      { type: TokenType.LITERAL, value: 1 },
    ]).parse();
    expect(result).toEqual({
      type: "delete",
      table: "users",
      conditions: [[{ field: "id", operator: "=", value: 1 }]],
      returning: [],
    });
  });

  it("parses returning fields", () => {
    const result = new Parser([
      { type: TokenType.DELETE, value: "DELETE" },
      { type: TokenType.FROM, value: "FROM" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.RETURNING, value: "RETURNING" },
      { type: TokenType.MULTIPLY, value: "*" },
    ]).parse();
    expect(result).toEqual({
      type: "delete",
      table: "users",
      conditions: [],
      returning: "*",
    });
  });

  it("throws error when FROM is missing", () => {
    const result = () =>
      new Parser([{ type: TokenType.DELETE, value: "DELETE" }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when table name is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.DELETE, value: "DELETE" },
        { type: TokenType.FROM, value: "FROM" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("CREATE statement", () => {
  it("parses single definition", () => {
    const result = new Parser([
      { type: TokenType.CREATE, value: "CREATE" },
      { type: TokenType.TABLE, value: "TABLE" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.NUMERIC, value: "NUMERIC" },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
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
      { type: TokenType.CREATE, value: "CREATE" },
      { type: TokenType.TABLE, value: "TABLE" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.NUMERIC, value: "NUMERIC" },
      { type: TokenType.COMMA, value: "," },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.TEXT, value: "TEXT" },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
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
      { type: TokenType.CREATE, value: "CREATE" },
      { type: TokenType.TABLE, value: "TABLE" },
      { type: TokenType.IF, value: "IF" },
      { type: TokenType.NOT, value: "NOT" },
      { type: TokenType.EXISTS, value: "EXISTS" },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.LEFT_PARENTHESIS, value: "(" },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.NUMERIC, value: "NUMERIC" },
      { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
    ]).parse();
    expect(result).toEqual({
      type: "create",
      table: "users",
      ifNotExists: true,
      definitions: [{ field: "id", type: "NUMERIC" }],
    });
  });

  it("throws error when TABLE is missing", () => {
    const result = () =>
      new Parser([{ type: TokenType.CREATE, value: "CREATE" }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when IF NOT EXISTS is incomplete", () => {
    const result = () =>
      new Parser([
        { type: TokenType.CREATE, value: "CREATE" },
        { type: TokenType.TABLE, value: "TABLE" },
        { type: TokenType.IF, value: "IF" },
        { type: TokenType.NOT, value: "NOT" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when table name is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.CREATE, value: "CREATE" },
        { type: TokenType.TABLE, value: "TABLE" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when fields are missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.CREATE, value: "CREATE" },
        { type: TokenType.TABLE, value: "TABLE" },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when definitions are empty", () => {
    const result = () =>
      new Parser([
        { type: TokenType.CREATE, value: "CREATE" },
        { type: TokenType.TABLE, value: "TABLE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.LEFT_PARENTHESIS, value: "(" },
        { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when definition is incomplete", () => {
    const result = () =>
      new Parser([
        { type: TokenType.CREATE, value: "CREATE" },
        { type: TokenType.TABLE, value: "TABLE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.LEFT_PARENTHESIS, value: "(" },
        { type: TokenType.NUMERIC, value: "NUMERIC" },
        { type: TokenType.RIGHT_PARENTHESIS, value: ")" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when definitions are not separated by commas", () => {
    const result = () =>
      new Parser([
        { type: TokenType.CREATE, value: "CREATE" },
        { type: TokenType.TABLE, value: "TABLE" },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.LEFT_PARENTHESIS, value: "(" },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.NUMERIC, value: "NUMERIC" },
        { type: TokenType.IDENTIFIER, value: "name" },
        { type: TokenType.TEXT, value: "TEXT" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("DROP statement", () => {
  it("parses normal dropping", () => {
    const result = new Parser([
      { type: TokenType.DROP, value: "DROP" },
      { type: TokenType.TABLE, value: "TABLE" },
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
      { type: TokenType.DROP, value: "DROP" },
      { type: TokenType.TABLE, value: "TABLE" },
      { type: TokenType.IF, value: "IF" },
      { type: TokenType.EXISTS, value: "EXISTS" },
      { type: TokenType.IDENTIFIER, value: "users" },
    ]).parse();
    expect(result).toEqual({
      type: "drop",
      table: "users",
      ifExists: true,
    });
  });

  it("throws error when TABLE is missing", () => {
    const result = () =>
      new Parser([{ type: TokenType.DROP, value: "DROP" }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when IF EXISTS is incomplete", () => {
    const result = () =>
      new Parser([
        { type: TokenType.DROP, value: "DROP" },
        { type: TokenType.TABLE, value: "TABLE" },
        { type: TokenType.IF, value: "IF" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when table name is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.DROP, value: "DROP" },
        { type: TokenType.TABLE, value: "TABLE" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("invalid statement", () => {
  it("throws error when statement does not start with keyword", () => {
    const result = () =>
      new Parser([
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.FROM, value: "FROM" },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});
