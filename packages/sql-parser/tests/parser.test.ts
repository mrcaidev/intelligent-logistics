import { SqlParserError } from "error";
import { Parser } from "parser";
import { TokenType } from "token";
import { describe, expect, it } from "vitest";

describe("SELECT statement", () => {
  it("parses wildcard fields", () => {
    const result = new Parser([
      { type: TokenType.SELECT },
      { type: TokenType.MULTIPLY },
      { type: TokenType.FROM },
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
      { type: TokenType.SELECT },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.FROM },
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
      { type: TokenType.SELECT },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.COMMA },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.COMMA },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.FROM },
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
      { type: TokenType.SELECT },
      { type: TokenType.MULTIPLY },
      { type: TokenType.FROM },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.WHERE },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL },
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
      { type: TokenType.SELECT },
      { type: TokenType.MULTIPLY },
      { type: TokenType.FROM },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.WHERE },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.EQUAL },
      { type: TokenType.LITERAL, value: "John" },
      { type: TokenType.AND },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.LESS_THAN_OR_EQUAL },
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
      { type: TokenType.SELECT },
      { type: TokenType.MULTIPLY },
      { type: TokenType.FROM },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.WHERE },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.EQUAL },
      { type: TokenType.LITERAL, value: "John" },
      { type: TokenType.OR },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.LESS_THAN_OR_EQUAL },
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
      { type: TokenType.SELECT },
      { type: TokenType.MULTIPLY },
      { type: TokenType.FROM },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.WHERE },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.AND },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.EQUAL },
      { type: TokenType.LITERAL, value: "John" },
      { type: TokenType.OR },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.LESS_THAN_OR_EQUAL },
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
    const result = () => new Parser([{ type: TokenType.SELECT }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when multiple fields are not separated by commas", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.IDENTIFIER, value: "name" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when FROM is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT },
        { type: TokenType.MULTIPLY },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when table name is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT },
        { type: TokenType.MULTIPLY },
        { type: TokenType.FROM },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when no condition follows WHERE", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT },
        { type: TokenType.MULTIPLY },
        { type: TokenType.FROM },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.WHERE },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when condition is incomplete", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT },
        { type: TokenType.MULTIPLY },
        { type: TokenType.FROM },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.WHERE },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.EQUAL },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when condition format is invalid", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT },
        { type: TokenType.MULTIPLY },
        { type: TokenType.FROM },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.WHERE },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.EQUAL },
        { type: TokenType.SELECT },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when conditions are not seperated by AND or OR", () => {
    const result = () =>
      new Parser([
        { type: TokenType.SELECT },
        { type: TokenType.MULTIPLY },
        { type: TokenType.FROM },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.WHERE },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.EQUAL },
        { type: TokenType.LITERAL, value: 1 },
        { type: TokenType.IDENTIFIER, value: "name" },
        { type: TokenType.EQUAL },
        { type: TokenType.LITERAL, value: "John" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("INSERT statement", () => {
  it("parses wildcard fields", () => {
    const result = new Parser([
      { type: TokenType.INSERT },
      { type: TokenType.INTO },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.VALUES },
      { type: TokenType.LEFT_PARENTHESIS },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.RIGHT_PARENTHESIS },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: "*",
      values: [[1]],
    });
  });

  it("parses single field", () => {
    const result = new Parser([
      { type: TokenType.INSERT },
      { type: TokenType.INTO },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.LEFT_PARENTHESIS },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.RIGHT_PARENTHESIS },
      { type: TokenType.VALUES },
      { type: TokenType.LEFT_PARENTHESIS },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.RIGHT_PARENTHESIS },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: ["id"],
      values: [[1]],
    });
  });

  it("parses multiple fields", () => {
    const result = new Parser([
      { type: TokenType.INSERT },
      { type: TokenType.INTO },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.LEFT_PARENTHESIS },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.COMMA },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.COMMA },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.RIGHT_PARENTHESIS },
      { type: TokenType.VALUES },
      { type: TokenType.LEFT_PARENTHESIS },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.RIGHT_PARENTHESIS },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: ["id", "name", "age"],
      values: [[1]],
    });
  });

  it("parses multiple values", () => {
    const result = new Parser([
      { type: TokenType.INSERT },
      { type: TokenType.INTO },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.VALUES },
      { type: TokenType.LEFT_PARENTHESIS },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.COMMA },
      { type: TokenType.LITERAL, value: 2 },
      { type: TokenType.COMMA },
      { type: TokenType.LITERAL, value: 3 },
      { type: TokenType.RIGHT_PARENTHESIS },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: "*",
      values: [[1, 2, 3]],
    });
  });

  it("parses multiple lines of values", () => {
    const result = new Parser([
      { type: TokenType.INSERT },
      { type: TokenType.INTO },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.VALUES },
      { type: TokenType.LEFT_PARENTHESIS },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.RIGHT_PARENTHESIS },
      { type: TokenType.COMMA },
      { type: TokenType.LEFT_PARENTHESIS },
      { type: TokenType.LITERAL, value: 2 },
      { type: TokenType.RIGHT_PARENTHESIS },
    ]).parse();
    expect(result).toEqual({
      type: "insert",
      table: "users",
      fields: "*",
      values: [[1], [2]],
    });
  });

  it("throws error when INTO is missing", () => {
    const result = () => new Parser([{ type: TokenType.INSERT }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when table name is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.INSERT },
        { type: TokenType.INTO },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when fields are empty", () => {
    const result = () =>
      new Parser([
        { type: TokenType.INSERT },
        { type: TokenType.INTO },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.LEFT_PARENTHESIS },
        { type: TokenType.RIGHT_PARENTHESIS },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when VALUES is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.INSERT },
        { type: TokenType.INTO },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when values are missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.INSERT },
        { type: TokenType.INTO },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.VALUES },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when values are empty", () => {
    const result = () =>
      new Parser([
        { type: TokenType.INSERT },
        { type: TokenType.INTO },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.VALUES },
        { type: TokenType.LEFT_PARENTHESIS },
        { type: TokenType.RIGHT_PARENTHESIS },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("UPDATE statement", () => {
  it("parses single assignment", () => {
    const result = new Parser([
      { type: TokenType.UPDATE },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.SET },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL },
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
      { type: TokenType.UPDATE },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.SET },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL },
      { type: TokenType.LITERAL, value: 1 },
      { type: TokenType.COMMA },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.EQUAL },
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

  it("parses conditions", () => {
    const result = new Parser([
      { type: TokenType.UPDATE },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.SET },
      { type: TokenType.IDENTIFIER, value: "age" },
      { type: TokenType.EQUAL },
      { type: TokenType.LITERAL, value: 30 },
      { type: TokenType.WHERE },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL },
      { type: TokenType.LITERAL, value: 1 },
    ]).parse();
    expect(result).toEqual({
      type: "update",
      table: "users",
      assignments: [{ field: "age", value: 30 }],
      conditions: [[{ field: "id", operator: "=", value: 1 }]],
    });
  });

  it("throws error when table name is missing", () => {
    const result = () => new Parser([{ type: TokenType.UPDATE }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when SET is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.UPDATE },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when assignments are missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.UPDATE },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.SET },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when assignment is incomplete", () => {
    const result = () =>
      new Parser([
        { type: TokenType.UPDATE },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.SET },
        { type: TokenType.IDENTIFIER, value: "id" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error with incorrect assignments", () => {
    const result = () =>
      new Parser([
        { type: TokenType.UPDATE },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.SET },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.LESS_THAN },
        { type: TokenType.LITERAL, value: 1 },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when assignments are not separated by commas", () => {
    const result = () =>
      new Parser([
        { type: TokenType.UPDATE },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.SET },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.EQUAL },
        { type: TokenType.LITERAL, value: 1 },
        { type: TokenType.IDENTIFIER, value: "age" },
        { type: TokenType.EQUAL },
        { type: TokenType.LITERAL, value: 30 },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("DELETE statement", () => {
  it("parses condition-less deletion", () => {
    const result = new Parser([
      { type: TokenType.DELETE },
      { type: TokenType.FROM },
      { type: TokenType.IDENTIFIER, value: "users" },
    ]).parse();
    expect(result).toEqual({
      type: "delete",
      table: "users",
      conditions: [],
    });
  });

  it("parses conditions", () => {
    const result = new Parser([
      { type: TokenType.DELETE },
      { type: TokenType.FROM },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.WHERE },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.EQUAL },
      { type: TokenType.LITERAL, value: 1 },
    ]).parse();
    expect(result).toEqual({
      type: "delete",
      table: "users",
      conditions: [[{ field: "id", operator: "=", value: 1 }]],
    });
  });

  it("throws error when FROM is missing", () => {
    const result = () => new Parser([{ type: TokenType.DELETE }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when table name is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.DELETE },
        { type: TokenType.FROM },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("CREATE statement", () => {
  it("parses single definition", () => {
    const result = new Parser([
      { type: TokenType.CREATE },
      { type: TokenType.TABLE },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.LEFT_PARENTHESIS },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.NUMERIC },
      { type: TokenType.RIGHT_PARENTHESIS },
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
      { type: TokenType.CREATE },
      { type: TokenType.TABLE },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.LEFT_PARENTHESIS },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.NUMERIC },
      { type: TokenType.COMMA },
      { type: TokenType.IDENTIFIER, value: "name" },
      { type: TokenType.TEXT },
      { type: TokenType.RIGHT_PARENTHESIS },
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
      { type: TokenType.CREATE },
      { type: TokenType.TABLE },
      { type: TokenType.IF },
      { type: TokenType.NOT },
      { type: TokenType.EXISTS },
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.LEFT_PARENTHESIS },
      { type: TokenType.IDENTIFIER, value: "id" },
      { type: TokenType.NUMERIC },
      { type: TokenType.RIGHT_PARENTHESIS },
    ]).parse();
    expect(result).toEqual({
      type: "create",
      table: "users",
      ifNotExists: true,
      definitions: [{ field: "id", type: "NUMERIC" }],
    });
  });

  it("throws error when TABLE is missing", () => {
    const result = () => new Parser([{ type: TokenType.CREATE }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when IF NOT EXISTS is incomplete", () => {
    const result = () =>
      new Parser([
        { type: TokenType.CREATE },
        { type: TokenType.TABLE },
        { type: TokenType.IF },
        { type: TokenType.NOT },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when table name is missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.CREATE },
        { type: TokenType.TABLE },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when fields are missing", () => {
    const result = () =>
      new Parser([
        { type: TokenType.CREATE },
        { type: TokenType.TABLE },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when definitions are empty", () => {
    const result = () =>
      new Parser([
        { type: TokenType.CREATE },
        { type: TokenType.TABLE },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.LEFT_PARENTHESIS },
        { type: TokenType.RIGHT_PARENTHESIS },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when definition is incomplete", () => {
    const result = () =>
      new Parser([
        { type: TokenType.CREATE },
        { type: TokenType.TABLE },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.LEFT_PARENTHESIS },
        { type: TokenType.NUMERIC },
        { type: TokenType.RIGHT_PARENTHESIS },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when definitions are not separated by commas", () => {
    const result = () =>
      new Parser([
        { type: TokenType.CREATE },
        { type: TokenType.TABLE },
        { type: TokenType.IDENTIFIER, value: "users" },
        { type: TokenType.LEFT_PARENTHESIS },
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.NUMERIC },
        { type: TokenType.IDENTIFIER, value: "name" },
        { type: TokenType.TEXT },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("DROP statement", () => {
  it("parses normal dropping", () => {
    const result = new Parser([
      { type: TokenType.DROP },
      { type: TokenType.TABLE },
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
      { type: TokenType.DROP },
      { type: TokenType.TABLE },
      { type: TokenType.IF },
      { type: TokenType.EXISTS },
      { type: TokenType.IDENTIFIER, value: "users" },
    ]).parse();
    expect(result).toEqual({
      type: "drop",
      table: "users",
      ifExists: true,
    });
  });

  it("throws error when TABLE is missing", () => {
    const result = () => new Parser([{ type: TokenType.DROP }]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when IF EXISTS is incomplete", () => {
    const result = () =>
      new Parser([
        { type: TokenType.DROP },
        { type: TokenType.TABLE },
        { type: TokenType.IF },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when table name is missing", () => {
    const result = () =>
      new Parser([{ type: TokenType.DROP }, { type: TokenType.TABLE }]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("invalid statement", () => {
  it("throws error when statement does not start with keyword", () => {
    const result = () =>
      new Parser([
        { type: TokenType.IDENTIFIER, value: "id" },
        { type: TokenType.FROM },
        { type: TokenType.IDENTIFIER, value: "users" },
      ]).parse();
    expect(result).toThrowError(SqlParserError);
  });
});
