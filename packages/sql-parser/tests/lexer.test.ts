import { Lexer, TokenType } from "src/lexer";
import { describe, expect, it } from "vitest";

describe("invalid initial", () => {
  it("throws error", () => {
    const result = () => new Lexer("{}").tokenize();
    expect(result).toThrowError();
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
    expect(result).toThrowError();
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
    expect(result).toThrowError();
  });

  it("throws error on unterminated double quoted string", () => {
    const result = () => new Lexer('"John').tokenize();
    expect(result).toThrowError();
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
  it("parses keyword", () => {
    const result = new Lexer("SELECT").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "SELECT" }]);
  });

  it("ignores case", () => {
    const result = new Lexer("select").tokenize();
    expect(result).toEqual([{ type: TokenType.KEYWORD, value: "SELECT" }]);
  });
});

describe("data type", () => {
  it("parses data type", () => {
    const result = new Lexer("NUMERIC").tokenize();
    expect(result).toEqual([{ type: TokenType.DATA_TYPE, value: "NUMERIC" }]);
  });

  it("ignores case", () => {
    const result = new Lexer("numeric").tokenize();
    expect(result).toEqual([{ type: TokenType.DATA_TYPE, value: "NUMERIC" }]);
  });
});

describe("operator", () => {
  it("parses single-character operator", () => {
    const result = new Lexer("=").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: "=" }]);
  });

  it("parses multi-character operator", () => {
    const result = new Lexer("<=").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: "<=" }]);
  });

  it("parses -", () => {
    const result = new Lexer("-").tokenize();
    expect(result).toEqual([{ type: TokenType.OPERATOR, value: "-" }]);
  });

  it("throws error on invalid operator", () => {
    const result = () => new Lexer("==").tokenize();
    expect(result).toThrowError();
  });
});

describe("identifier", () => {
  it("parses single-word identifier", () => {
    const result = new Lexer("users").tokenize();
    expect(result).toEqual([{ type: TokenType.IDENTIFIER, value: "users" }]);
  });

  it("parses multiple-word identifier", () => {
    const result = new Lexer("users.name").tokenize();
    expect(result).toEqual([
      { type: TokenType.IDENTIFIER, value: "users" },
      { type: TokenType.SYMBOL, value: "." },
      { type: TokenType.IDENTIFIER, value: "name" },
    ]);
  });
});

describe("symbol", () => {
  it("parses symbols", () => {
    const result = new Lexer("()").tokenize();
    expect(result).toEqual([
      { type: TokenType.SYMBOL, value: "(" },
      { type: TokenType.SYMBOL, value: ")" },
    ]);
  });
});
