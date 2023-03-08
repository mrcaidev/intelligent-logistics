import { LexicalError, LexicalParser } from "src/lexical";
import { describe, expect, it } from "vitest";

describe("empty input", () => {
  it("returns empty list", () => {
    const parser = new LexicalParser("   ");
    expect(parser.parse()).toEqual([]);
  });
});

describe("number literal", () => {
  it("parses integer", () => {
    const parser = new LexicalParser("1");
    expect(parser.parse()).toEqual([{ type: "literal", value: 1 }]);
  });

  it("parses decimal", () => {
    const parser = new LexicalParser("1.1");
    expect(parser.parse()).toEqual([{ type: "literal", value: 1.1 }]);
  });

  it("parses negative integer", () => {
    const parser = new LexicalParser("-1");
    expect(parser.parse()).toEqual([{ type: "literal", value: -1 }]);
  });

  it("parses negative decimal", () => {
    const parser = new LexicalParser("-1.1");
    expect(parser.parse()).toEqual([{ type: "literal", value: -1.1 }]);
  });

  it("throws error on invalid number", () => {
    const parser = new LexicalParser("1.1.1");
    expect(() => parser.parse()).toThrowError(LexicalError);
  });
});

describe("string literal", () => {
  it("parses single quoted string", () => {
    const parser = new LexicalParser("'John'");
    expect(parser.parse()).toEqual([{ type: "literal", value: "John" }]);
  });

  it("parses double quoted string", () => {
    const parser = new LexicalParser('"John"');
    expect(parser.parse()).toEqual([{ type: "literal", value: "John" }]);
  });

  it("parses empty single quoted string", () => {
    const parser = new LexicalParser("''");
    expect(parser.parse()).toEqual([{ type: "literal", value: "" }]);
  });

  it("parses empty double quoted string", () => {
    const parser = new LexicalParser('""');
    expect(parser.parse()).toEqual([{ type: "literal", value: "" }]);
  });

  it("throws error on unterminated single quoted string", () => {
    const parser = new LexicalParser("'John");
    expect(() => parser.parse()).toThrowError(LexicalError);
  });

  it("throws error on unterminated double quoted string", () => {
    const parser = new LexicalParser('"John');
    expect(() => parser.parse()).toThrowError(LexicalError);
  });
});

describe("boolean literal", () => {
  it("parses true", () => {
    const parser = new LexicalParser("true");
    expect(parser.parse()).toEqual([{ type: "literal", value: true }]);
  });

  it("parses false", () => {
    const parser = new LexicalParser("false");
    expect(parser.parse()).toEqual([{ type: "literal", value: false }]);
  });

  it("ignores case", () => {
    const parser = new LexicalParser("TrUe");
    expect(parser.parse()).toEqual([{ type: "literal", value: true }]);
  });
});

describe("null literal", () => {
  it("parses null", () => {
    const parser = new LexicalParser("null");
    expect(parser.parse()).toEqual([{ type: "literal", value: null }]);
  });

  it("ignores case", () => {
    const parser = new LexicalParser("NuLl");
    expect(parser.parse()).toEqual([{ type: "literal", value: null }]);
  });
});

describe("keyword", () => {
  it("parses SELECT", () => {
    const parser = new LexicalParser("SELECT");
    expect(parser.parse()).toEqual([{ type: "keyword", value: "SELECT" }]);
  });

  it("parses FROM", () => {
    const parser = new LexicalParser("FROM");
    expect(parser.parse()).toEqual([{ type: "keyword", value: "FROM" }]);
  });

  it("parses WHERE", () => {
    const parser = new LexicalParser("WHERE");
    expect(parser.parse()).toEqual([{ type: "keyword", value: "WHERE" }]);
  });

  it("parses AND", () => {
    const parser = new LexicalParser("AND");
    expect(parser.parse()).toEqual([{ type: "keyword", value: "AND" }]);
  });

  it("ignores case", () => {
    const parser = new LexicalParser("SeLeCt");
    expect(parser.parse()).toEqual([{ type: "keyword", value: "SELECT" }]);
  });
});

describe("identifier", () => {
  it("parses single word", () => {
    const parser = new LexicalParser("users");
    expect(parser.parse()).toEqual([{ type: "identifier", value: "users" }]);
  });

  it("parses multiple words", () => {
    const parser = new LexicalParser("users.name");
    expect(parser.parse()).toEqual([
      { type: "identifier", value: "users" },
      { type: "operator", value: "." },
      { type: "identifier", value: "name" },
    ]);
  });
});

describe("operator", () => {
  it("parses *", () => {
    const parser = new LexicalParser("*");
    expect(parser.parse()).toEqual([{ type: "operator", value: "*" }]);
  });

  it("parses -", () => {
    const parser = new LexicalParser("-");
    expect(parser.parse()).toEqual([{ type: "operator", value: "-" }]);
  });
});

describe("comment", () => {
  it("parses --", () => {
    const parser = new LexicalParser("-- comment");
    expect(parser.parse()).toEqual([{ type: "comment", value: "--" }]);
  });
});

describe("statements", () => {
  it("parses SELECT * FROM users WHERE salary = 9832.57 AND name = 'John'", () => {
    const parser = new LexicalParser(
      "SELECT * FROM users WHERE salary = 9832.57 AND name = 'John'"
    );
    expect(parser.parse()).toEqual([
      { type: "keyword", value: "SELECT" },
      { type: "operator", value: "*" },
      { type: "keyword", value: "FROM" },
      { type: "identifier", value: "users" },
      { type: "keyword", value: "WHERE" },
      { type: "identifier", value: "salary" },
      { type: "operator", value: "=" },
      { type: "literal", value: 9832.57 },
      { type: "keyword", value: "AND" },
      { type: "identifier", value: "name" },
      { type: "operator", value: "=" },
      { type: "literal", value: "John" },
    ]);
  });

  it("parses INSERT INTO users (name, age) VALUES ('John', 30)", () => {
    const parser = new LexicalParser(
      "INSERT INTO users (name, age) VALUES ('John', 30)"
    );
    expect(parser.parse()).toEqual([
      { type: "keyword", value: "INSERT" },
      { type: "keyword", value: "INTO" },
      { type: "identifier", value: "users" },
      { type: "operator", value: "(" },
      { type: "identifier", value: "name" },
      { type: "operator", value: "," },
      { type: "identifier", value: "age" },
      { type: "operator", value: ")" },
      { type: "keyword", value: "VALUES" },
      { type: "operator", value: "(" },
      { type: "literal", value: "John" },
      { type: "operator", value: "," },
      { type: "literal", value: 30 },
      { type: "operator", value: ")" },
    ]);
  });

  it("parses UPDATE users SET age = 24 WHERE id = 1", () => {
    const parser = new LexicalParser("UPDATE users SET age = 24 WHERE id = 1");
    expect(parser.parse()).toEqual([
      { type: "keyword", value: "UPDATE" },
      { type: "identifier", value: "users" },
      { type: "keyword", value: "SET" },
      { type: "identifier", value: "age" },
      { type: "operator", value: "=" },
      { type: "literal", value: 24 },
      { type: "keyword", value: "WHERE" },
      { type: "identifier", value: "id" },
      { type: "operator", value: "=" },
      { type: "literal", value: 1 },
    ]);
  });

  it("parses DELETE FROM users WHERE id = 1", () => {
    const parser = new LexicalParser("DELETE FROM users WHERE id = 1");
    expect(parser.parse()).toEqual([
      { type: "keyword", value: "DELETE" },
      { type: "keyword", value: "FROM" },
      { type: "identifier", value: "users" },
      { type: "keyword", value: "WHERE" },
      { type: "identifier", value: "id" },
      { type: "operator", value: "=" },
      { type: "literal", value: 1 },
    ]);
  });
});
