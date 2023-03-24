import { SqlParserError } from "src";
import { Lexer, TokenType } from "src/lexer";
import { describe, expect, it } from "vitest";

describe("invalid initial", () => {
  it("throws error", () => {
    const result = () => new Lexer("{}").tokenize();
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

  it("throws error on invalid number", () => {
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

  it("throws error on unterminated single quoted string", () => {
    const result = () => new Lexer("'John").tokenize();
    expect(result).toThrowError(SqlParserError);
  });

  it("throws error on unterminated double quoted string", () => {
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

describe("keyword", () => {
  it("parses SELECT", () => {
    const result = new Lexer("SELECT").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "SELECT" }]);
  });

  it("parses FROM", () => {
    const result = new Lexer("FROM").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "FROM" }]);
  });

  it("parses WHERE", () => {
    const result = new Lexer("WHERE").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "WHERE" }]);
  });

  it("parses AND", () => {
    const result = new Lexer("AND").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "AND" }]);
  });

  it("parses OR", () => {
    const result = new Lexer("OR").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "OR" }]);
  });

  it("parses INSERT", () => {
    const result = new Lexer("INSERT").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "INSERT" }]);
  });

  it("parses INTO", () => {
    const result = new Lexer("INTO").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "INTO" }]);
  });

  it("parses VALUES", () => {
    const result = new Lexer("VALUES").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "VALUES" }]);
  });

  it("parses UPDATE", () => {
    const result = new Lexer("UPDATE").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "UPDATE" }]);
  });

  it("parses SET", () => {
    const result = new Lexer("SET").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "SET" }]);
  });

  it("parses DELETE", () => {
    const result = new Lexer("DELETE").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "DELETE" }]);
  });

  it("parses CREATE", () => {
    const result = new Lexer("CREATE").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "CREATE" }]);
  });

  it("parses TABLE", () => {
    const result = new Lexer("TABLE").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "TABLE" }]);
  });

  it("ignores case", () => {
    const result = new Lexer("select").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "SELECT" }]);
  });
});

describe("data type", () => {
  it("parses NUMERIC", () => {
    const result = new Lexer("NUMERIC").tokenize();
    expect(result).toEqual([{ type: TokenType.DATA_TYPE, value: "NUMERIC" }]);
  });

  it("parses TEXT", () => {
    const result = new Lexer("TEXT").tokenize();
    expect(result).toEqual([{ type: TokenType.DATA_TYPE, value: "TEXT" }]);
  });

  it("parses BOOLEAN", () => {
    const result = new Lexer("BOOLEAN").tokenize();
    expect(result).toEqual([{ type: TokenType.DATA_TYPE, value: "BOOLEAN" }]);
  });

  it("ignores case", () => {
    const result = new Lexer("numeric").tokenize();
    expect(result).toEqual([{ type: TokenType.DATA_TYPE, value: "NUMERIC" }]);
  });
});

describe("operator", () => {
  it("parses +", () => {
    const result = new Lexer("+").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: "+" }]);
  });

  it("parses -", () => {
    const result = new Lexer("-").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: "-" }]);
  });

  it("parses *", () => {
    const result = new Lexer("*").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: "*" }]);
  });

  it("parses /", () => {
    const result = new Lexer("/").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: "/" }]);
  });

  it("parses =", () => {
    const result = new Lexer("=").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: "=" }]);
  });

  it("parses !=", () => {
    const result = new Lexer("!=").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: "!=" }]);
  });

  it("parses <", () => {
    const result = new Lexer("<").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: "<" }]);
  });

  it("parses >", () => {
    const result = new Lexer(">").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: ">" }]);
  });

  it("parses <=", () => {
    const result = new Lexer("<=").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: "<=" }]);
  });

  it("parses >=", () => {
    const result = new Lexer(">=").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: ">=" }]);
  });

  it("throws error on invalid operator", () => {
    const result = () => new Lexer("==").tokenize();
    expect(result).toThrowError(SqlParserError);
  });
});

describe("identifier", () => {
  it("parses identifier with letters only", () => {
    const result = new Lexer("users").tokenize();
    expect(result).toEqual([{ type: TokenType.IDENTIFIER, value: "users" }]);
  });

  it("parses identifier with digits", () => {
    const result = new Lexer("user1").tokenize();
    expect(result).toEqual([{ type: TokenType.IDENTIFIER, value: "user1" }]);
  });

  it("parses identifier with underscores", () => {
    const result = new Lexer("user_id").tokenize();
    expect(result).toEqual([{ type: TokenType.IDENTIFIER, value: "user_id" }]);
  });
});

describe("boundary", () => {
  it("parses (", () => {
    const result = new Lexer("(").tokenize();
    expect(result).toEqual([{ type: TokenType.BOUNDARY, value: "(" }]);
  });

  it("parses )", () => {
    const result = new Lexer(")").tokenize();
    expect(result).toEqual([{ type: TokenType.BOUNDARY, value: ")" }]);
  });

  it("parses ,", () => {
    const result = new Lexer(",").tokenize();
    expect(result).toEqual([{ type: TokenType.BOUNDARY, value: "," }]);
  });

  it("parses .", () => {
    const result = new Lexer(".").tokenize();
    expect(result).toEqual([{ type: TokenType.BOUNDARY, value: "." }]);
  });
});
