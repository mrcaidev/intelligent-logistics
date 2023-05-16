import { SqlParserError } from "error";
import { Lexer } from "lexer";
import { TokenType } from "token";
import { describe, expect, it } from "vitest";

describe("keyword", () => {
  it("parses SELECT", () => {
    const result = new Lexer("SELECT").tokenize();
    expect(result).toEqual([{ type: TokenType.SELECT, value: "SELECT" }]);
  });

  it("parses FROM", () => {
    const result = new Lexer("FROM").tokenize();
    expect(result).toEqual([{ type: TokenType.FROM, value: "FROM" }]);
  });

  it("parses WHERE", () => {
    const result = new Lexer("WHERE").tokenize();
    expect(result).toEqual([{ type: TokenType.WHERE, value: "WHERE" }]);
  });

  it("parses AND", () => {
    const result = new Lexer("AND").tokenize();
    expect(result).toEqual([{ type: TokenType.AND, value: "AND" }]);
  });

  it("parses OR", () => {
    const result = new Lexer("OR").tokenize();
    expect(result).toEqual([{ type: TokenType.OR, value: "OR" }]);
  });

  it("parses NOT", () => {
    const result = new Lexer("NOT").tokenize();
    expect(result).toEqual([{ type: TokenType.NOT, value: "NOT" }]);
  });

  it("parses INSERT", () => {
    const result = new Lexer("INSERT").tokenize();
    expect(result).toEqual([{ type: TokenType.INSERT, value: "INSERT" }]);
  });

  it("parses INTO", () => {
    const result = new Lexer("INTO").tokenize();
    expect(result).toEqual([{ type: TokenType.INTO, value: "INTO" }]);
  });

  it("parses VALUES", () => {
    const result = new Lexer("VALUES").tokenize();
    expect(result).toEqual([{ type: TokenType.VALUES, value: "VALUES" }]);
  });

  it("parses UPDATE", () => {
    const result = new Lexer("UPDATE").tokenize();
    expect(result).toEqual([{ type: TokenType.UPDATE, value: "UPDATE" }]);
  });

  it("parses SET", () => {
    const result = new Lexer("SET").tokenize();
    expect(result).toEqual([{ type: TokenType.SET, value: "SET" }]);
  });

  it("parses DELETE", () => {
    const result = new Lexer("DELETE").tokenize();
    expect(result).toEqual([{ type: TokenType.DELETE, value: "DELETE" }]);
  });

  it("parses CREATE", () => {
    const result = new Lexer("CREATE").tokenize();
    expect(result).toEqual([{ type: TokenType.CREATE, value: "CREATE" }]);
  });

  it("parses TABLE", () => {
    const result = new Lexer("TABLE").tokenize();
    expect(result).toEqual([{ type: TokenType.TABLE, value: "TABLE" }]);
  });

  it("parses IF", () => {
    const result = new Lexer("IF").tokenize();
    expect(result).toEqual([{ type: TokenType.IF, value: "IF" }]);
  });

  it("parses EXISTS", () => {
    const result = new Lexer("EXISTS").tokenize();
    expect(result).toEqual([{ type: TokenType.EXISTS, value: "EXISTS" }]);
  });

  it("parses DROP", () => {
    const result = new Lexer("DROP").tokenize();
    expect(result).toEqual([{ type: TokenType.DROP, value: "DROP" }]);
  });

  it("parses RETURNING", () => {
    const result = new Lexer("RETURNING").tokenize();
    expect(result).toEqual([{ type: TokenType.RETURNING, value: "RETURNING" }]);
  });

  it("parses NUMERIC", () => {
    const result = new Lexer("NUMERIC").tokenize();
    expect(result).toEqual([{ type: TokenType.NUMERIC, value: "NUMERIC" }]);
  });

  it("parses TEXT", () => {
    const result = new Lexer("TEXT").tokenize();
    expect(result).toEqual([{ type: TokenType.TEXT, value: "TEXT" }]);
  });

  it("parses BOOLEAN", () => {
    const result = new Lexer("BOOLEAN").tokenize();
    expect(result).toEqual([{ type: TokenType.BOOLEAN, value: "BOOLEAN" }]);
  });

  it("ignores case", () => {
    const result = new Lexer("select").tokenize();
    expect(result).toEqual([{ type: TokenType.SELECT, value: "SELECT" }]);
  });
});

describe("operator", () => {
  it("parses =", () => {
    const result = new Lexer("=").tokenize();
    expect(result).toEqual([{ type: TokenType.EQUAL, value: "=" }]);
  });

  it("parses !=", () => {
    const result = new Lexer("!=").tokenize();
    expect(result).toEqual([{ type: TokenType.NOT_EQUAL, value: "!=" }]);
  });

  it("parses >", () => {
    const result = new Lexer(">").tokenize();
    expect(result).toEqual([{ type: TokenType.GREATER_THAN, value: ">" }]);
  });

  it("parses >=", () => {
    const result = new Lexer(">=").tokenize();
    expect(result).toEqual([
      { type: TokenType.GREATER_THAN_OR_EQUAL, value: ">=" },
    ]);
  });

  it("parses <", () => {
    const result = new Lexer("<").tokenize();
    expect(result).toEqual([{ type: TokenType.LESS_THAN, value: "<" }]);
  });

  it("parses <=", () => {
    const result = new Lexer("<=").tokenize();
    expect(result).toEqual([
      { type: TokenType.LESS_THAN_OR_EQUAL, value: "<=" },
    ]);
  });

  it("parses +", () => {
    const result = new Lexer("+").tokenize();
    expect(result).toEqual([{ type: TokenType.ADD, value: "+" }]);
  });

  it("parses -", () => {
    const result = new Lexer("-").tokenize();
    expect(result).toEqual([{ type: TokenType.SUBTRACT, value: "-" }]);
  });

  it("parses *", () => {
    const result = new Lexer("*").tokenize();
    expect(result).toEqual([{ type: TokenType.MULTIPLY, value: "*" }]);
  });

  it("parses /", () => {
    const result = new Lexer("/").tokenize();
    expect(result).toEqual([{ type: TokenType.DIVIDE, value: "/" }]);
  });

  it("throws error when '!' is not followed by '='", () => {
    const result = () => new Lexer("!").tokenize();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("number literal", () => {
  it("parses integer", () => {
    const result = new Lexer("1").tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: 1 }]);
  });

  it("parses decimal", () => {
    const result = new Lexer("1.1").tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: 1.1 }]);
  });

  it("parses negative integer", () => {
    const result = new Lexer("-1").tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: -1 }]);
  });

  it("parses negative decimal", () => {
    const result = new Lexer("-1.1").tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: -1.1 }]);
  });

  it("parses CURRENT_TIMESTAMP", () => {
    const result = new Lexer("CURRENT_TIMESTAMP").tokenize();
    const now = new Date().getTime();
    expect(result[0]?.type).toEqual(TokenType.LITERAL);
    expect((result[0]?.value as number) / 100).toBeCloseTo(now / 100, 0);
  });

  it("throws error when number is invalid", () => {
    const result = () => new Lexer("1.1.1").tokenize();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("string literal", () => {
  it("parses single quoted string", () => {
    const result = new Lexer("'John'").tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: "John" }]);
  });

  it("parses double quoted string", () => {
    const result = new Lexer('"John"').tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: "John" }]);
  });

  it("parses empty single quoted string", () => {
    const result = new Lexer("''").tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: "" }]);
  });

  it("parses empty double quoted string", () => {
    const result = new Lexer('""').tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: "" }]);
  });

  it("parses RANDOM_ID", () => {
    const result = new Lexer("RANDOM_ID").tokenize();
    expect(result[0]?.type).toEqual(TokenType.LITERAL);
    expect(result[0]?.value).toHaveLength(10);
  });

  it("throws error when single quoted string is not terminated", () => {
    const result = () => new Lexer("'John").tokenize();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error when double quoted string is not terminated", () => {
    const result = () => new Lexer('"John').tokenize();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("boolean literal", () => {
  it("parses true", () => {
    const result = new Lexer("TRUE").tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: true }]);
  });

  it("parses false", () => {
    const result = new Lexer("FALSE").tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: false }]);
  });

  it("ignores case", () => {
    const result = new Lexer("true").tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: true }]);
  });
});

describe("null literal", () => {
  it("parses null", () => {
    const result = new Lexer("NULL").tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: null }]);
  });

  it("ignores case", () => {
    const result = new Lexer("null").tokenize();
    expect(result).toEqual([{ type: TokenType.LITERAL, value: null }]);
  });
});

describe("identifier", () => {
  it("parses identifier with letters, digits and underscores", () => {
    const result = new Lexer("a_1").tokenize();
    expect(result).toEqual([{ type: TokenType.IDENTIFIER, value: "a_1" }]);
  });

  it("throws error when identifier starts with underscore", () => {
    const result = () => new Lexer("_a").tokenize();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("boundary", () => {
  it("parses (", () => {
    const result = new Lexer("(").tokenize();
    expect(result).toEqual([{ type: TokenType.LEFT_PARENTHESIS, value: "(" }]);
  });

  it("parses )", () => {
    const result = new Lexer(")").tokenize();
    expect(result).toEqual([{ type: TokenType.RIGHT_PARENTHESIS, value: ")" }]);
  });

  it("parses ,", () => {
    const result = new Lexer(",").tokenize();
    expect(result).toEqual([{ type: TokenType.COMMA, value: "," }]);
  });

  it("parses .", () => {
    const result = new Lexer(".").tokenize();
    expect(result).toEqual([{ type: TokenType.DOT, value: "." }]);
  });
});

describe("invalid initial", () => {
  it("throws error when initial is unknown", () => {
    const result = () => new Lexer("{}").tokenize();
    expect(result).toThrowError(SqlParserError);
  });
});
